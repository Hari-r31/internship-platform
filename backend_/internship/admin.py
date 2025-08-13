from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile, Internship, Application, Bookmark, ActivityLog, RatingReview

# Profile inline for User admin
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role', 'is_staff')
    list_select_related = ('profile',)

    def get_role(self, instance):
        return instance.profile.role if hasattr(instance, 'profile') else '-'
    get_role.short_description = 'Role'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('profile')

    def has_change_permission(self, request, obj=None):
        # Only superusers or staff can change users
        return request.user.is_superuser or (request.user.is_staff and obj is None)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'recruiter', 'location', 'stipend', 'internship_type', 'posted_on', 'status', 'expiry_date')
    list_filter = ('location', 'internship_type', 'status', 'posted_on')
    search_fields = ('title', 'description', 'company', 'location', 'recruiter__username')
    ordering = ('-posted_on',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('recruiter')

    def has_change_permission(self, request, obj=None):
        # Superuser can change all, recruiters only their internships
        if request.user.is_superuser:
            return True
        if obj is None:
            return True  # For list view
        return obj.recruiter == request.user

    def has_delete_permission(self, request, obj=None):
        return self.has_change_permission(request, obj)


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'internship', 'status', 'applied_on')
    list_filter = ('status', 'applied_on')
    search_fields = ('user__username', 'internship__title')
    ordering = ('-applied_on',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'internship')


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'internship', 'bookmarked_on')
    list_filter = ('bookmarked_on',)
    search_fields = ('user__username', 'internship__title')
    ordering = ('-bookmarked_on',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'internship')


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'related_object_id', 'timestamp', 'details')
    list_filter = ('action', 'timestamp')
    search_fields = ('user__username', 'details')
    ordering = ('-timestamp',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')


@admin.register(RatingReview)
class RatingReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'internship', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'internship__title')
    ordering = ('-created_at',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user', 'internship')
