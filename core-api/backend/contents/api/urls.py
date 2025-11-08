from rest_framework.routers import SimpleRouter

from . import views

router = SimpleRouter()

router.register("posts", views.PostViewSet, basename="posts")
router.register("post_contents", views.PostContentViewSet, basename="post_contents")
router.register("post_sections", views.PostSectionViewSet, basename="post_sections")
router.register(
    "user_gallery_photos", views.UserGalleryPhotoViewSet, basename="user_gallery_photos"
)

urlpatterns = router.urls
