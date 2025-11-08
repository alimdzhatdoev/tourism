from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import OuterRef, Subquery

from common.models import BaseModel

User = get_user_model()


class ChatAnnotatedManager(models.Manager):
    def get_queryset(self):
        qs = super().get_queryset()

        messages = ChatMessage.objects.filter(chat=OuterRef("pk")).values("created_dttm").order_by("-created_dttm")
        return qs.annotate(last_message_dttm=Subquery(messages[:1]))


class Chat(BaseModel):
    created_by = models.OneToOneField(User, on_delete=models.CASCADE, related_name="chat")

    annotated_objects = ChatAnnotatedManager()
    objects = models.Manager()
    #
    # class Meta:
    #     ordering = ("messages__created_dttm",)


class ChatMessage(BaseModel):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")

    message = models.CharField("Message", max_length=512, null=True, blank=True)
    file = models.FileField(null=True, blank=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ("-created_dttm",)

