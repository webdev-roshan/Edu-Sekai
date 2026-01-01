from django.urls import path
from .views import (
    RegisterOrganizationView,
    LoginView,
    LogoutView,
    MeView,
    TokenRefreshView,
    VerifyEmailView,
)

urlpatterns = [
    path(
        "register-organization/",
        RegisterOrganizationView.as_view(),
        name="register-organization",
    ),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
]
