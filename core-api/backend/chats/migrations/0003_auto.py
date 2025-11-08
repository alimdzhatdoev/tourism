from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("chats", "0002_auto"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="chat",
            options={"ordering": ("messages__created_dttm",)},
        ),
    ]
