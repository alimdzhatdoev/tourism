from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("routes", "0002_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="route",
            name="status",
            field=models.CharField(
                choices=[
                    ("CREATION", "Creation"),
                    ("VERIFICATION", "Verification"),
                    ("SUSPENSION", "Suspension"),
                    ("PUBLICATION", "Publication"),
                ],
                default="SUSPENSION",
                max_length=12,
                verbose_name="Status",
            ),
        ),
        migrations.AlterField(
            model_name="routehistory",
            name="status",
            field=models.CharField(
                choices=[
                    ("CREATION", "Creation"),
                    ("VERIFICATION", "Verification"),
                    ("SUSPENSION", "Suspension"),
                    ("PUBLICATION", "Publication"),
                ],
                default="SUSPENSION",
                max_length=12,
                verbose_name="Status",
            ),
        ),
    ]
