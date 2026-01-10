from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/organizations/", include("organizations.urls")),
    path("api/profiles/", include("profiles.urls")),
    path("api/roles/", include("roles.urls")),
    path("api/students/", include("students.urls")),
    path("api/staff/", include("staff.urls")),
    path("api/families/", include("families.urls")),
    path("api/academics/", include("academics.urls")),
    path("api/course-content/", include("course_content.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
