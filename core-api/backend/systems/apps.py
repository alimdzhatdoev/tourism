from common.apps import BaseAppConfig
from django.contrib import admin


class SystemsAppConfig(BaseAppConfig):
    name = "systems"
    label = "systems"
    verbose_name = "Systems"

    def ready(self):
        # Automatically register in admin all models
        # importing from here to not face error - apps not loaded yet

        models = self.get_models()
        for model in models:
            if not admin.site.is_registered(model):
                admin.site.register(model, admin.ModelAdmin)
