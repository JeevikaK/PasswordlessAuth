# Generated by Django 4.1.7 on 2023-04-09 16:12

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0011_alter_user_inapp_public_key"),
    ]

    operations = [
        migrations.CreateModel(
            name="TestBytes",
            fields=[
                ("id", models.IntegerField(primary_key=True, serialize=False)),
                ("bytes", models.BinaryField()),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
