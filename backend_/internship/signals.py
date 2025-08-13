from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Internship, Application, Bookmark, ActivityLog

# Internship signals

@receiver(post_save, sender=Internship)
def log_internship_posted_or_updated(sender, instance, created, **kwargs):
    action = 'internship_posted' if created else 'internship_updated'
    ActivityLog.objects.create(
        user=instance.recruiter,
        action=action,
        related_object_id=instance.id,
        details=f"{instance.title}"
    )

@receiver(post_delete, sender=Internship)
def log_internship_deleted(sender, instance, **kwargs):
    ActivityLog.objects.create(
        user=instance.recruiter,
        action='internship_deleted',
        related_object_id=instance.id,
        details=f"{instance.title}"
    )

# Application signals

@receiver(post_save, sender=Application)
def log_application_submitted_or_status_changed(sender, instance, created, **kwargs):
    if created:
        action = 'application_submitted'
        details = f"Applied to {instance.internship.title}"
    else:
        # You might want to track status changes only
        action = 'application_status_changed'
        details = f"Status changed to {instance.status} for {instance.internship.title}"

    ActivityLog.objects.create(
        user=instance.user,
        action=action,
        related_object_id=instance.id,
        details=details
    )

# Bookmark signals

@receiver(post_save, sender=Bookmark)
def log_bookmark_added(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(
            user=instance.user,
            action='bookmark_added',
            related_object_id=instance.internship.id,
            details=f"Bookmarked {instance.internship.title}"
        )

@receiver(post_delete, sender=Bookmark)
def log_bookmark_removed(sender, instance, **kwargs):
    ActivityLog.objects.create(
        user=instance.user,
        action='bookmark_removed',
        related_object_id=instance.internship.id,
        details=f"Removed bookmark {instance.internship.title}"
    )
# Profile signals
@receiver(post_save, sender=Profile)
def log_profile_updated(sender, instance, created, **kwargs):
    if created:
        action = 'profile_created'
    else:
        action = 'profile_updated'

    ActivityLog.objects.create(
        user=instance.user,
        action=action,
        related_object_id=instance.id,
        details=f"Profile updated for {instance.user.username}"
    )
