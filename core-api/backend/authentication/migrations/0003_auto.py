from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0002_remove_user_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="first_name",
            field=models.CharField(max_length=32, null=True, verbose_name="First Name"),
        ),
        migrations.AlterField(
            model_name="user",
            name="last_name",
            field=models.CharField(max_length=32, null=True, verbose_name="Last Name"),
        ),
    ]
