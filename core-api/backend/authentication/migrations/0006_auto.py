from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0005_auto"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="is_admin",
            field=models.BooleanField(default=False),
        ),
    ]
