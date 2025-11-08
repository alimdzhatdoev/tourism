from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("attractions", "0008_auto"),
    ]

    operations = [
        migrations.RenameField(
            model_name="banner",
            old_name="photo",
            new_name="file",
        ),
    ]
