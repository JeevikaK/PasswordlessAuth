# Generated by Django 4.1.7 on 2023-04-03 16:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0006_recoverytoken_alter_user_token"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="blockchain_auth",
        ),
        migrations.AlterField(
            model_name="user",
            name="token",
            field=models.CharField(
                default="69597953f633416f9ac5d226d9d4daee", max_length=100, unique=True
            ),
        ),
    ]