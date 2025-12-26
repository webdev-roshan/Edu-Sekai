from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import Payment
from .utils import generate_esewa_signature
from accounts.serializers import OrganizationRegisterSerializer
import uuid


class InitPaymentView(APIView):
    def post(self, request):
        data = request.data
        amount = "5000"  # Fixed amount for now

        # Validate registration data first (without saving)
        # We assume frontend sends necessary fields

        transaction_uuid = str(uuid.uuid4())

        # Create pending payment record
        Payment.objects.create(
            transaction_uuid=transaction_uuid,
            amount=amount,
            organization_name=data.get("organization_name"),
            subdomain=data.get("subdomain"),
            email=data.get("email"),
            phone=data.get("phone"),
            password=data.get("password"),
        )

        # Generate Signature
        # Message: total_amount,transaction_uuid,product_code
        product_code = "EPAYTEST"  # Use 'EPAYTEST' for testing, or real code in prod
        message = f"{amount},{transaction_uuid},{product_code}"
        signature = generate_esewa_signature(settings.ESEWA_CLIENT_SECRET, message)

        return Response(
            {
                "signature": signature,
                "transaction_uuid": transaction_uuid,
                "product_code": product_code,
                "amount": amount,
                "url": settings.ESEWA_URL,
            }
        )


class VerifyPaymentView(APIView):
    def get(self, request):
        # eSewa redirects here with data? Or Frontend calls this?
        # Usually Frontend handles redirect, then calls Backend to verify.
        # Let's assume Frontend sends the data it received from eSewa redirect.

        # For eSewa API v2, we might need to check status
        # This is a placeholder for the verify logic
        data = request.query_params
        encoded_data = data.get(
            "data"
        )  # eSewa sends a base64 encoded JSON on success url?

        # Validating...
        # If valid, retrieve Payment record
        # Create Organization using OrganizationRegisterSerializer

        return Response({"message": "Payment verified and Tenant created"})
