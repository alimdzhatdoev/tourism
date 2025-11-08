from rest_framework.routers import SimpleRouter

from chats.api import views

router = SimpleRouter()

router.register("chats", views.ChatViewSet, basename="chats")
router.register("chat_messages", views.ChatMessageViewSet, basename="chat_messages")

urlpatterns = router.urls
