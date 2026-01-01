from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def seed_roles(sender, **kwargs):
    if sender.name == "roles":
        from .models import Role, Permission
        from .constants import SYSTEM_PERMISSIONS

        # 1. Seed Permissions
        created_permissions = []
        for perm_data in SYSTEM_PERMISSIONS:
            permission, _ = Permission.objects.update_or_create(
                codename=perm_data["codename"],
                defaults={
                    "name": perm_data["name"],
                    "module": perm_data["module"],
                    "description": perm_data["description"],
                },
            )
            created_permissions.append(permission)

        # 2. Seed System Roles
        roles = [
            {
                "slug": "owner",
                "name": "Owner",
                "description": "Instance owner and primary administrator",
            },
            {
                "slug": "staff",
                "name": "Staff",
                "description": "Non-teaching administrative staff",
            },
            {
                "slug": "instructor",
                "name": "Instructor",
                "description": "Teaching faculty and instructors",
            },
            {"slug": "student", "name": "Student", "description": "Enrolled students"},
        ]

        for role_data in roles:
            role, created = Role.objects.update_or_create(
                slug=role_data["slug"],
                defaults={
                    "name": role_data["name"],
                    "description": role_data["description"],
                    "is_system_role": True,
                },
            )

            # 3. Assign All Permissions to Owner
            if role.slug == "owner":
                role.permissions.set(created_permissions)
