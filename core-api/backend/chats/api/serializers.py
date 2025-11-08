from rest_framework import serializers

from chats.models import ChatMessage, Chat
from common.serializers import BaseModelSerializer, BaseFileModelSerializer


class ChatSerializer(BaseModelSerializer):
    creator_unread_message_count = serializers.SerializerMethodField(read_only=True)
    admin_unread_message_count = serializers.SerializerMethodField(read_only=True)

    last_message = serializers.SerializerMethodField(read_only=True)
    last_message_dttm = serializers.DateTimeField(read_only=True)

    def get_creator_unread_message_count(self, chat):
        return chat.messages.filter(is_read=False).exclude(created_by=chat.created_by).count()

    def get_admin_unread_message_count(self, chat):
        return chat.messages.filter(is_read=False, created_by=chat.created_by).count()

    def get_last_message(self, chat):
        return ChatMessageSerializer(chat.messages.order_by("-created_dttm").first()).data

    class Meta:
        model = Chat
        expandable_fields = dict(
            messages=dict(serializer="chats.api.serializers.ChatMessageSerializer", many=True),
        )


class ChatMessageSerializer(BaseFileModelSerializer):
    class Meta:
        model = ChatMessage
        expandable_fields = dict(
            chat=dict(serializer="chats.api.serializers.ChatSerializer", many=False),
        )
