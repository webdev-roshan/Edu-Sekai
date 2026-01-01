import {
    LayoutDashboard,
    UserCircle,
    School,
    Settings,
    GraduationCap,
    Users,
    BookOpen,
    FileText,
    Shield
} from "lucide-react";
import { SidebarItemType } from "@/components/dashboard/Sidebar/SidebarItem";

export const getMenuItems = (user: any): SidebarItemType[] => {
    const menuItems: SidebarItemType[] = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard"
        },
        {
            label: "Academic Management",
            icon: GraduationCap,
            children: [
                {
                    label: "Students",
                    icon: Users,
                    href: "/dashboard/students",
                    children: [
                        { label: "Active Students", href: "/dashboard/students/active" },
                        { label: "Admissions", href: "/dashboard/students/admissions" },
                    ]
                },
                {
                    label: "Courses",
                    icon: BookOpen,
                    href: "/dashboard/courses"
                },
                {
                    label: "Examinations",
                    icon: FileText,
                    href: "/dashboard/exams"
                }
            ]
        },
        {
            label: "User Profile",
            icon: UserCircle,
            href: "/dashboard/profile"
        },
    ];

    const isManagement = user?.active_role === "owner" || user?.active_role === "staff";

    if (isManagement) {
        menuItems.push({
            label: "Institution",
            icon: School,
            children: [
                { label: "Settings", icon: Settings, href: "/dashboard/institution/settings" },
                { label: "Staff Directory", icon: Users, href: "/dashboard/institution/staff" },
                { label: "Security", icon: Shield, href: "/dashboard/institution/security" },
            ]
        });
    }

    return menuItems;
};
