import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Role, Permission } from "@/types/auth";
import { RoleFormData, PermissionGroup } from "@/types/roles";
import { toast } from "sonner";

// --- API Functions ---

async function getRoles(): Promise<Role[]> {
    const { data } = await axiosInstance.get<Role[]>("/roles/");
    return data;
}

async function getPermissions(): Promise<Permission[]> {
    const { data } = await axiosInstance.get<Permission[]>("/roles/permissions/");
    return data;
}

async function createRole(payload: RoleFormData): Promise<Role> {
    const { data } = await axiosInstance.post<Role>("/roles/", payload);
    return data;
}

async function updateRole({ id, payload }: { id: string; payload: RoleFormData }): Promise<Role> {
    const { data } = await axiosInstance.patch<Role>(`/roles/${id}/`, payload);
    return data;
}

async function deleteRole(id: string): Promise<void> {
    await axiosInstance.delete(`/roles/${id}/`);
}

// --- Hooks ---

export function useRoles() {
    return useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    });
}

export function usePermissionsList() {
    return useQuery({
        queryKey: ["permissions-list"],
        queryFn: getPermissions,
        select: (data) => {
            // Group permissions by module
            const grouped = data.reduce<Record<string, Permission[]>>((acc, perm) => {
                if (!acc[perm.module]) {
                    acc[perm.module] = [];
                }
                acc[perm.module].push(perm);
                return acc;
            }, {});

            return Object.entries(grouped).map(([module, permissions]) => ({
                module,
                permissions,
            })) as PermissionGroup[];
        }
    });
}

export function useCreateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success("Role created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to create role");
        }
    });
}

export function useUpdateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success("Role updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to update role");
        }
    });
}

export function useDeleteRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success("Role deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Failed to delete role");
        }
    });
}
