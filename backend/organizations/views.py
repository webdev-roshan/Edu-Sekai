from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import models
from .models import Domain


class CheckDomainView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        domain_name = request.query_params.get("domain")
        if not domain_name:
            return Response(
                {"error": "Domain parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check for subdomain.localhost or full domain
        exists = Domain.objects.filter(
            models.Q(domain__iexact=domain_name)
            | models.Q(domain__iexact=f"{domain_name}.localhost")
        ).exists()

        return Response({"exists": exists})
