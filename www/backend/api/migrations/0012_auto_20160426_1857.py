# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-26 18:57
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_groupstagewinners'),
    ]

    operations = [
        migrations.RenameField(
            model_name='groupstagewinners',
            old_name='rank',
            new_name='ranking',
        ),
    ]