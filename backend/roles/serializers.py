from rest_framework import serializers
from .models import Role, Permission, UserRole


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "name", "codename", "module", "description"]


class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Permission.objects.all(),
        source="permissions",
    )
    user_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Role
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_system_role",
            "permissions",
            "permission_ids",
            "user_count",
            "created_at",
        ]
        read_only_fields = ["slug", "is_system_role", "created_at"]


class UserRoleSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = UserRole
        fields = ["id", "role", "is_active", "created_at"]
