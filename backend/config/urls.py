from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/organizations/", include("organizations.urls")),
    path("api/profiles/", include("profiles.urls")),
    path("api/roles/", include("roles.urls")),
]
