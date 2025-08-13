from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

router = DefaultRouter()

urlpatterns = [
    # --------------------------
    # AUTHENTICATION / USER
    # --------------------------
    path('register/', RegisterUserView.as_view(), name='register'),  # Anyone (AllowAny)
    path('api/logout/', LogoutView.as_view(), name='auth_logout'),    # Authenticated users
    path('me/', UserProfileView.as_view(), name='user-profile'),      # Authenticated users
    path('me/profile/', ProfileUpdateView.as_view(), name='profile-update'), # Authenticated users (update profile)
    path('me/user/', UserUpdateView.as_view(), name='user-update'),   # Authenticated users (update user info)

    # --------------------------
    # INTERNSHIPS
    # --------------------------
    path('internships/', InternshipListView.as_view(), name='internship-list'),           # Anyone
    path('internships/create/', InternshipCreateView.as_view(), name='internship-create'), # Authenticated recruiters
    path('internships/mine/', MyPostedInternshipsView.as_view(), name='my-posted-internships'), # Authenticated recruiters
    path('internships/<int:pk>/view/', InternshipRetrieveView.as_view(), name='internship-view'), # Anyone
    path('internships/<int:pk>/edit/', InternshipEditView.as_view(), name='internship-edit'),     # Authenticated recruiters (only their own)

    # --------------------------
    # APPLICATIONS
    # --------------------------
    path('applications/apply/<int:internship_id>/', ApplyToInternshipView.as_view(), name='apply-to-internship'), # Authenticated students
    path('applications/mine/', StudentApplicationListView.as_view(), name='student-applications'),              # Authenticated students
    path('internships/<int:internship_id>/applicants/', RecruiterApplicantListView.as_view(), name='recruiter-applicants'), # Authenticated recruiters (for their internships)
    path('applications/<int:pk>/status/', ApplicationStatusUpdateView.as_view(), name='update-application-status'),      # Authenticated recruiters (for their internships)
    path('applications/check/<int:internship_id>/', ApplicationCheckView.as_view(), name='application-check'),          # Authenticated students

    # --------------------------
    # BOOKMARKS
    # --------------------------
    path('bookmarks/<int:internship_id>/add/', BookmarkCreateView.as_view(), name='bookmark-add'),      # Authenticated users (any role)
    path('bookmarks/<int:internship_id>/remove/', BookmarkDeleteView.as_view(), name='bookmark-remove'), # Authenticated users (any role)
    path('bookmarks/list/', BookmarkListView.as_view(), name='bookmark-list'),                            # Authenticated users (any role)
    path('bookmarks/check/<int:internship_id>/', BookmarkCheckView.as_view(), name='bookmark-check'),    # Authenticated users (any role)

    # --------------------------
    # ACTIVITY LOGS
    # --------------------------
    path('activity_logs/', UserActivityLogListView.as_view(), name='user-activity-logs'), # Authenticated users (their own activity logs)
]
