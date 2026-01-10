import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface SubmitAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (file: File) => void;
    isSubmitting?: boolean;
}

export function SubmitAssignmentDialog({
    open,
    onOpenChange,
    onSubmit,
    isSubmitting = false
}: SubmitAssignmentDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = () => {
        if (!selectedFile) {
            alert("Please select a file to submit");
            return;
        }
        onSubmit(selectedFile);
        setSelectedFile(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit Assignment</DialogTitle>
                    <DialogDescription>
                        Upload your completed work
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="submission_file">Select File</Label>
                        <Input
                            id="submission_file"
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="cursor-pointer"
                        />
                        {selectedFile && (
                            <p className="text-xs text-slate-500">
                                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedFile}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
