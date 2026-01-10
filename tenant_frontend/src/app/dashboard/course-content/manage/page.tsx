"use client";

import { useState } from "react";
import {
    useMyCourseContent,
    useCreateContent,
    useDeleteContent
} from "@/hooks/useCourseContent";
import { useSections } from "@/hooks/useAcademics";
import { Button } from "@/components/ui/button";
import { Plus, LoaderCircle } from "lucide-react";
import { UploadContentDialog } from "@/components/dashboard/course-content/UploadContentDialog";
import { ContentTable } from "@/components/dashboard/course-content/ContentTable";
import { DeleteConfirmDialog } from "@/components/dashboard/course-content/DeleteConfirmDialog";

export default function ManageContentPage() {
    const { data: content, isLoading } = useMyCourseContent();
    const { mutate: createContent, isPending: isCreating } = useCreateContent();
    const { mutate: deleteContent } = useDeleteContent();

    const { data: sections } = useSections();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [contentToDelete, setContentToDelete] = useState<string | null>(null);

    const handleSubmit = (data: any) => {
        createContent(data, {
            onSuccess: () => {
                setIsDialogOpen(false);
            }
        });
    };

    const handleDelete = () => {
        if (contentToDelete) {
            deleteContent(contentToDelete);
            setContentToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Content</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Upload and manage study materials for your students
                    </p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Upload Content
                </Button>
            </div>

            <UploadContentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleSubmit}
                sections={sections}
                isCreating={isCreating}
            />

            <ContentTable
                content={content || []}
                onDeleteClick={setContentToDelete}
            />

            <DeleteConfirmDialog
                open={!!contentToDelete}
                onOpenChange={() => setContentToDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
