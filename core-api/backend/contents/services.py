def generate_post_sections():
    from contents.models import PostSection

    try:
        PostSection.objects.get_or_create(slug="news", defaults=dict(name="Новости"))
        PostSection.objects.get_or_create(slug="for-tourists", defaults=dict(name="На помощь туристу"))
    except Exception:
        pass
