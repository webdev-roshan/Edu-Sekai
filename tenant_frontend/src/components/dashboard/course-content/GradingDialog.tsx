import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AssignmentSubmission } from "@/types/CourseContent";

interface GradingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    submission: AssignmentSubmission | null;
    onSubmit: (data: { score: number; feedback: string }) => void;
    isGrading?: boolean;
}

export function GradingDialog({
    open,
    onOpenChange,
    submission,
    onSubmit,
    isGrading = false
}: GradingDialogProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            score: parseFloat(formData.get("score") as string),
            feedback: formData.get("feedback") as string
        };
        onSubmit(data);
    };

    if (!submission) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Grade Submission</DialogTitle>
                    <DialogDescription>
                        Provide a score and feedback for this student
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {submission.student_name}
                        </p>
                        <p className="text-xs text-slate-500">
                            {submission.assignment_title}
                        </p>
                    </div>

                    {submission.submission_file && (
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <a
                                href={submission.submission_file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Download Submission
                            </a>
                        </div>
                    )}

                    {submission.submission_text && (
                        <div className="space-y-1">
                            <Label>Student's Answer:</Label>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border text-sm">
                                {submission.submission_text}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="score">Score *</Label>
                        <Input
                            id="score"
                            name="score"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 85.5"
                            defaultValue={submission.score || ""}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="feedback">Feedback</Label>
                        <Textarea
                            id="feedback"
                            name="feedback"
                            placeholder="Provide feedback to the student..."
                            rows={4}
                            defaultValue={submission.feedback || ""}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isGrading}>
                            {isGrading ? "Saving..." : "Save Grade"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
