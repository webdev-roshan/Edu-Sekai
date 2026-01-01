"use client";

import React, { createContext, useContext } from 'react';
import { useMe } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface PermissionContextType {
    can: (permission: string) => boolean;
    isOwner: boolean;
    activeRole: string | null;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useMe();

    const can = (permission: string): boolean => {
        if (!user || !user.permissions) return false;

        // Owner Bypass / Superuser Wildcard
        if (user.permissions.includes('*')) return true;

        return user.permissions.includes(permission);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
            </div>
        );
    }

    return (
        <PermissionContext.Provider value={{
            can,
            isOwner: user?.active_role === 'owner',
            activeRole: user?.active_role || null
        }}>
            {children}
        </PermissionContext.Provider>
    );
}

export function usePermissions() {
    const context = useContext(PermissionContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionProvider');
    }
    return context;
}

export function Can({ I, children, fallback = null }: { I: string, children: React.ReactNode, fallback?: React.ReactNode }) {
    const { can } = usePermissions();

    if (can(I)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
