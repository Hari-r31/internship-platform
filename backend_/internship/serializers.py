from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from .supabase_storage import upload_file, get_public_url
import uuid

# ==========================
# PROFILE SERIALIZERS
# ==========================
class ProfileSerializer(serializers.ModelSerializer):
    """
    Serialize Profile info for read-only display.
    """
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'bio', 'location', 'role', 'profile_picture_url']

    def get_profile_picture_url(self, obj):
        """
        Return the public URL of profile picture if exists.
        """
        return obj.profile_picture_url or None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile and uploading profile picture.
    """
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'bio', 'location']
        read_only_fields = ['role']

    def update(self, instance, validated_data):
        # Update basic fields
        for attr in ['first_name', 'last_name', 'bio', 'location']:
            if attr in validated_data:
                setattr(instance, attr, validated_data[attr])

        # Handle profile picture upload
        request = self.context.get('request')
        if request and hasattr(request, 'FILES') and 'profile_picture' in request.FILES:
            profile_pic = request.FILES['profile_picture']
            bucket_name = "profile_pics"
            file_ext = profile_pic.name.split('.')[-1]
            file_path = f"{instance.user.id}/{uuid.uuid4()}.{file_ext}"
            upload_file(bucket_name, file_path, profile_pic)
            instance.profile_picture_url = get_public_url(bucket_name, file_path)

        instance.save()
        return instance


# ==========================
# USER SERIALIZERS
# ==========================
class UserSerializer(serializers.ModelSerializer):
    """
    Include profile details when fetching User info.
    """
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Update basic user info (username/email).
    """
    class Meta:
        model = User
        fields = ['username', 'email']
        extra_kwargs = {'email': {'required': True}, 'username': {'required': True}}


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Create a new user with password and profile info.
    """
    profile = ProfileSerializer()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'profile']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        profile = user.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return user


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing password.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value


# ==========================
# INTERNSHIP SERIALIZER
# ==========================
class InternshipSerializer(serializers.ModelSerializer):
    """
    Serializer for Internship model with optional bookmarked status.
    """
    expiry_date = serializers.DateField(
        input_formats=['%Y-%m-%d', '%m/%d/%Y', '%d-%m-%Y'], required=False
    )
    bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Internship
        fields = '__all__'
        read_only_fields = ['recruiter', 'posted_on']

    def get_bookmarked(self, obj):
        user = self.context['request'].user
        if user.is_authenticated and user.profile.role == 'student':
            return obj.bookmarked_by.filter(user=user).exists()
        return False


# ==========================
# APPLICATION SERIALIZERS
# ==========================
class ApplicationCreateSerializer(serializers.ModelSerializer):
    """
    For students to apply to an internship. Resume is optional.
    """
    class Meta:
        model = Application
        fields = ['resume']
        extra_kwargs = {'resume': {'required': False, 'allow_null': True}}

    def validate(self, data):
        user = self.context['request'].user
        internship_id = self.context['view'].kwargs['internship_id']

        if not hasattr(user, 'profile') or user.profile.role != 'student':
            raise serializers.ValidationError("Only students can apply.")

        if Application.objects.filter(internship_id=internship_id, user=user).exists():
            raise serializers.ValidationError("You have already applied for this internship.")

        return data


class ApplicationListSerializer(serializers.ModelSerializer):
    """
    Show all application details along with user info and internship info.
    """
    internship = InternshipSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'internship', 'resume', 'status', 'applied_on', 'user']


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    """
    Only used by recruiters to update application status.
    """
    class Meta:
        model = Application
        fields = ['status']


# ==========================
# BOOKMARK SERIALIZER
# ==========================
class BookmarkSerializer(serializers.ModelSerializer):
    """
    Show basic info of bookmarked internships.
    """
    internship_title = serializers.CharField(source='internship.title', read_only=True)
    internship_company = serializers.CharField(source='internship.company', read_only=True)
    internship_location = serializers.CharField(source='internship.location', read_only=True)

    class Meta:
        model = Bookmark
        fields = [
            'id', 'internship', 'internship_title', 'internship_company', 'internship_location', 'bookmarked_on'
        ]
        read_only_fields = ['id', 'internship_title', 'internship_company', 'internship_location', 'bookmarked_on']
        extra_kwargs = {'internship': {'required': False}}


# ==========================
# ACTIVITY LOG SERIALIZER
# ==========================
class ActivityLogSerializer(serializers.ModelSerializer):
    """
    Serialize activity logs for audit or user tracking.
    """
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action', 'related_object_id', 'timestamp', 'details']
        read_only_fields = ['id', 'user', 'timestamp', 'details']
