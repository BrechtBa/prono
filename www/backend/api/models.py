from django.db import models


class Team(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	abr = models.CharField(max_length=5, blank=True, default='')
	icon = models.CharField(max_length=256, blank=True, default='')
	iso_icon = models.CharField(max_length=5, blank=True, default='')
	#group
	groupstage_points = models.FloatField(default=0)


class Match(models.Model):
	team1 = models.ForeignKey('Team',on_delete=models.CASCADE,related_name='team1', blank=True)
	team2 = models.ForeignKey('Team',on_delete=models.CASCADE,related_name='team2', blank=True)
	defaultteam1 = models.CharField(max_length=5, blank=True, default='')
	defaultteam2 = models.CharField(max_length=5, blank=True, default='')
	date = models.BigIntegerField(blank=True,default=0)
	stage = models.IntegerField(blank=True,default=0)
	group = models.CharField(max_length=5, blank=True)
	position = models.IntegerField(blank=True,default=0)

	def save(self, *args, **kwargs):
		super(Match, self).save(*args, **kwargs)
