from django.urls import path
from .views import MyProfileView, InstitutionProfileView

urlpatterns = [
    path("me/", MyProfileView.as_view(), name="my-profile"),
    path("institution/", InstitutionProfileView.as_view(), name="institution-profile"),
]
