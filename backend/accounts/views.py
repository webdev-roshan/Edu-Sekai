from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.conf import settings

from .serializers import LoginSerializer, OrganizationRegisterSerializer
from .utils.jwt_cookies import set_jwt_cookies


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
