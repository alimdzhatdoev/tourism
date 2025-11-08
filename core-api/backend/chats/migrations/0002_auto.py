from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("chats", "0001_auto"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="chatmessage",
            options={"ordering": ("-created_dttm",)},
        ),
    ]
