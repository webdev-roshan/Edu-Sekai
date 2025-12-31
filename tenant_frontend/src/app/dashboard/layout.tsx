"use client";

import { useLogout, useMe } from "@/hooks/useAuth";
import {
    LayoutDashboard,
    UserCircle,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    ChevronRight,
    GraduationCap,
    School
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useMe();
    const { mutate: logout } = useLogout();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: UserCircle, label: "My Profile", href: "/dashboard/profile" },
    ];

    // Only owners get the Institution Settings
    if (user?.roles?.includes("owner") || user?.roles?.includes("staff")) {
        menuItems.push({ icon: School, label: "Institution Settings", href: "/dashboard/settings" });
    }

    if (isLoading) return null;

    if (!user) {
        router.push("/login");
        return null;
    }

    const initials = `${user.profile?.first_name?.[0] || ""}${user.profile?.last_name?.[0] || ""}`.toUpperCase();

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
                transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-600 rounded-lg shadow-lg shadow-sky-500/20">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">Edu Sekai</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <button
                                    key={item.href}
                                    onClick={() => router.push(item.href)}
                                    className={`
                                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold"
                                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"}
                                    `}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive ? "text-sky-600 dark:text-sky-400" : "group-hover:scale-110 transition-transform"}`} />
                                    <span>{item.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {user.profile?.first_name} {user.profile?.last_name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate uppercase tracking-wider font-semibold">
                                    {user.roles?.[0] || 'Member'}
                                </p>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            <Menu className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </button>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <span className="hidden sm:inline">Dashboard</span>
                            <ChevronRight className="h-4 w-4 hidden sm:inline" />
                            <span className="text-slate-900 dark:text-white capitalize">{pathname.split('/').pop()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-transparent focus-within:border-sky-500 transition-all">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none focus:ring-0 text-sm w-48 ml-2"
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-0 hover:bg-transparent">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                        {initials}
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2">
                                <DropdownMenuLabel className="font-normal p-3">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none">{user.profile?.first_name} {user.profile?.last_name}</p>
                                        <p className="text-xs leading-none text-slate-500">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="-mx-2 bg-slate-100" />
                                <DropdownMenuItem
                                    onClick={() => router.push("/dashboard/profile")}
                                    className="rounded-xl mt-1 focus:bg-sky-50 focus:text-sky-600 cursor-pointer p-3"
                                >
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer p-3">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Account Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="-mx-2 bg-slate-100" />
                                <DropdownMenuItem
                                    onClick={() => logout()}
                                    className="rounded-xl focus:bg-red-50 focus:text-red-600 cursor-pointer p-3 text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950 p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
