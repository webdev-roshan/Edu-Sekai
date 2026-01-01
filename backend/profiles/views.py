from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import StudentProfile, InstructorProfile, StaffProfile, InstitutionProfile
from .serializers import (
    StudentProfileSerializer,
    InstructorProfileSerializer,
    StaffProfileSerializer,
    InstitutionProfileSerializer,
)
from django.db import connection


class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get_profile_object(self, user):
        # In a tenant context, 'connection.tenant' should be set by django-tenants middleware
        tenant = getattr(connection, "tenant", None)
        if not tenant:
            return None, None

        # Check Staff first
        profile = StaffProfile.objects.filter(user=user, organization=tenant).first()
        if profile:
            return profile, StaffProfileSerializer

        # Then Instructor
        profile = InstructorProfile.objects.filter(
            user=user, organization=tenant
        ).first()
        if profile:
            return profile, InstructorProfileSerializer

        # Then Student
        profile = StudentProfile.objects.filter(user=user, organization=tenant).first()
        if profile:
            return profile, StudentProfileSerializer

        return None, None

    def get(self, request):
        profile, serializer_class = self.get_profile_object(request.user)
        if not profile:
            return Response(
                {"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = serializer_class(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, serializer_class = self.get_profile_object(request.user)
        if not profile:
            return Response(
                {"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = serializer_class(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InstitutionProfileView(APIView):
    def get_permissions(self):
        from roles.permissions import HasPermission

        if self.request.method == "GET":
            return [IsAuthenticated(), HasPermission("view_institution_profile")]
        elif self.request.method == "PATCH":
            return [IsAuthenticated(), HasPermission("edit_institution_profile")]
        return [IsAuthenticated()]

    def get_object(self):
        tenant = getattr(connection, "tenant", None)
        return InstitutionProfile.objects.filter(organization=tenant).first()

    def get(self, request):
        profile = self.get_object()
        if not profile:
            return Response(
                {"error": "Institution profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = InstitutionProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = self.get_object()
        if not profile:
            return Response(
                {"error": "Institution profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = InstitutionProfileSerializer(
            profile, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
