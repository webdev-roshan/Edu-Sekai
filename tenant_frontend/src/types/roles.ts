import { Permission, Role } from "@/types/auth"; // We need to update auth types first

export interface PermissionGroup {
    module: string;
    permissions: Permission[];
}

export interface RoleFormData {
    name: string;
    description: string;
    permission_ids: string[];
}
