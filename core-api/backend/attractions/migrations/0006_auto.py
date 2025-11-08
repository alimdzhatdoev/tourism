from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("attractions", "0005_auto"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="banner",
            name="attractions_banner_attraction_or_route",
        ),
    ]
