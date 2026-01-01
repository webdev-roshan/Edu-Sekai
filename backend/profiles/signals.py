from django.db.models.signals import post_save
from django.dispatch import receiver
from django_tenants.utils import tenant_context
from roles.models import UserRole
from organizations.models import Organization
from .models import StudentProfile, InstructorProfile, StaffProfile, InstitutionProfile


@receiver(post_save, sender=Organization)
def create_institution_profile(sender, instance, created, **kwargs):
    if created:
        with tenant_context(instance):
            InstitutionProfile.objects.get_or_create(organization=instance)


@receiver(post_save, sender=UserRole)
def create_profile_for_role(sender, instance, created, **kwargs):
    if not created or not instance.is_active:
        return

    user = instance.user
    org = instance.organization
    role_slug = instance.role.slug

    if role_slug == "student":
        StudentProfile.objects.get_or_create(
            user=user,
            organization=org,
            defaults={"enrollment_id": f"STD-{user.id}"},
        )

    elif role_slug == "instructor":
        InstructorProfile.objects.get_or_create(
            user=user,
            organization=org,
            defaults={"employee_id": f"EMP-{user.id}"},
        )

    elif role_slug == "staff" or role_slug == "owner":
        StaffProfile.objects.get_or_create(
            user=user,
            organization=org,
            defaults={
                "employee_id": f"EMP-{user.id}",
                "designation": (
                    "Owner / Administrator" if role_slug == "owner" else "Staff"
                ),
            },
        )
