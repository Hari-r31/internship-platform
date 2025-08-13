from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from rest_framework.response import Response

# --------------------------
# PROFILE SERIALIZERS
# --------------------------
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'profile_picture', 'bio', 'location', 'role']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'profile_picture', 'bio', 'location', 'role']
        read_only_fields = ['role']

# --------------------------
# USER SERIALIZERS
# --------------------------
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }

class UserCreateSerializer(serializers.ModelSerializer):
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

# --------------------------
# INTERNSHIP SERIALIZER
# --------------------------
class InternshipSerializer(serializers.ModelSerializer):
    expiry_date = serializers.DateField(
        input_formats=['%Y-%m-%d', '%m/%d/%Y', '%d-%m-%Y'],
        required=False
    )

    class Meta:
        model = Internship
        fields = '__all__'
        read_only_fields = ['recruiter', 'date_posted']

# --------------------------
# APPLICATION SERIALIZERS
# --------------------------
class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['resume']  # No need for 'internship' in the request body
        extra_kwargs = {
            'resume': {'required': False, 'allow_null': True}
        }

    def validate(self, data):
        user = self.context['request'].user
        internship_id = self.context['view'].kwargs['internship_id']

        # Only students can apply
        if not hasattr(user, 'profile') or user.profile.role != 'student':
            raise serializers.ValidationError("Only students can apply.")

        # Check duplicate application
        if Application.objects.filter(internship_id=internship_id, user=user).exists():
            raise serializers.ValidationError("You have already applied for this internship.")

        return data

class ApplicationListSerializer(serializers.ModelSerializer):
    internship = InternshipSerializer(read_only=True)  # full internship details
    user = UserSerializer(read_only=True)              # include user info

    class Meta:
        model = Application
        fields = ['id', 'internship', 'resume', 'status', 'applied_on', 'user']

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "first_name": obj.user.first_name,
            "last_name": obj.user.last_name,
            "email": obj.user.email
        }

class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['status']

# --------------------------
# BOOKMARK SERIALIZER
# --------------------------
class BookmarkSerializer(serializers.ModelSerializer):
    internship_title = serializers.CharField(source='internship.title', read_only=True)
    internship_company = serializers.CharField(source='internship.company', read_only=True)
    internship_location = serializers.CharField(source='internship.location', read_only=True)

    class Meta:
        model = Bookmark
        fields = [
            'id',
            'internship',
            'internship_title',
            'internship_company',
            'internship_location',
            'bookmarked_on'
        ]
        read_only_fields = ['id', 'internship_title', 'internship_company', 'internship_location', 'bookmarked_on']
        extra_kwargs = {
            'internship': {'required': False}
        }

# --------------------------
# ACTIVITY LOG SERIALIZER
# --------------------------
class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action', 'related_object_id', 'timestamp', 'details']
        read_only_fields = ['id', 'user', 'timestamp', 'details']
