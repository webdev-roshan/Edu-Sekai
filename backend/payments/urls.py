from django.urls import path
from .views import InitPaymentView, VerifyPaymentView

urlpatterns = [
    path("init/", InitPaymentView.as_view(), name="init_payment"),
    path("verify/", VerifyPaymentView.as_view(), name="verify_payment"),
]
