from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        "transaction_uuid",
        "organization_name",
        "amount",
        "status",
        "created_at",
    ]
    list_filter = ["status", "created_at"]
    search_fields = ["transaction_uuid", "organization_name", "email", "subdomain"]
    readonly_fields = ["transaction_uuid", "created_at", "updated_at"]
