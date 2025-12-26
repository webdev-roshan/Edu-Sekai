from django.urls import path
from .views import RegisterOrganizationView, LoginView

urlpatterns = [
    path(
        "register-organization/",
        RegisterOrganizationView.as_view(),
        name="register-organization",
    ),
    path("login/", LoginView.as_view(), name="login"),
]
