from rest_framework import filters, status
from rest_framework.response import Response

from chats.api.serializers import ChatSerializer, ChatMessageSerializer
from chats.models import Chat, ChatMessage
from common.ordering_filter import NullsAlwaysLastOrderingFilter
from common.swagger import get_method_decorators_expand_params
from common.viewsets import BaseModelViewSet
from rest_framework.decorators import action
from django_filters import rest_framework as d_filters

from django.utils.decorators import method_decorator


@method_decorator(**get_method_decorators_expand_params(ChatSerializer))
class ChatViewSet(BaseModelViewSet):
    queryset = Chat.annotated_objects.all()
    serializer_class = ChatSerializer

    filter_backends = (
        d_filters.DjangoFilterBackend,
        NullsAlwaysLastOrderingFilter,
    )

    # filterset_fields = {
    #     "chat": ["exact"],
    # }

    ordering_fields = [
        "last_message_dttm"
    ]

    @action(methods=["GET"], detail=False)
    def my(self, request):
        if request.user:
            qs = Chat.objects.get_or_create(created_by=request.user)[0]
            data = self.get_serializer(qs).data
            return Response(data)


@method_decorator(**get_method_decorators_expand_params(ChatMessageSerializer))
class ChatMessageViewSet(BaseModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    filter_backends = (
        d_filters.DjangoFilterBackend,
        filters.OrderingFilter,
    )

    filterset_fields = {
        "chat": ["exact"],
    }

    @action(methods=["GET"], detail=False)
    def mychat(self, request):
        if request.user:
            qs = self.get_queryset().filter(chat__created_by=request.user)
            page = self.paginate_queryset(qs)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            return Response(self.get_serializer(qs, many=True))
        return Response(data={"detail": "Authentication required"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["POST"], detail=False)
    def send_message(self, request):
        request.data["chat"] = Chat.objects.get_or_create(created_by=request.user)[0].id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = self.get_serializer(serializer.save()).data
        return Response(data)
