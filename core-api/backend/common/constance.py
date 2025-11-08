from django.forms import CharField, Textarea, TextInput, ValidationError
from typing import List


class TemplateField(CharField):
    widget = Textarea(attrs={"rows": 3, "cols": 30})
    default_error_messages = {
        "template": "Шаблон должен содержать: {placeholders}.",
    }

    def __init__(self, *, placeholders: List[str] = None, **kwargs) -> None:
        self.placeholders = placeholders
        super().__init__(**kwargs)

    def validate(self, template):
        absent_placeholders = [
            placeholder
            for placeholder in self.placeholders
            if placeholder not in template
        ]
        if len(absent_placeholders):
            raise ValidationError(
                self.error_messages["template"].format(
                    placeholders=", ".join(absent_placeholders)
                ),
                code="template",
            )


class ListInput(TextInput):
    def format_value(self, value):
        separator = self.attrs["separator"]
        if value:
            return separator.join([str(x) for x in value])
        return ""


class StringList(CharField):
    def __init__(self, *, separator: str = None, **kwargs) -> None:
        self.separator = separator or ","
        super().__init__(**kwargs)

    @property
    def widget(self):
        return ListInput(attrs=dict(separator=self.separator))

    @widget.setter
    def widget(self, value):
        pass

    def to_python(self, value):
        value = super().to_python(value)
        if value:
            return value.split(self.separator)
        return None
