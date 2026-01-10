import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Assignment {
    id: string;
    content_details: {
        title: string;
    };
}

interface AssignmentFilterProps {
    assignments: Assignment[];
    selectedAssignment: string;
    onAssignmentChange: (assignmentId: string) => void;
}

export function AssignmentFilter({
    assignments,
    selectedAssignment,
    onAssignmentChange
}: AssignmentFilterProps) {
    return (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <Label htmlFor="assignment-filter" className="mb-2 block">Filter by Assignment</Label>
            <Select value={selectedAssignment} onValueChange={onAssignmentChange}>
                <SelectTrigger id="assignment-filter" className="w-full md:w-[400px]">
                    <SelectValue placeholder="All Assignments" />
                </SelectTrigger>
                <SelectContent>
                    {assignments?.map((assignment) => (
                        <SelectItem key={assignment.id} value={assignment.id}>
                            {assignment.content_details.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
