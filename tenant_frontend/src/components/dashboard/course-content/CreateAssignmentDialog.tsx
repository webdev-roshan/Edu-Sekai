import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface CreateAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => void;
    sections?: Section[];
    isCreating?: boolean;
}

export function CreateAssignmentDialog({
    open,
    onOpenChange,
    onSubmit,
    sections,
    isCreating = false
}: CreateAssignmentDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedSections, setSelectedSections] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: any = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            instructions: formData.get("instructions") as string,
            due_date: new Date(formData.get("due_date") as string).toISOString(),
            total_points: parseFloat(formData.get("total_points") as string),
            submission_type: formData.get("submission_type") as string,
            target_sections: selectedSections,
            is_published: true
        };

        if (selectedFile) {
            data.file = selectedFile;
        }

        onSubmit(data);
        setSelectedFile(null);
        setSelectedSections([]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                    <DialogDescription>
                        Create an assignment for your students
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="title">Assignment Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g., Chapter 1 Quiz"
                                required
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Brief description..."
                                rows={2}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="due_date">Due Date</Label>
                            <Input
                                id="due_date"
                                name="due_date"
                                type="datetime-local"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="total_points">Total Points</Label>
                            <Input
                                id="total_points"
                                name="total_points"
                                type="number"
                                defaultValue="100"
                                required
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="submission_type">Submission Type</Label>
                            <Select name="submission_type" defaultValue="file">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="file">File Upload</SelectItem>
                                    <SelectItem value="text">Text Entry</SelectItem>
                                    <SelectItem value="link">URL Link</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="instructions">Instructions</Label>
                            <Textarea
                                id="instructions"
                                name="instructions"
                                placeholder="Detailed instructions for students..."
                                rows={4}
                                required
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
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

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="file">Attachment (Optional)</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Creating..." : "Create Assignment"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
