# Generated by Django 3.1.1 on 2020-09-13 06:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vetodo_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='reminder_datetime',
            field=models.DateTimeField(null=True),
        ),
    ]