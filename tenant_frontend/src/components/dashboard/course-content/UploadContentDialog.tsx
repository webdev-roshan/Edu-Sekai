import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Section {
    id: string;
    name: string;
    program_name: string;
    level_name: string;
}

interface UploadContentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
    sections?: Section[];
    isCreating?: boolean;
}

export function UploadContentDialog({
    open,
    onOpenChange,
    onSubmit,
    sections,
    isCreating = false
}: UploadContentDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [contentType, setContentType] = useState<string>("note");
    const [isPublished, setIsPublished] = useState(true);
    const [isPinned, setIsPinned] = useState(false);
    const [selectedSections, setSelectedSections] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: any = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            content_type: contentType as any,
            is_published: isPublished,
            is_pinned: isPinned,
            target_sections: selectedSections
        };

        if (selectedFile) {
            data.file = selectedFile;
        }

        const externalUrl = formData.get("external_url") as string;
        if (externalUrl) {
            data.external_url = externalUrl;
        }

        onSubmit(data);

        // Reset form
        setSelectedFile(null);
        setSelectedSections([]);
        setContentType("note");
        setIsPublished(true);
        setIsPinned(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upload Study Material</DialogTitle>
                    <DialogDescription>
                        Share notes, documents, or videos with your students
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g., Chapter 1 Notes"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content_type">Content Type</Label>
                        <Select value={contentType} onValueChange={setContentType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="note">Note</SelectItem>
                                <SelectItem value="document">Document/PDF</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="link">External Link</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Brief description of the content..."
                            rows={3}
                            required
                        />
                    </div>

                    {contentType !== 'link' && (
                        <div className="space-y-2">
                            <Label htmlFor="file">Upload File</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="file"
                                    type="file"
                                    accept={contentType === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt'}
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="cursor-pointer"
                                />
                                {selectedFile && (
                                    <Badge variant="secondary" className="text-xs">
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">Max file size: 10MB</p>
                        </div>
                    )}

                    {contentType === 'link' && (
                        <div className="space-y-2">
                            <Label htmlFor="external_url">External URL</Label>
                            <Input
                                id="external_url"
                                name="external_url"
                                type="url"
                                placeholder="https://example.com"
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Target Sections</Label>
                        <Select
                            value={selectedSections.length > 0 ? selectedSections[0] : ""}
                            onValueChange={(value) => {
                                if (value && !selectedSections.includes(value)) {
                                    setSelectedSections([...selectedSections, value]);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select sections..." />
                            </SelectTrigger>
                            <SelectContent>
                                {sections?.map((section) => (
                                    <SelectItem key={section.id} value={section.id}>
                                        {section.program_name} - {section.level_name} - Section {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedSections.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedSections.map(sectionId => {
                                    const section = sections?.find(s => s.id === sectionId);
                                    return (
                                        <Badge
                                            key={sectionId}
                                            variant="secondary"
                                            className="cursor-pointer"
                                            onClick={() => setSelectedSections(selectedSections.filter(id => id !== sectionId))}
                                        >
                                            {section?.name} ×
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_published"
                                checked={isPublished}
                                onCheckedChange={(checked) => setIsPublished(checked as boolean)}
                            />
                            <Label htmlFor="is_published" className="text-sm font-normal cursor-pointer">
                                Publish immediately
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_pinned"
                                checked={isPinned}
                                onCheckedChange={(checked) => setIsPinned(checked as boolean)}
                            />
                            <Label htmlFor="is_pinned" className="text-sm font-normal cursor-pointer">
                                Pin to top
                            </Label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Uploading..." : "Upload Content"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
