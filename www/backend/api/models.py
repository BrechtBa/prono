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
  
class Team(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	abr = models.CharField(max_length=5, blank=True, default='')
	icon = models.CharField(max_length=256, blank=True, default='')
	iso_icon = models.CharField(max_length=5, blank=True, default='')
	#group = models.ForeignKey('Group',on_delete=models.SET_NULL,related_name='group', blank=True, null=True)
	groupstage_points = models.FloatField(blank=True, default=0)
	
	def __unicode__(self):
		return '{}'.format(self.name)
		
class Match(models.Model):
	team1 = models.ForeignKey('Team', on_delete=models.SET_NULL, related_name='team1', blank=True, null=True)
	team2 = models.ForeignKey('Team', on_delete=models.SET_NULL, related_name='team2', blank=True, null=True)
	defaultteam1 = models.CharField(max_length=5, blank=True, default='')
	defaultteam2 = models.CharField(max_length=5, blank=True, default='')
	date = models.BigIntegerField(blank=True, default=0)
	stage = models.IntegerField(blank=True, default=0)
	group = models.ForeignKey('Group', on_delete=models.SET_NULL,related_name='group', blank=True, null=True)
	position = models.IntegerField(blank=True,default=0)
	
	def save(self, *args, **kwargs):
		# create a match result
		match_result = MatchResult(match=self)
		match_result.save()
		super(Match, self).save(*args, **kwargs)

	def __unicode__(self):
		return '{}'.format(self.id)
		
class Group(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	
class MatchResult(models.Model):
	match = models.OneToOneField('Match', on_delete=models.CASCADE, related_name='match', blank=True, null=True)
	score1 = models.IntegerField(blank=True, default=-1)
	score2 = models.IntegerField(blank=True, default=-1)
	penalty1 = models.IntegerField(blank=True, default=-1)
	penalty2 = models.IntegerField(blank=True, default=-1)
	
	def save(self, *args, **kwargs):
		super(MatchResult, self).save(*args, **kwargs)
	
	
	
################################################################################
# signal definition
################################################################################
def create_user_profile(sender, **kwargs):
	"""
	creates a user profile
	"""
	
	user = kwargs["instance"]
	if kwargs["created"]:
		user_profile = UserProfile(user=user)
		user_profile.save()

# create connections
# create a user profile when a user is created		
post_save.connect(create_user_profile, sender=AuthUser)