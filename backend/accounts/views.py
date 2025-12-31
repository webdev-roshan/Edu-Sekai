from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.conf import settings

from .serializers import LoginSerializer, OrganizationRegisterSerializer, UserSerializer
from .utils.jwt_cookies import set_jwt_cookies, clear_jwt_cookies, set_access_cookie
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


class RegisterOrganizationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrganizationRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        return Response(
            {
                "message": "Organization created successfully.",
                "domain_url": result["domain_url"],
                "organization_name": result["organization"].name,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        set_jwt_cookies(response, user)
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        clear_jwt_cookies(response)
        return response


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token not found"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response(
                {"message": "Token refreshed"}, status=status.HTTP_200_OK
            )
            set_access_cookie(response, access_token)
            return response
        except (TokenError, InvalidToken):
            return Response(
                {"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tenant = getattr(request, "tenant", None)

        data = {
            "id": user.id,
            "email": user.email,
            "is_active": user.is_active,
            "profile": None,
            "roles": [],
        }

        if tenant and tenant.schema_name != "public":
            # 1. Fetch Roles for this tenant (select_related for efficiency)
            from roles.models import UserRole

            role_objects = UserRole.objects.filter(
                user=user, organization=tenant
            ).select_related("role")

            role_slugs = [ur.role.slug for ur in role_objects]
            data["roles"] = role_slugs

            # 2. Fetch Profile based on role priority
            from profiles.models import StudentProfile, InstructorProfile, StaffProfile
            from profiles.serializers import (
                StudentProfileSerializer,
                InstructorProfileSerializer,
                StaffProfileSerializer,
            )

            profile = None
            # Check for high-privilege management roles first
            if any(role in ["owner", "staff"] for role in role_slugs):
                profile = StaffProfile.objects.filter(user=user).first()
                if profile:
                    data["profile"] = StaffProfileSerializer(profile).data

            # Then Instruction
            if not data["profile"] and "instructor" in role_slugs:
                profile = InstructorProfile.objects.filter(user=user).first()
                if profile:
                    data["profile"] = InstructorProfileSerializer(profile).data

            # Finally Students
            if not data["profile"] and "student" in role_slugs:
                profile = StudentProfile.objects.filter(user=user).first()
                if profile:
                    data["profile"] = StudentProfileSerializer(profile).data

        return Response(data)
