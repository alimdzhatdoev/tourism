from django.db import models

from attractions.models.addresses import Region
from common.models import BaseModel


class PostSection(models.Model):
    slug = models.SlugField(max_length=16, unique=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = "contents_post_sections"


class Post(BaseModel):
    section = models.ForeignKey(
        PostSection, on_delete=models.CASCADE, related_name="posts"
    )

    title = models.CharField(max_length=255)
    cover = models.FileField(null=True, blank=True)

    published_at = models.DateTimeField(null=True, blank=True, db_index=True)

    class Meta:
        db_table = "contents_posts"


class PostContent(BaseModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="content")
    subtitle = models.CharField(max_length=255, blank=True)
    text = models.TextField(blank=True)
    image = models.FileField(null=True, blank=True)

    class Meta:
        db_table = "contents_post_content"


class UserGalleryPhoto(BaseModel):
    file = models.FileField()
    description = models.CharField(max_length=255, null=True, blank=True)

    published_at = models.DateTimeField(null=True, blank=True, db_index=True)

    region = models.ForeignKey(
        Region,
        on_delete=models.CASCADE,
        related_name="user_gallery_photos",
        null=True,
        blank=True,
    )

    class Meta:
        db_table = "contents_user_gallery_photos"
        ordering = ("-created_dttm",)
