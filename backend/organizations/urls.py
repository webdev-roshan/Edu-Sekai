from django.urls import path
from .views import CheckDomainView

urlpatterns = [
    path("check-domain/", CheckDomainView.as_view(), name="check-domain"),
]
