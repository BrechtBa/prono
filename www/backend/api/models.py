from django.db import models
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from django.db.models.signals import post_save
from rest_framework_jwt.utils import jwt_payload_handler as base_jwt_payload_handler

import datetime

# model definition
################################################################################
# Users
################################################################################
class UserProfile(models.Model):
	user = models.OneToOneField(AuthUser, on_delete=models.SET_NULL, related_name='profile', blank=True, null=True)
	avatar = models.CharField(max_length=512, blank=True, default='')

	
class Points(models.Model):
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='points', blank=True, null=True)
	prono = models.CharField(max_length=100, blank=True, default='')
	points = models.IntegerField(blank=True, default=0)
	
	
################################################################################
# Competition
################################################################################

class Group(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	
	def __str__(self):
		return '{}'.format(self.name)	
		

class Team(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	abr = models.CharField(max_length=5, blank=True, default='')
	icon = models.CharField(max_length=256, blank=True, default='')
	iso_icon = models.CharField(max_length=5, blank=True, default='')
	group = models.ForeignKey(Group,on_delete=models.SET_NULL,related_name='teams', blank=True, null=True)
	groupstage_points = models.FloatField(blank=True, default=0)
	
	def __str__(self):
		return '{}'.format(self.name)

		
class Match(models.Model):
	team1 = models.ForeignKey(Team, on_delete=models.SET_NULL, related_name='matches_team1', blank=True, null=True)
	team2 = models.ForeignKey(Team, on_delete=models.SET_NULL, related_name='matches_team2', blank=True, null=True)
	defaultteam1 = models.CharField(max_length=5, blank=True, default='')
	defaultteam2 = models.CharField(max_length=5, blank=True, default='')
	date = models.BigIntegerField(blank=True, default=0)
	stage = models.IntegerField(blank=True, default=0)
	group = models.ForeignKey(Group, on_delete=models.SET_NULL,related_name='matches', blank=True, null=True)
	position = models.IntegerField(blank=True,default=0)
	
	def save(self, *args, **kwargs):
		super(Match, self).save(*args, **kwargs)
		
		# create a match result
		match_result = MatchResult(match=self)
		match_result.save()

		# create prono results for all users
		for user in AuthUser.objects.all(): 
			if len(user.prono_result.filter(match=self)) == 0:
				prono_result = PronoResult(match=self,user=user)
				prono_result.save()
		
	def __str__(self):
		return '{}'.format(self.id)
		
	
class MatchResult(models.Model):
	match = models.OneToOneField(Match, on_delete=models.CASCADE, related_name='result', blank=True, null=True)
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
# Prono
################################################################################
class PronoResult(models.Model):
	match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='prono_result', blank=True, null=True)
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='prono_result', blank=True, null=True)
	score1 = models.IntegerField(blank=True, default=-1)
	score2 = models.IntegerField(blank=True, default=-1)
	
	def __str__(self):
		return '{} - {}'.format(self.score1, self.score2)
	
class PronoKnockoutstageTeams(models.Model):
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='prono_knockoutstage_teams', blank=True, null=True)
	stage = models.IntegerField(blank=True, default=-1)
	team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='prono_knockoutstage_teams', blank=True, null=True)
	
	
	
# helper elements	
################################################################################
# signals
################################################################################
def prepare_user(sender, **kwargs):
	"""
	performs actions new user is created
	"""
	
	user = kwargs["instance"]
	if kwargs["created"]:
		check_user(user)
		
post_save.connect(prepare_user, sender=AuthUser)


def check():
	#print('check')
	# check if all matches have a result
	for match in Match.objects.all():
		try:
			match.result
		except:
			result = MatchResult(match=match)
			result.save()
			#print('Added result for match {}'.format(match))
	
	for user in AuthUser.objects.all():
		check_user(user)
	
def check_user(user):
	#print('check {}'.format(user.username))
	# check if the user has a profile
	try:
		user.profile
	except:
		user_profile = UserProfile(user=user)
		user_profile.save()
		
	# check if the user has points entries for all pronos	
	for prono in ['total','groupstage_result','groupstage_score','knockoutstage_result','knockoutstage_score','knockoutstage_teams','total_goals','team_result']:
		if not prono in [p.prono for p in user.points.all()]:
			user_points = Points(user=user, prono=prono)
			user_points.save()
			#print('Added points for user {} on prono {}'.format(user,prono))
			
	# check if the user has entries for all pronos
	for match in Match.objects.all():
		if len(user.prono_result.filter(match=match)) == 0:
			prono = PronoResult(user=user,match=match)
			prono.save()
			#print('Added prono_result for user {} on match {}'.format(user,match))

def calculate_points():
	pass

	
	
################################################################################
# JWT
################################################################################
def jwt_payload_handler(user):
	payload = base_jwt_payload_handler(user)
	
	# add aditional data to the payload
	payload['acces_exp'] = 0
	if user.is_staff:
		payload['permission'] = 9
	else:
		payload['permission'] = 1

	return payload
	
	
