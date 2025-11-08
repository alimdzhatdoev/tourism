from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ServiceVersion",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "service",
                    models.CharField(
                        max_length=32, unique=True, verbose_name="Service"
                    ),
                ),
                ("version", models.CharField(max_length=16, verbose_name="Version")),
            ],
        ),
    ]
