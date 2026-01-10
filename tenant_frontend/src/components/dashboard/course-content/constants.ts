import { Clock, CheckCircle2, Trophy, FileText, Video, Link as LinkIcon } from "lucide-react";

export const statusConfig = {
    pending: {
        icon: Clock,
        color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
        label: "Pending"
    },
    submitted: {
        icon: CheckCircle2,
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
        label: "Submitted"
    },
    graded: {
        icon: Trophy,
        color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
        label: "Graded"
    }
};

export const contentTypeIcons = {
    note: FileText,
    document: FileText,
    video: Video,
    link: LinkIcon,
    assignment: FileText
};

export const contentTypeColors = {
    note: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    document: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    video: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
    link: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    assignment: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
};
