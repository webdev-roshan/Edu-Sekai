from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.db import transaction
from django.conf import settings

from accounts.models import User
from organizations.models import Organization, Domain
from roles.models import Role, UserRole


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed("Invalid credentials")

        if not user.is_active:
            raise AuthenticationFailed("User account is disabled")

        attrs["user"] = user
        return attrs


class OrganizationRegisterSerializer(serializers.Serializer):
    organization_name = serializers.CharField(max_length=255)
    subdomain = serializers.SlugField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=50, required=False)
    last_name = serializers.CharField(max_length=50, required=False)

    def validate_subdomain(self, value):
        if Organization.objects.filter(schema_name=value).exists():
            raise serializers.ValidationError("This subdomain is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        org_name = validated_data["organization_name"]
        subdomain = validated_data["subdomain"]
        email = validated_data["email"]
        password = validated_data["password"]

        base_domain = "localhost"
        full_domain_name = f"{subdomain}.{base_domain}"

        with transaction.atomic():
            organization = Organization.objects.create(
                name=org_name,
                schema_name=subdomain,  # Using subdomain as schema name
            )

            # 2. Create Domain
            domain = Domain.objects.create(
                domain=full_domain_name, tenant=organization, is_primary=True
            )

            # 3. Create User (in Public Schema - User is Shared)
            user = User.objects.create_user(email=email, password=password)

            # 4. Create "Owner" Role if not exists (Public Schema)
            owner_role, _ = Role.objects.get_or_create(
                slug="owner", defaults={"name": "Owner", "is_system_role": True}
            )

            # 5. Link User to Org with Role (Public Schema)
            UserRole.objects.create(
                user=user, organization=organization, role=owner_role
            )

            # Note: We might want to create a Profile inside the Tenant Schema?
            # If Profiles are in TENANT_APPS, we must context-switch to create it.
            # But the User is global. The profile depends on the Tenant.
            # Let's create a minimal Owner Profile inside the tenant.

            from django_tenants.utils import tenant_context
            from profiles.models import StaffProfile

            with tenant_context(organization):
                # Now we are in the tenant schema
                # StaffProfile requires fields. Let's create a basic one.
                # Assuming 'StaffProfile' is sufficient for Admin.
                StaffProfile.objects.create(
                    user=user,  # User is cross-schema referenced (Shared)
                    organization=organization,  # This might be redundant if data is isolated, but model has it.
                    first_name=validated_data.get("first_name", ""),
                    last_name=validated_data.get("last_name", ""),
                    employee_id="ADMIN-001",
                    designation="System Administrator",
                    department="Administration",
                )

        return {
            "organization": organization,
            "domain": domain,
            "user": user,
            "domain_url": f"http://{full_domain_name}:8000",  # helpful for frontend
        }
