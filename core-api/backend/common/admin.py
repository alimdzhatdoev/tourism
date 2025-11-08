import csv
from typing import Any, Dict

from django.contrib import admin
from django.contrib.admin.options import InlineModelAdmin
from django.contrib.admin.utils import flatten_fieldsets
from django.db import models
from django.forms import Textarea
from django.http import HttpResponse
from django_better_admin_arrayfield.admin.mixins import DynamicArrayMixin
from simple_history.admin import SimpleHistoryAdmin

from services.http import get_http_refresh_response


class ChangeListSummaryAdminMixin:
    """A mixin adding a summary table at the top of the changelist.
    Useful for showing total counts, avg, etc.
    """

    change_list_template = "admin/change_list_with_summary.html"

    def get_summary(self, request, queryset) -> Dict[str, Any]:
        return None

    def changelist_view(self, request, extra_context=None):
        """Add some summary information in ChangeList view"""
        response = super().changelist_view(request, extra_context)
        try:
            queryset = response.context_data["cl"].queryset
        except (AttributeError, KeyError):
            # When an invalid filter is used django will redirect. In this
            # case the response is an http redirect response and so it has
            # no context_data.
            return response

        response.context_data.update({"summary": self.get_summary(request, queryset)})
        return response


class ExportCsvAdminMixin:
    """Add 'Export as CSV' action in admin change list page"""

    list_csv_fields = []

    def get_actions(self, request):
        def export_as_csv(self, request, queryset):
            """Export as CSV action"""
            meta = self.model._meta
            if len(self.list_csv_fields):
                field_names = self.list_csv_fields
            else:
                field_names = [field.name for field in meta.fields]

            response = HttpResponse(content_type="text/csv")
            response["Content-Disposition"] = "attachment; filename={}.csv".format(meta)
            writer = csv.writer(response)

            writer.writerow(field_names)
            for obj in queryset:
                writer.writerow([getattr(obj, field) for field in field_names])
            return response

        actions = super().get_actions(request)
        # By default, it is expected that any user with 'view' permission
        # is allowed to export as CSV
        if self.has_view_permission(request):
            actions["export_as_csv"] = (export_as_csv, "export_as_csv", "Export as CSV")

        return actions


class BulkStatusUpdateMixin:
    status_field = "status"

    def get_actions(self, request):
        def func_maker(value):
            # this function will be your update function, just mimic the traditional bulk update function
            def update_func(self, request, queryset):
                for obj in queryset:
                    setattr(obj, self.status_field, value)
                    obj.save()
                self.message_user(request, "Done")
                return get_http_refresh_response(request)

            return update_func

        # check out django.contrib.admin.options.ModelAdmin.get_actions for more details - basically it
        # just returns an ordered dict, keyed by your action name, with a tuple of the function, a name,
        # and a description for the dropdown.
        actions = super().get_actions(request)

        if self.has_change_permission(request):
            status_field = [
                field for field in self.opts.fields if field.name == self.status_field
            ]
            status_field = status_field[0]
            for value, label in status_field.choices:
                func = func_maker(value)
                name = f"mark_{label.lower()}"
                actions[name] = (func, name, f"Mark as '{label}'")

        return actions


class BaseModelAdmin(ChangeListSummaryAdminMixin, admin.ModelAdmin, DynamicArrayMixin):
    # Add default search field to not break autocomplete_field work
    search_fields = ("id",)

    def save_model(self, request, obj, form, change):
        if getattr(obj, "created_by", None) is None:
            obj.created_by = request.user
        obj.save()

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for obj in formset.deleted_objects:
            obj.delete()
        for instance in instances:
            if not hasattr(instance, "created_by"):
                instance.created_by = request.user
            instance.save()
        formset.save_m2m()

    def get_readonly_fields(self, request, obj):
        readonly_fields = super().get_readonly_fields(request, obj)
        if "created_by" not in readonly_fields:
            return (*readonly_fields, "created_by", "created_dttm")
        return readonly_fields

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        flat_fieldsets = flatten_fieldsets(fieldsets)
        if "created_by" not in flat_fieldsets:
            return (
                *fieldsets,
                ("Technical Record", {"fields": ("created_by", "created_dttm")}),
            )
        return fieldsets

    def get_queryset(self, request):
        qs = self.model.objects.get_queryset()
        ordering = self.get_ordering(request)
        if ordering:
            qs = qs.order_by(*ordering)
        return qs

    formfield_overrides = {
        models.TextField: {"widget": Textarea(attrs={"rows": 2, "cols": 40})},
    }

    def get_autocomplete_fields(self, request):
        """Try to automatically define autocomplete fields"""
        fields = None
        if self.fieldsets:
            fields = flatten_fieldsets(self.fieldsets)
        elif self.fields:
            fields = self.fields
        else:
            fields = [field.name for field in self.opts.fields]

        autocomplete_fields = super().get_autocomplete_fields(request)
        autocomplete_fields = list(autocomplete_fields)

        for default_autocomplete_field in (
            "load",
            "driver",
            "owner",
            "tractor",
            "trailer",
        ):
            if (default_autocomplete_field in fields) and (
                default_autocomplete_field not in autocomplete_fields
            ):
                autocomplete_fields.append(default_autocomplete_field)

        return autocomplete_fields

    class Media:
        js = ("js/admin/scrollbooster.min.js",)


class BaseHistoricalModelAdmin(SimpleHistoryAdmin, BaseModelAdmin, DynamicArrayMixin):
    pass


class DefaultModelAdmin(BaseModelAdmin):
    """This is fallback ModelAdmin for models without ModelAdmin configuration"""

    def __init__(self, model, admin_site):
        self.list_display = [field.name for field in model._meta.fields]
        super().__init__(model, admin_site)


class BaseInlineModelAdmin(InlineModelAdmin):
    def get_autocomplete_fields(self, request):
        fields = None
        if self.fieldsets:
            fields = flatten_fieldsets(self.fieldsets)
        elif self.fields:
            fields = self.fields
        else:
            fields = [field.name for field in self.opts.fields]

        autocomplete_fields = super().get_autocomplete_fields(request)
        autocomplete_fields = list(autocomplete_fields)

        for default_autocomplete_field in (
            "load",
            "driver",
            "owner",
            "tractor",
            "trailer",
        ):
            if (default_autocomplete_field in fields) and (
                default_autocomplete_field not in autocomplete_fields
            ):
                autocomplete_fields.append(default_autocomplete_field)
        return autocomplete_fields

    extra = 1
    formfield_overrides = {
        models.TextField: {"widget": Textarea(attrs={"rows": 2, "cols": 40})},
    }


class BaseStackedInline(BaseInlineModelAdmin):
    template = "admin/edit_inline/stacked.html"


class BaseTabularInline(BaseInlineModelAdmin):
    template = "admin/edit_inline/tabular.html"
