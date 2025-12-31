from django.urls import path
from .views import RegisterOrganizationView, LoginView, LogoutView, MeView

urlpatterns = [
    path(
        "register-organization/",
        RegisterOrganizationView.as_view(),
        name="register-organization",
    ),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
]
