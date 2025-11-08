from common.apps import BaseAppConfig


class ContentsAppConfig(BaseAppConfig):
    name = "contents"
    label = "contents"
    verbose_name = "Contents"

    def ready(self):
        super().ready()
        from .services import generate_post_sections

        generate_post_sections()
