from rest_framework import serializers
from .models import StudentProfile, InstructorProfile, StaffProfile, InstitutionProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = "__all__"
        read_only_fields = ("user", "organization")


class InstructorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructorProfile
        fields = "__all__"
        read_only_fields = ("user", "organization")


class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = "__all__"
        read_only_fields = ("user", "organization")


class InstitutionProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstitutionProfile
        fields = "__all__"
        read_only_fields = ("organization",)
