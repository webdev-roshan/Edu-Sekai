from django.contrib import admin
from .models import CourseContent, SubjectEnrollment, Assignment, AssignmentSubmission


@admin.register(CourseContent)
class CourseContentAdmin(admin.ModelAdmin):
    list_display = ["title", "content_type", "created_by", "is_published", "created_at"]
    list_filter = ["content_type", "is_published", "is_pinned", "created_at"]
    search_fields = ["title", "description"]
    filter_horizontal = [
        "target_programs",
        "target_levels",
        "target_sections",
        "target_subjects",
        "specific_students",
    ]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(SubjectEnrollment)
class SubjectEnrollmentAdmin(admin.ModelAdmin):
    list_display = ["student", "subject", "academic_year", "enrolled_at"]
    list_filter = ["academic_year", "enrolled_at"]
    search_fields = [
        "student__profile__first_name",
        "student__profile__last_name",
        "subject__name",
    ]
    readonly_fields = ["enrolled_at"]


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ["content", "due_date", "total_points", "submission_type"]
    list_filter = ["submission_type", "allow_late_submission", "due_date"]
    readonly_fields = ["content"]


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ["assignment", "student", "status", "score", "submitted_at"]
    list_filter = ["status", "submitted_at", "graded_at"]
    search_fields = ["student__profile__first_name", "student__profile__last_name"]
    readonly_fields = ["created_at", "updated_at", "is_late"]
