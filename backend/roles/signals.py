from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def seed_roles(sender, **kwargs):
    if sender.name == "roles":
        from .models import Role

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
            Role.objects.update_or_create(
                slug=role_data["slug"],
                defaults={
                    "name": role_data["name"],
                    "description": role_data["description"],
                    "is_system_role": True,
                },
            )
