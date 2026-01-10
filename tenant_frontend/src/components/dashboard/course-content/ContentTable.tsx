import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pin, MoreHorizontal, Trash2, FileText } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentItem {
    id: string;
    title: string;
    content_type_display: string;
    target_sections_details: any[];
    is_published: boolean;
    is_pinned: boolean;
    created_at: string;
}

interface ContentTableProps {
    content: ContentItem[];
    onDeleteClick: (contentId: string) => void;
}

export function ContentTable({ content, onDeleteClick }: ContentTableProps) {
    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Targets</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {content && content.length > 0 ? (
                        content.map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        {item.is_pinned && <Pin className="h-3 w-3 text-amber-500 fill-amber-500" />}
                                        {item.title}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-xs">
                                        {item.content_type_display}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {item.target_sections_details.length} section{item.target_sections_details.length !== 1 ? 's' : ''}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={item.is_published ? "default" : "secondary"} className="text-xs">
                                        {item.is_published ? "Published" : "Draft"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-slate-500">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => onDeleteClick(item.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <FileText className="h-12 w-12 mb-2 opacity-20" />
                                    <p>No content uploaded yet. Create your first material.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
