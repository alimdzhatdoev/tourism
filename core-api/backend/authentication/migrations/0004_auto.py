from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0003_auto"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="first_name",
            field=models.CharField(
                blank=True, max_length=32, null=True, verbose_name="First Name"
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="last_name",
            field=models.CharField(
                blank=True, max_length=32, null=True, verbose_name="Last Name"
            ),
        ),
    ]
