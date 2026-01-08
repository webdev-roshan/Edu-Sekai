from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import connection
from roles.models import UserRole
from profiles.models import Profile, InstitutionProfile
from django.apps import apps


@receiver(post_save, sender=UserRole)
def create_profile_for_role(sender, instance, created, **kwargs):
    if not created or not instance.is_active:
        return

    user = instance.user

    # We assume we are in the tenant context
    tenant = connection.tenant

    # Safety check: if we are in public schema, we might not want to do this
    # (though UserRole is a tenant model, so this signal should only fire in tenant context)
    if tenant.schema_name == "public":
        return

    # 0. Ensure InstitutionProfile exists
    InstitutionProfile.objects.get_or_create(organization_id=tenant.id)

    role_slug = instance.role.slug

    # SKIP for Students and Instructors: These profiles are created manually
    # during admission/onboarding and linked manually during portal activation.
    # If we let this signal run, it creates a duplicate "New User" profile.
    if role_slug in ["student", "instructor"]:
        return

    # 1. Ensure the 'Identity' Profile exists
    profile, _ = Profile.objects.get_or_create(
        user_id=user.id,
        defaults={
            "first_name": getattr(user, "first_name", "New"),
            "last_name": getattr(user, "last_name", "User"),
        },
    )

    # 2. Create Role-Specific domain data
    if role_slug == "staff" or role_slug == "owner":
        StaffMember = apps.get_model("staff", "StaffMember")
        StaffMember.objects.get_or_create(
            profile=profile,
            defaults={
                "employee_id": f"EMP-{str(user.id)[:8].upper()}",
                "designation": (
                    "Owner / Administrator" if role_slug == "owner" else "Staff"
                ),
            },
        )
