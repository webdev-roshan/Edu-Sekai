"use client";

import { usePermissions } from "@/providers/PermissionProvider";
import Unauthorized from "@/components/Unauthorized";
import PortalActivationManager from "@/components/dashboard/students/PortalActivationManager";

export default function PortalActivationPage() {
    const { can, isOwner } = usePermissions();
    const canManage = isOwner || can("activate_student_portal");

    if (!canManage) {
        return <Unauthorized />;
    }

    return <PortalActivationManager />;
}
