from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# --------------------------
# USER PROFILE
# --------------------------
class Profile(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True,)
    # profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    profile_picture_path = models.CharField(max_length=255, blank=True, null=True)
    profile_picture_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f"{self.user.username}'s profile"

# Access:
# - Users can view their own profile (authenticated)
# - Users can update their own profile (ProfileUpdateView)
# - Admins can manage all profiles

# --------------------------
# INTERNSHIP
# --------------------------
class Internship(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('archived', 'Archived'),
    )
    INTERNSHIP_TYPES = (
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('remote', 'Remote'),
        ('on-site', 'On-site'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    stipend = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    internship_type = models.CharField(max_length=100)
    apply_link = models.URLField(max_length=500, blank=True, null=True)
    posted_on = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    expiry_date = models.DateField(null=True, blank=True)
    recruiter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='internships')

    def __str__(self):
        return f"{self.title} at {self.company}"

# Access:
# - Anyone can list or view internships
# - Only recruiters can create/edit/delete their own internships
# - Students can apply to open internships

# --------------------------
# APPLICATION
# --------------------------
class Application(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    applied_on = models.DateTimeField(auto_now_add=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)

    class Meta:
        unique_together = ('internship', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.internship.title} ({self.status})"

# Access:
# - Students can create applications for internships
# - Students can view their own applications
# - Recruiters can view applications for their internships
# - Recruiters can update application status

# --------------------------
# BOOKMARK
# --------------------------
class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='bookmarked_by')
    bookmarked_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'internship')

    def __str__(self):
        return f"{self.user.username} bookmarked {self.internship.title}"

# Access:
# - Any authenticated user can add/remove bookmarks
# - Users can only see their own bookmarks

# --------------------------
# ACTIVITY LOG
# --------------------------
class ActivityLog(models.Model):
    ACTION_CHOICES = (
        ('internship_posted', 'Internship Posted'),
        ('internship_updated', 'Internship Updated'),
        ('internship_deleted', 'Internship Deleted'),
        ('application_submitted', 'Application Submitted'),
        ('application_status_changed', 'Application Status Changed'),
        ('application_withdrawn', 'Application Withdrawn'),
        ('bookmark_added', 'Bookmark Added'),
        ('bookmark_removed', 'Bookmark Removed'),
        ('profile_updated', 'Profile Updated'),
        ('profile_picture_updated', 'Profile Picture Updated'),
        ('login', 'User Logged In'),
        ('logout', 'User Logged Out'),
        ('password_changed', 'Password Changed'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)  # e.g. internship or application id
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)  # optional JSON/details as string

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"

# Access:
# - Users can only view their own activity logs
# - Admins can view all activity logs

# --------------------------
# RATING & REVIEW
# --------------------------
class RatingReview(models.Model):
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    review = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('internship', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.internship.title} - {self.rating}"

# Access:
# - Authenticated students can submit reviews for internships they applied to
# - Users can only update/delete their own review
# - Recruiters can view reviews for their internships
