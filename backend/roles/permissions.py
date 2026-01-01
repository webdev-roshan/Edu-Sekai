from rest_framework import permissions


class HasPermission(permissions.BasePermission):
    """
    Checks if the user has the required permission 'codename'.
    Usage: permission_classes = [HasPermission('edit_grade')]
    """

    def __init__(self, required_permission):
        self.required_permission = required_permission

    def __call__(self):
        return self

    def has_permission(self, request, view):
        # 1. Allow owners to bypass everything
        # Note: 'is_superuser' is Django's admin flag.
        # Here we check the "organization owner" or a superuser.
        if request.user.is_superuser:
            return True

        # 2. Identify the Active Role
        # Check active_role from query params (if passed to view logic) or fallback logic
        # Ideally, middleware should set request.active_role.
        # But for now, let's fetch it similar to our MeView logic.

        user = request.user
        tenant = getattr(request, "tenant", None)

        if not tenant or tenant.schema_name == "public":
            return False

        # Get Active Role Slug
        # In a real request flow, 'request.GET' may not be the robust place if used in mutations
        # We really need a consistent way. For now, let's check query_params or header.
        # But wait! Permission checks happen BEFORE the view.
        # Let's rely on the user's role in the DB.

        requested_active_role = request.query_params.get("active_role")

        from roles.models import UserRole

        # Get all roles for this user in this tenant
        user_roles = UserRole.objects.filter(
            user=user, organization=tenant
        ).select_related("role")

        if not user_roles.exists():
            return False

        # Determine which role is "Active"
        active_role_obj = None

        # 1. If explicit request
        if requested_active_role:
            active_role_obj = next(
                (ur.role for ur in user_roles if ur.role.slug == requested_active_role),
                None,
            )

        # 2. If no explicit request, we default to the "Highest Privilege" role
        # that actually HAS the permission we are looking for.
        # This is a user-friendly "Auto-Switch" for permission checks.
        if not active_role_obj:
            # Check if ANY of their roles has the permission
            for ur in user_roles:
                if ur.role.slug == "owner":
                    return True  # Owner bypass
                if ur.role.permissions.filter(
                    codename=self.required_permission
                ).exists():
                    return True

            return False  # None of their roles have it

        # If we found a specific active role object
        if active_role_obj.slug == "owner":
            return True

        return active_role_obj.permissions.filter(
            codename=self.required_permission
        ).exists()
