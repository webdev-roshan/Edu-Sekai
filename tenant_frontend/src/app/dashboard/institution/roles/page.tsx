"use client";

import { useRoles, usePermissionsList, useCreateRole, useUpdateRole, useDeleteRole } from "@/hooks/useRoles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useState } from "react";
import { Loader2, ShieldCheck, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Role } from "@/types/auth";
import { RoleFormData } from "@/types/roles";
import { Badge } from "@/components/ui/badge";
import { Can } from "@/providers/PermissionProvider";
import { format } from "date-fns";

export default function RolesPage() {
    const { data: roles, isLoading: isRolesLoading } = useRoles();
    const { data: permissionGroups, isLoading: isPermissionsLoading } = usePermissionsList();

    // Create & Update Mutations
    const { mutate: createRole, isPending: isCreating } = useCreateRole();
    const { mutate: updateRole, isPending: isUpdating } = useUpdateRole();
    const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState<RoleFormData>({
        name: "",
        description: "",
        permission_ids: [],
    });

    const handleOpenDialog = (role?: Role) => {
        if (role) {
            setEditingRole(role);
            setFormData({
                name: role.name,
                description: role.description,
                permission_ids: role.permissions.map(p => p.id),
            });
        } else {
            setEditingRole(null);
            setFormData({
                name: "",
                description: "",
                permission_ids: [],
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingRole(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingRole) {
            updateRole({ id: editingRole.id, payload: formData }, {
                onSuccess: handleCloseDialog
            });
        } else {
            createRole(formData, {
                onSuccess: handleCloseDialog
            });
        }
    };

    const togglePermission = (permissionId: string) => {
        setFormData(prev => {
            const exists = prev.permission_ids.includes(permissionId);
            return {
                ...prev,
                permission_ids: exists
                    ? prev.permission_ids.filter(id => id !== permissionId)
                    : [...prev.permission_ids, permissionId]
            };
        });
    };

    if (isRolesLoading || isPermissionsLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="relative h-24 bg-sky-600 rounded-xl overflow-hidden shadow-xl shadow-sky-500/10 animate-in fade-in slide-in-from-top-4 duration-700 mb-5 flex items-center justify-between px-8">
                <div className="text-white z-10">
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-sky-200" />
                        Roles & Permissions
                    </h1>
                    <p className="text-sky-100/80 text-sm mt-1">Manage access control and user roles for your institution</p>
                </div>

                <Can I="create_role">
                    <div className="z-10">
                        <Button
                            onClick={() => handleOpenDialog()}
                            size="lg"
                            className="bg-white text-sky-600 hover:bg-sky-50 font-bold border-0"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create New Role
                        </Button>
                    </div>
                </Can>

                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white blur-3xl" />
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {roles?.map((role) => (
                    <Card key={role.id} className="border-none shadow-lg hover:shadow-xl transition-shadow dark:bg-slate-900 group">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    {role.name}
                                    {role.is_system_role && (
                                        <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 ml-2">
                                            System Default
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="mt-1.5">{role.description}</CardDescription>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Can I="edit_role">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-sky-50 text-sky-600"
                                        onClick={() => handleOpenDialog(role)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </Can>
                                <Can I="delete_role">
                                    {!role.is_system_role && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-red-50 text-red-600"
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this role?")) {
                                                    deleteRole(role.id);
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </Can>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
                                    <span>Active Users</span>
                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                                        {role.user_count} members
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Permissions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {role.slug === "owner" ? (
                                            <Badge variant="outline" className="border-sky-200 bg-sky-50 text-sky-700">
                                                Superuser Access
                                            </Badge>
                                        ) : role.permissions.length > 0 ? (
                                            role.permissions.slice(0, 5).map(perm => (
                                                <Badge key={perm.id} variant="outline" className="border-slate-200 dark:border-slate-700">
                                                    {perm.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-400 italic">No specific permissions assigned</span>
                                        )}
                                        {role.permissions.length > 5 && (
                                            <Badge variant="outline" className="border-dashed">
                                                +{role.permissions.length - 5} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                                    <span className="text-xs text-slate-400">Created {format(new Date(role.created_at), 'MMM dd, yyyy')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Role Editor Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                        <DialogDescription>
                            Define the role name and assign specific access permissions.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <FloatingLabelInput
                                id="role_name"
                                label="Role Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={editingRole?.is_system_role} // System roles can't change specific fields
                            />
                            {editingRole?.is_system_role && (
                                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3" />
                                    System Role names cannot be changed, but you can modify their permissions.
                                </p>
                            )}

                            <FloatingLabelInput
                                id="role_description"
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                Access Permissions
                                <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {formData.permission_ids.length} selected
                                </span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {permissionGroups?.map((group) => (
                                    <div key={group.module} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3">
                                        <h4 className="font-semibold text-sm text-sky-600 flex items-center gap-2">
                                            {group.module}
                                        </h4>
                                        <div className="space-y-2">
                                            {group.permissions.map((perm) => (
                                                <div key={perm.id} className="flex items-start gap-2">
                                                    <Checkbox
                                                        id={perm.id}
                                                        checked={formData.permission_ids.includes(perm.id)}
                                                        onCheckedChange={() => togglePermission(perm.id)}
                                                    />
                                                    <div className="grid gap-0.5 leading-none">
                                                        <Label
                                                            htmlFor={perm.id}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                        >
                                                            {perm.name}
                                                        </Label>
                                                        <p className="text-xs text-slate-500">
                                                            {perm.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isCreating || isUpdating}>
                                {isCreating || isUpdating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {editingRole ? 'Update Role' : 'Create Role'}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Fix for icon import in Role Editor
import { Save } from "lucide-react";
