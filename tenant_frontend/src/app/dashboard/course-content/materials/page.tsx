"use client";

import { useCourseContent } from "@/hooks/useCourseContent";
import { LoaderCircle, FileText } from "lucide-react";
import { useState } from "react";
import { MaterialsFilters } from "@/components/dashboard/course-content/MaterialsFilters";
import { MaterialCard } from "@/components/dashboard/course-content/MaterialCard";

export default function StudyMaterialsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");

    const { data: content, isLoading } = useCourseContent(
        contentTypeFilter !== "all" ? contentTypeFilter : undefined,
        true // Exclude assignments - this is a study materials page
    );

    const filteredContent = content?.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Study Materials</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Access notes, documents, and resources from your instructors
                </p>
            </div>

            {/* Filters */}
            <MaterialsFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                contentTypeFilter={contentTypeFilter}
                onContentTypeChange={setContentTypeFilter}
            />

            {/* Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredContent && filteredContent.length > 0 ? (
                    filteredContent.map((item) => (
                        <MaterialCard key={item.id} material={item} />
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                        <FileText className="h-16 w-16 text-slate-200 dark:text-slate-700 mb-4" />
                        <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500">No materials found</h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                            Check back later for new content from your instructors
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
