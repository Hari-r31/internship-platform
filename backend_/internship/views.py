from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import update_session_auth_hash
from django.core.mail import EmailMessage
from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from django.utils.dateparse import parse_datetime

from .models import Profile, Internship, Application, Bookmark, ActivityLog
from .serializers import (
    UserSerializer, ProfileUpdateSerializer, UserUpdateSerializer,
    UserCreateSerializer, InternshipSerializer, ApplicationCreateSerializer,
    ApplicationListSerializer, ApplicationStatusUpdateSerializer,
    BookmarkSerializer, ActivityLogSerializer, ChangePasswordSerializer
)
from .permissions import IsRecruiter, IsStudent

# --------------------------
# AUTHENTICATION & USER VIEWS
# --------------------------

class RegisterUserView(generics.CreateAPIView):
    """Register a new user with profile data."""
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

class LogoutView(APIView):
    """Blacklist JWT refresh token to log user out."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    """Retrieve the authenticated user's profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class ProfileUpdateView(APIView):
    """Update authenticated user's profile (including picture)."""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        profile = request.user.profile
        serializer = ProfileUpdateSerializer(
            profile, data=request.data, partial=True, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserUpdateView(APIView):
    """Update username or email for authenticated user."""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --------------------------
# PASSWORD RESET & CHANGE
# --------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """Send a password reset link to user's email."""
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "If the email exists, a reset link has been sent."})

    token = default_token_generator.make_token(user)
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{user.pk}/{token}"
    email_message = EmailMessage(
        subject="Password Reset Request",
        body=f"Click the link below to reset your password:\n{reset_url}",
        from_email=f"InternLink <{settings.DEFAULT_FROM_EMAIL}>",
        to=[email],
    )
    email_message.send(fail_silently=False)
    return Response({"message": "If the email exists, a reset link has been sent."})

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request, uid, token):
    """Reset user's password via the token."""
    try:
        user = User.objects.get(pk=uid)
    except User.DoesNotExist:
        return Response({"error": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

    new_password = request.data.get("password")
    if not new_password:
        return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

    user.password = make_password(new_password)
    user.save()
    return Response({"message": "Password reset successful"})

class ChangePasswordView(generics.UpdateAPIView):
    """Change password for authenticated user."""
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            update_session_auth_hash(request, user)
            return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --------------------------
# INTERNSHIP VIEWS
# --------------------------

class InternshipListView(generics.ListAPIView):
    """List all internships with filters and search."""
    queryset = Internship.objects.all().order_by('-posted_on')
    serializer_class = InternshipSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'location': ['exact', 'icontains'],
        'stipend': ['gte', 'lte'],
        'internship_type': ['exact'],
        'posted_on': ['gte', 'lte'],
    }
    search_fields = ['title', 'description', 'location', 'company', 'internship_type']
    ordering_fields = ['posted_on', 'stipend']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class InternshipCreateView(generics.CreateAPIView):
    """Recruiters can post new internships."""
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save(recruiter=request.user)
        return Response(serializer.data, status=201)

class InternshipRetrieveView(generics.RetrieveAPIView):
    """Retrieve details of a single internship (public)."""
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [permissions.AllowAny]

class InternshipEditView(generics.RetrieveUpdateDestroyAPIView):
    """Recruiters can edit or delete their own internships."""
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        if request.user != instance.recruiter:
            raise PermissionDenied("You cannot edit this internship.")
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_destroy(self, instance):
        if self.request.user != instance.recruiter:
            raise PermissionDenied("You cannot delete this internship.")
        instance.delete()

class MyPostedInternshipsView(generics.ListAPIView):
    """List internships posted by the logged-in recruiter."""
    serializer_class = InternshipSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'profile') or user.profile.role != 'recruiter':
            return Internship.objects.none()
        return Internship.objects.filter(recruiter=user).order_by('-posted_on')

# --------------------------
# APPLICATION VIEWS
# --------------------------

class ApplyToInternshipView(generics.CreateAPIView):
    """Students can apply to internships."""
    serializer_class = ApplicationCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        internship_id = self.kwargs['internship_id']
        serializer.save(user=self.request.user, internship_id=internship_id)

class StudentApplicationListView(generics.ListAPIView):
    """List all applications of the logged-in student."""
    serializer_class = ApplicationListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user).order_by('-applied_on')

class RecruiterApplicantListView(generics.ListAPIView):
    """Recruiters can view applications for their internships."""
    serializer_class = ApplicationListSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        internship_id = self.kwargs['internship_id']
        return Application.objects.filter(
            internship__recruiter=self.request.user,
            internship_id=internship_id
        ).order_by('-applied_on')

class ApplicationStatusUpdateView(generics.UpdateAPIView):
    """Recruiters can update application status."""
    serializer_class = ApplicationStatusUpdateSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]
    queryset = Application.objects.all()

class ApplicationCheckView(APIView):
    """Check if student has already applied."""
    permission_classes = [IsAuthenticated]

    def get(self, request, internship_id):
        applied = Application.objects.filter(internship_id=internship_id, user=request.user).exists()
        return Response({"applied": applied})

# --------------------------
# BOOKMARK VIEWS
# --------------------------

class BookmarkCreateView(generics.CreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        internship_id = self.kwargs['internship_id']
        serializer.save(user=self.request.user, internship_id=internship_id)

class BookmarkDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        internship_id = self.kwargs['internship_id']
        try:
            return Bookmark.objects.get(user=user, internship_id=internship_id)
        except Bookmark.DoesNotExist:
            raise NotFound(detail="Bookmark not found.")

class BookmarkCheckView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, internship_id):
        exists = Bookmark.objects.filter(internship_id=internship_id, user=request.user).exists()
        return Response({"bookmarked": exists})

class BookmarkListView(generics.ListAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).order_by('-bookmarked_on')

# --------------------------
# ACTIVITY LOG VIEWS
# --------------------------

class UserActivityLogListView(generics.ListAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = ActivityLog.objects.filter(user=user)
        action = self.request.query_params.get('action')
        if action:
            if action not in dict(ActivityLog.ACTION_CHOICES):
                raise ValidationError({"action": "Invalid action filter"})
            queryset = queryset.filter(action=action)
        start = self.request.query_params.get('start_date')
        end = self.request.query_params.get('end_date')
        if start:
            start_dt = parse_datetime(start)
            if not start_dt:
                raise ValidationError({"start_date": "Invalid datetime format"})
            queryset = queryset.filter(timestamp__gte=start_dt)
        if end:
            end_dt = parse_datetime(end)
            if not end_dt:
                raise ValidationError({"end_date": "Invalid datetime format"})
            queryset = queryset.filter(timestamp__lte=end_dt)
        return queryset.order_by('-timestamp')
