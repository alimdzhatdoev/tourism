from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("attractions", "0010_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="attraction",
            name="status",
            field=models.CharField(
                choices=[
                    ("CREATION", "Creation"),
                    ("ARCHIVE", "Archive"),
                    ("PUBLISHED", "Published"),
                ],
                default="ARCHIVE",
                max_length=9,
                verbose_name="Status",
            ),
        ),
        migrations.AlterField(
            model_name="attractionhistory",
            name="status",
            field=models.CharField(
                choices=[
                    ("CREATION", "Creation"),
                    ("ARCHIVE", "Archive"),
                    ("PUBLISHED", "Published"),
                ],
                default="ARCHIVE",
                max_length=9,
                verbose_name="Status",
            ),
        ),
    ]
