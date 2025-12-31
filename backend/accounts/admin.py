from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from roles.models import UserRole


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("email", "is_staff", "is_active", "created_at")
    list_filter = ("is_staff", "is_active")
    search_fields = ("email",)
    ordering = ("email",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "is_staff", "is_active"),
            },
        ),
    )

    def delete_model(self, request, obj):
        """Custom delete to handle tenant-specific data."""
        self._delete_user_related_data(obj)
        super().delete_model(request, obj)

    def delete_queryset(self, request, queryset):
        """Custom bulk delete to handle tenant-specific data."""
        for obj in queryset:
            self._delete_user_related_data(obj)
        super().delete_queryset(request, queryset)

    def _delete_user_related_data(self, user):
        """Iterates through all tenants to delete user profiles/roles."""
        from django_tenants.utils import tenant_context
        from organizations.models import Organization
        from profiles.models import StudentProfile, InstructorProfile, StaffProfile

        # 1. Delete Global UserRoles (since roles is a SHARED_APP)
        UserRole.objects.filter(user=user).delete()

        # 2. Loop through all tenants to delete profiles
        for tenant in Organization.objects.all():
            with tenant_context(tenant):
                # Delete all profile types
                StudentProfile.objects.filter(user=user).delete()
                InstructorProfile.objects.filter(user=user).delete()
                StaffProfile.objects.filter(user=user).delete()


# Optional: Inline UserRoles in User admin
class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 1


UserAdmin.inlines = [UserRoleInline]
