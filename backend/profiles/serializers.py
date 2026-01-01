from rest_framework import serializers
from .models import StudentProfile, InstructorProfile, StaffProfile, InstitutionProfile


class StudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", required=False)

    class Meta:
        model = StudentProfile
        fields = (
            "id",
            "user",
            "organization",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "phone",
            "date_of_birth",
            "gender",
            "address",
            "profile_image",
            "enrollment_id",
            "current_level",
            "section",
            "admission_date",
            "guardian_name",
            "guardian_phone",
            "guardian_email",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("user", "organization")

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data and "email" in user_data:
            new_email = user_data["email"]
            if instance.user.email != new_email:
                from accounts.models import User

                if User.objects.filter(email=new_email).exists():
                    raise serializers.ValidationError(
                        {"email": "This email is already in use."}
                    )
                instance.user.email = new_email
                instance.user.save()
        return super().update(instance, validated_data)


class InstructorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", required=False)

    class Meta:
        model = InstructorProfile
        fields = (
            "id",
            "user",
            "organization",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "phone",
            "date_of_birth",
            "gender",
            "address",
            "profile_image",
            "employee_id",
            "specialization",
            "qualification",
            "years_of_experience",
            "joining_date",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("user", "organization")

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data and "email" in user_data:
            new_email = user_data["email"]
            if instance.user.email != new_email:
                from accounts.models import User

                if User.objects.filter(email=new_email).exists():
                    raise serializers.ValidationError(
                        {"email": "This email is already in use."}
                    )
                instance.user.email = new_email
                instance.user.save()
        return super().update(instance, validated_data)


class StaffProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", required=False)

    class Meta:
        model = StaffProfile
        fields = (
            "id",
            "user",
            "organization",
            "email",
            "first_name",
            "middle_name",
            "last_name",
            "phone",
            "date_of_birth",
            "gender",
            "address",
            "profile_image",
            "employee_id",
            "designation",
            "department",
            "joining_date",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("user", "organization")

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)
        if user_data and "email" in user_data:
            new_email = user_data["email"]
            if instance.user.email != new_email:
                from accounts.models import User

                if User.objects.filter(email=new_email).exists():
                    raise serializers.ValidationError(
                        {"email": "This email is already in use."}
                    )
                instance.user.email = new_email
                instance.user.save()
        return super().update(instance, validated_data)


class InstitutionProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="organization.name")
    phone = serializers.CharField(
        source="organization.phone", required=False, allow_blank=True
    )
    email = serializers.EmailField(
        source="organization.email", required=False, allow_blank=True
    )

    class Meta:
        model = InstitutionProfile
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "logo",
            "banner",
            "tagline",
            "mission",
            "vision",
            "about",
            "established_date",
            "website",
            "facebook_url",
            "instagram_url",
            "twitter_url",
            "linkedin_url",
        )
        read_only_fields = ("id",)

    def update(self, instance, validated_data):
        # Handle organization field updates
        org_data = validated_data.pop("organization", None)
        if org_data:
            updated_org = False
            for field in ["name", "phone", "email"]:
                if field in org_data:
                    setattr(instance.organization, field, org_data[field])
                    updated_org = True
            if updated_org:
                instance.organization.save()

        return super().update(instance, validated_data)
