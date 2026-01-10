from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseContentViewSet,
    SubjectEnrollmentViewSet,
    AssignmentViewSet,
    AssignmentSubmissionViewSet,
)

router = DefaultRouter()
router.register(r"content", CourseContentViewSet, basename="content")
router.register(
    r"subject-enrollments", SubjectEnrollmentViewSet, basename="subject-enrollment"
)
router.register(r"assignments", AssignmentViewSet, basename="assignment")
router.register(r"submissions", AssignmentSubmissionViewSet, basename="submission")

urlpatterns = [
    path("", include(router.urls)),
]
