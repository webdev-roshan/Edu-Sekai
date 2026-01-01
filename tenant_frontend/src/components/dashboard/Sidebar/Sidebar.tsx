"use client";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { SidebarItem } from "@/components/dashboard/Sidebar/SidebarItem";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { getMenuItems } from "@/components/dashboard/Sidebar/MenuItems";
import { usePermissions } from "@/providers/PermissionProvider";

interface SidebarProps {
    user: any;
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export function Sidebar({ user, isCollapsed, setIsCollapsed }: SidebarProps) {
    const { can } = usePermissions();
    const menuItems = getMenuItems(user, can);


    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-30 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out lg:relative h-full",
            isCollapsed ? "w-20" : "w-72"
        )}>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className={cn(
                    "h-20 flex items-center border-b border-slate-100 dark:border-slate-800 transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : "px-6"
                )}>
                    <Logo width={isCollapsed ? 50 : 150} height={isCollapsed ? 50 : 150} />
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 bottom-24 h-6 w-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-sky-600 shadow-sm z-40 transition-colors cursor-pointer"
                >
                    {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                </button>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {menuItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            item={item}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </nav>
            </div>
        </aside>
    );
}
