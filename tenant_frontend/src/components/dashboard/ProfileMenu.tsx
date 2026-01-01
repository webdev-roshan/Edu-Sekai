"use client";

import { useLogout, useMe } from "@/hooks/useAuth";
import {
    UserCircle,
    Settings,
    LogOut,
    RefreshCcw,
    ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const ProfileMenu = () => {
    const { data: user, isLoading } = useMe();
    const router = useRouter();
    const { mutate: logout } = useLogout();

    if (isLoading) return null;

    if (!user) {
        router.push("/login");
        return null;
    }

    const handleRoleSwitch = (role: string) => {
        localStorage.setItem("active_role", role);
        window.location.reload(); // Reload to refresh all data with new context
    };

    const initials = `${user.profile?.first_name?.[0] || ""}${user.profile?.last_name?.[0] || ""}`.toUpperCase();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 hover:bg-transparent">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shadow-sm relative overflow-hidden group">
                        {initials}
                        <div className="absolute inset-0 bg-sky-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 mt-2 rounded-2xl p-2 shadow-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-bold leading-none">{user.profile?.first_name} {user.profile?.last_name}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                                {user.active_role}
                            </span>
                        </div>
                        <p className="text-xs leading-none text-slate-500 mt-1">{user.profile?.email}</p>
                    </div>
                </DropdownMenuLabel>

                {user.roles.length > 1 && (
                    <>
                        <DropdownMenuSeparator className="-mx-2 bg-slate-100 dark:bg-slate-800" />
                        <div className="px-3 py-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Switch Context</p>
                            <div className="space-y-1">
                                {user.roles.filter(r => r !== user.active_role).map(role => (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleSwitch(role)}
                                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors group"
                                    >
                                        <span className="capitalize">{role}</span>
                                        <RefreshCcw className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <DropdownMenuSeparator className="-mx-2 bg-slate-100 dark:bg-slate-800" />
                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                    className="rounded-xl mt-1 focus:bg-sky-50 dark:focus:bg-sky-500/10 focus:text-sky-600 dark:focus:text-sky-400 cursor-pointer p-3 transition-colors"
                >
                    <UserCircle className="mr-3 h-4 w-4" />
                    <span className="font-medium">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl focus:bg-sky-50 dark:focus:bg-sky-500/10 focus:text-sky-600 dark:focus:text-sky-400 cursor-pointer p-3 transition-colors">
                    <Settings className="mr-3 h-4 w-4" />
                    <span className="font-medium">Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="-mx-2 bg-slate-100 dark:bg-slate-800" />
                <DropdownMenuItem
                    onClick={() => logout()}
                    className="rounded-xl focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 dark:focus:text-red-400 cursor-pointer p-3 text-red-600 transition-colors"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}