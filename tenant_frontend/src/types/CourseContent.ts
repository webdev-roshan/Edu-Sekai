export interface CourseContent {
    id: string;
    title: string;
    description: string;
    content_type: 'note' | 'document' | 'video' | 'link' | 'assignment';
    content_type_display: string;
    file: string | null;
    file_size: number | null;
    external_url: string;
    created_by: string;
    created_by_name: string;
    target_programs: string[];
    target_programs_details: Array<{ id: string; name: string }>;
    target_levels: string[];
    target_levels_details: Array<{ id: string; name: string; program: string }>;
    target_sections: string[];
    target_sections_details: Array<{ id: string; name: string; level: string }>;
    target_subjects: string[];
    target_subjects_details: Array<{ id: string; name: string; code: string }>;
    specific_students: string[];
    is_published: boolean;
    publish_date: string | null;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
}

export interface SubjectEnrollment {
    id: string;
    student: string;
    student_name: string;
    student_enrollment_id: string;
    subject: string;
    subject_name: string;
    subject_code: string;
    academic_year: string;
    enrolled_at: string;
}

export interface Assignment {
    id: string;
    content: string;
    content_details: CourseContent;
    due_date: string;
    total_points: number;
    submission_type: 'file' | 'text' | 'link' | 'none';
    submission_type_display: string;
    allow_late_submission: boolean;
    late_penalty_percent: number;
    instructions: string;
    is_overdue: boolean;
    total_submissions: number;
    graded_submissions: number;
}

export interface AssignmentSubmission {
    id: string;
    assignment: string;
    assignment_title: string;
    student: string;
    student_name: string;
    student_enrollment_id: string;
    submitted_at: string | null;
    submission_file: string | null;
    submission_text: string;
    submission_url: string;
    status: 'pending' | 'submitted' | 'graded';
    status_display: string;
    score: number | null;
    feedback: string;
    graded_by: string | null;
    graded_by_name: string | null;
    graded_at: string | null;
    is_late: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateAssignmentData {
    title: string;
    description: string;
    file?: File;
    external_url?: string;
    target_programs?: string[];
    target_levels?: string[];
    target_sections?: string[];
    target_subjects?: string[];
    specific_students?: string[];
    is_published?: boolean;
    is_pinned?: boolean;
    due_date: string;
    total_points?: number;
    submission_type?: 'file' | 'text' | 'link' | 'none';
    allow_late_submission?: boolean;
    late_penalty_percent?: number;
    instructions: string;
}

export interface CreateContentData {
    title: string;
    description: string;
    content_type: 'note' | 'document' | 'video' | 'link';
    file?: File;
    external_url?: string;
    target_programs?: string[];
    target_levels?: string[];
    target_sections?: string[];
    target_subjects?: string[];
    specific_students?: string[];
    is_published?: boolean;
    is_pinned?: boolean;
}

export interface BulkEnrollData {
    subject_id: string;
    student_ids: string[];
    academic_year: string;
}

export interface SubmitAssignmentData {
    submission_file?: File;
    submission_text?: string;
    submission_url?: string;
}

export interface GradeSubmissionData {
    score: number;
    feedback?: string;
}
