from django.db import models
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from django.db.models.signals import post_save

################################################################################
# model definition
################################################################################
class UserProfile(models.Model):
	user = models.OneToOneField(AuthUser, on_delete=models.SET_NULL, blank=True, null=True)
	avatar = models.CharField(max_length=512, blank=True, default='')

	
class Points(models.Model):
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, blank=True, null=True)
	prono = models.CharField(max_length=100, blank=True, default='')
	points = models.IntegerField(blank=True, default=0)
	
	
class Team(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	abr = models.CharField(max_length=5, blank=True, default='')
	icon = models.CharField(max_length=256, blank=True, default='')
	iso_icon = models.CharField(max_length=5, blank=True, default='')
	group = models.ForeignKey('Group',on_delete=models.SET_NULL,related_name='teams', blank=True, null=True)
	groupstage_points = models.FloatField(blank=True, default=0)
	
	def __str__(self):
		return '{}'.format(self.name)

		
class Group(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	
	def __str__(self):
		return '{}'.format(self.name)	
		
		
class Match(models.Model):
	team1 = models.ForeignKey('Team', on_delete=models.SET_NULL, related_name='matches_team1', blank=True, null=True)
	team2 = models.ForeignKey('Team', on_delete=models.SET_NULL, related_name='matches_team2', blank=True, null=True)
	defaultteam1 = models.CharField(max_length=5, blank=True, default='')
	defaultteam2 = models.CharField(max_length=5, blank=True, default='')
	date = models.BigIntegerField(blank=True, default=0)
	stage = models.IntegerField(blank=True, default=0)
	group = models.ForeignKey('Group', on_delete=models.SET_NULL,related_name='matches', blank=True, null=True)
	position = models.IntegerField(blank=True,default=0)
	
	def save(self, *args, **kwargs):
		super(Match, self).save(*args, **kwargs)
		
		# create a match result
		match_result = MatchResult(match=self)
		match_result.save()


	def __str__(self):
		return '{}'.format(self.id)
		
	
class MatchResult(models.Model):
	match = models.OneToOneField('Match', on_delete=models.CASCADE, related_name='result', blank=True, null=True)
	score1 = models.IntegerField(blank=True, default=-1)
	score2 = models.IntegerField(blank=True, default=-1)
	penalty1 = models.IntegerField(blank=True, default=-1)
	penalty2 = models.IntegerField(blank=True, default=-1)
	
	def save(self, *args, **kwargs):
		super(MatchResult, self).save(*args, **kwargs)
		
		# recalculate the points for all users
		calculate_points()
	
	def __str__(self):
		return '{} - {}'.format(self.score1, self.score2)
	


################################################################################
# signals
################################################################################
def prepare_user(sender, **kwargs):
	"""
	performs actions new user is created
	"""

	user = kwargs["instance"]
	if kwargs["created"]:
		# profile
		user_profile = UserProfile(user=user)
		user_profile.save()
		
		# points
		for prono in ['total','groupstage_result','groupstage_score','knockoutstage_result','knockoutstage_score','knockoutstage_teams','total_goals','team_result']:
			user_points = UserPoints(user=user, prono=prono)
			user_points.save()
		
post_save.connect(prepare_user, sender=AuthUser)



def calculate_points():
	pass
	

		
	
