from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoleViewSet, PermissionListView

router = DefaultRouter()
router.register(r"", RoleViewSet, basename="roles")

urlpatterns = [
    path("permissions/", PermissionListView.as_view(), name="list-permissions"),
    path("", include(router.urls)),
]
