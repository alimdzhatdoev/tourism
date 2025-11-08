from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from authentication.models import User


# Define a new User admin
class UserAdmin(BaseUserAdmin):
    ordering = ("email",)
    list_display = (
        "id",
        "email",
        "first_name",
        "middle_name",
        "last_name",
        "is_staff",
        "is_active",
        "last_location",
    )
    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
        "groups",
    )

    fieldsets = (
        (
            "Personal",
            {
                "fields": (
                    "password",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "birth_date",
                    "gender",
                    "email",
                    "phone",
                    "last_location",
                    "file",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_admin",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
    readonly_fields = ("last_login", "date_joined")

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for obj in formset.deleted_objects:
            obj.delete()
        for instance in instances:
            if not hasattr(instance, "created_by"):
                instance.created_by = request.user
            instance.save()
        formset.save_m2m()

    def get_form(self, request, obj=None, **kwargs):
        # Disabled the ability for non-superusers to edit their own permissions
        # source: https://webdevblog.ru/chto-nuzhno-znat-chtoby-upravlyat-polzovatelyami-v-django-admin/
        form = super().get_form(request, obj, **kwargs)

        if not request.user.is_superuser:
            form.base_fields["is_staff"].disabled = True
            form.base_fields["is_superuser"].disabled = True
            form.base_fields["groups"].disabled = True
            form.base_fields["user_permissions"].disabled = True

        return form


admin.site.register(User, UserAdmin)
