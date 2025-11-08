from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("attractions", "0013_auto"),
    ]

    operations = [
        migrations.AddField(
            model_name="location",
            name="formatted",
            field=models.CharField(
                blank=True, max_length=1024, null=True, verbose_name="Formatted"
            ),
        ),
    ]
