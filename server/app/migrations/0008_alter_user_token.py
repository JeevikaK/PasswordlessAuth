# Generated by Django 4.1.7 on 2023-04-03 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0007_remove_user_blockchain_auth_alter_user_token"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="token",
            field=models.CharField(max_length=100, unique=True),
        ),
    ]