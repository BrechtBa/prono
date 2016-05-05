from django.db import models
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from django.db.models.signals import post_save
from rest_framework_jwt.utils import jwt_payload_handler as base_jwt_payload_handler

from api.utils import unixtimestamp

# model definition
################################################################################
# Users
################################################################################
class UserStatus(models.Model):
	user = models.OneToOneField(AuthUser, on_delete=models.CASCADE, related_name='status', blank=True, null=True)
	databaseprepared = models.BooleanField(default=False)

class UserProfile(models.Model):
	user = models.OneToOneField(AuthUser, on_delete=models.CASCADE, related_name='profile', blank=True, null=True)
	displayname = models.CharField(max_length=100, blank=True, default='')
	avatar = models.CharField(max_length=256, blank=True, default='')

class AvatarUpload(models.Model):
	user = models.OneToOneField(AuthUser, on_delete=models.CASCADE, related_name='avatar_upload', blank=True, null=True)
	file = models.FileField(upload_to='avatars/', blank=True, default='')


################################################################################
# Competition
################################################################################
class LastUpdate(models.Model):
	date = models.BigIntegerField(blank=True, default=0)
	

class Group(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	
	def save(self, *args, **kwargs):
		super(Group, self).save(*args, **kwargs)
		
		# create prono results for all users
		for user in AuthUser.objects.all(): 
			prepare_database_for_user(user)
		
		# set the update field
		set_last_update(pk=2)

	def __str__(self):
		return '{}'.format(self.name)
		

class Team(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	abr = models.CharField(max_length=5, blank=True, default='')
	icon = models.CharField(max_length=256, blank=True, default='')
	iso_icon = models.CharField(max_length=32, blank=True, default='')
	group = models.ForeignKey(Group,on_delete=models.SET_NULL, related_name='teams', blank=True, null=True)
	groupstage_points = models.FloatField(blank=True, default=0)
	
	def save(self, *args, **kwargs):
		super(Team, self).save(*args, **kwargs)
		
		# create prono results for all users
		for user in AuthUser.objects.all(): 
			prepare_database_for_user(user)
	
		# set the update field
		set_last_update(pk=2)

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
		if len(MatchResult.objects.filter(match=self)) == 0:
			match_result = MatchResult(match=self)
			match_result.save()

		# create prono results for all users
		for user in AuthUser.objects.all(): 
			prepare_database_for_user(user)
		
		# set the update field
		set_last_update(pk=2)

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
			
		# set the update field
		set_last_update(pk=2)

	def __str__(self):
		return '{} - {}'.format(self.score1, self.score2)
	
	

################################################################################
# Prono
################################################################################
class Points(models.Model):
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='points', blank=True, null=True)
	prono = models.CharField(max_length=100, blank=True, default='')
	points = models.IntegerField(blank=True, default=0)
	
	def __str__(self):
		return '{}'.format(self.points)	

class PronoResult(models.Model):
	match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='prono_result', blank=True, null=True)
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='prono_result', blank=True, null=True)
	score1 = models.IntegerField(blank=True, default=-1)
	score2 = models.IntegerField(blank=True, default=-1)
	
	def __str__(self):
		return '{} - {}'.format(self.score1, self.score2)

class PronoGroupstageWinners(models.Model):
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='prono_groupstage_winners', blank=True, null=True)
	group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='prono_groupstage_winners', blank=True, null=True)
	ranking = models.IntegerField(blank=True, default=-1)
	team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='prono_groupstage_winners', blank=True, null=True)
	
class PronoKnockoutstageTeams(models.Model):
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='prono_knockoutstage_teams', blank=True, null=True)
	stage = models.IntegerField(blank=True, default=-1)
	team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='prono_knockoutstage_teams', blank=True, null=True)
	
class PronoTotalGoals(models.Model):
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='prono_total_goals', blank=True, null=True)
	goals = models.IntegerField(blank=True, default=-1)
	
class PronoTeamResult(models.Model):
	user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, related_name='prono_team_result', blank=True, null=True)
	team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='prono_team_result', blank=True, null=True)
	result = models.IntegerField(blank=True, default=-1)
	
	
	
	
################################################################################
# helper functions	
################################################################################
def prepare_user(sender, **kwargs):
	"""
	performs actions new user is created
	"""
	
	user = kwargs["instance"]
	if kwargs["created"]:
		# create the user status
		try:
			user.status
		except:
			user_status = UserStatus(user=user)
			user_status.save()
			
		# create the user profile
		try:
			user.profile
		except:
			user_profile = UserProfile(user=user,displayname=user.username)
			user_profile.save()
		
		# create the avatar upload
		try:
			user.avatar_upload
		except:
			avatar_upload = AvatarUpload(user=user)
			avatar_upload.save()
			
	# check if all matches have the required database entries		
	if user.is_staff:
		check_matches()

post_save.connect(prepare_user, sender=AuthUser)





def prepare_database_for_user(user):
	"""
	checks if all database entries are present for the user
	Arguments::
		user		django.contrib.auth.models.user object
		
	Returns::
		None
	"""
	
	# check if the user has points entries for all pronos	
	for prono in ['total','groupstage_result','groupstage_score','knockoutstage_result','knockoutstage_score','groupstage_winners','knockoutstage_teams','total_goals','team_result']:
		if not prono in [p.prono for p in user.points.all()]:
			user_points = Points(user=user, prono=prono)
			user_points.save()
			#print('Added points for user {} on prono {}'.format(user,prono))
		

	# check if the user has entries for all pronos
	# groupstage and knockoutstage result
	for match in Match.objects.all():
		if len(user.prono_result.filter(match=match)) == 0:
			prono = PronoResult(user=user,match=match)
			prono.save()
			#print('Added prono_result for user {} on match {}'.format(user,match))

	# groupstage_winners
	for ranking in [1,2]:
		for group in Group.objects.all():
			if len(user.prono_groupstage_winners.filter(group=group,ranking=ranking)) == 0:
				prono = PronoGroupstageWinners(user=user,group=group,ranking=ranking)
				prono.save()
				#print('Added prono_groupstage_winners {} for user {} on group {}'.format(ranking,user,group))

	# knockoutstage_teams
	stages = get_stages()

	# remove the largest stage and the groupstage
	if len(stages) > 0:
		if stages[0] == 0:
			del stages[0]
			
	if len(stages) > 0:	
		del stages[0]

		# add 1 for the winner
		stages.append(1)

		for stage in stages:
			pronos = user.prono_knockoutstage_teams.filter(stage=stage)
			for i in range(stage-len(pronos)):
				prono = PronoKnockoutstageTeams(user=user,stage=stage)
				prono.save()
				#print('Added prono_knockoutstage_teams {} for user {} on stage {}'.format(i+1,user,stage))

	# total_goals
	pronos = user.prono_total_goals.all()
	if len(pronos) == 0:
		prono = PronoTotalGoals(user=user)
		prono.save()

	# team_result
	for team in Team.objects.all():
		pronos = user.prono_team_result.filter(team=team)
		if len(pronos) == 0:
			prono = PronoTeamResult(user=user,team=team)
			prono.save()		
		
	# set the user status
	user_status = user.status
	user_status.databaseprepared = True
	user_status.save()
	
		
def calculate_points():
	"""
	Calculates the points for all users and writes results to the database
	
	Arguments::
		None
		
	Returns::
		None
	"""
	for user in AuthUser.objects.all():
		userpoints = calculate_user_points(user)
		
		for points in user.points.all():
			if points.prono in userpoints:
				points.points = userpoints[points.prono]
				points.save()

	set_last_update(pk=1)
	
				
def calculate_user_points(user):
	"""
	calculates the points of a user
	
	Arguments::
		user		django.contrib.auth.models.user object
		
	Returns::
		userpoints	dictionaty with the users points for different pronos
	"""
	userpoints = {}
	

	# groupstage
	groupstage_result = 0
	groupstage_score = 0
	for match in Match.objects.filter(stage=0):
		match_result = match.result
		
		for prono_result in match.prono_result.filter(user=user):
			match_played = match_result.score1 >-1 and match_result.score2 > -1
			team1winscorrect = (prono_result.score1 > prono_result.score2) and (match_result.score1 > match_result.score2)
			team2winscorrect = (prono_result.score1 < prono_result.score2) and (match_result.score1 < match_result.score2)
			tiecorrect = (prono_result.score1 == prono_result.score2) and (match_result.score1 == match_result.score2)
			
			# result correct
			if match_played and (team1winscorrect or team2winscorrect or tiecorrect):
				groupstage_result = groupstage_result + 3
			
			# score correct
			if match_played and (prono_result.score1 == match_result.score1) and ( prono_result.score2 == match_result.score2):
				groupstage_score = groupstage_score + 4
				
	userpoints['groupstage_result'] = groupstage_result
	userpoints['groupstage_score'] = groupstage_score
	

	# knockoutstage
	knockoutstage_result = 0
	knockoutstage_score = 0
	for match in Match.objects.filter(stage__gt=0):
		match_result = match.result
		
		for prono_result in match.prono_result.filter(user=user):
			match_played = match_result.score1 >-1 and match_result.score2 > -1
			team1winscorrect = (prono_result.score1 > prono_result.score2) and (match_result.score1 > match_result.score2)
			team2winscorrect = (prono_result.score1 < prono_result.score2) and (match_result.score1 < match_result.score2)
			tiecorrect = (prono_result.score1 == prono_result.score2) and (match_result.score1 == match_result.score2)
			
			# result correct
			if match_played and (team1winscorrect or team2winscorrect or tiecorrect):
				knockoutstage_result = knockoutstage_result + 6
			
			# score correct
			if match_played and (prono_result.score1 == match_result.score1) and ( prono_result.score2 == match_result.score2):
				knockoutstage_score = knockoutstage_score + 8
	
	userpoints['knockoutstage_result'] = knockoutstage_result
	userpoints['knockoutstage_score'] = knockoutstage_score


	# groupstage winners
	groupstage_winners = 0

	for group in Group.objects.all():
		teams = group.teams.order_by('groupstage_points').reverse()
		
		# dont give points when all teams have no points
		if sum([team.groupstage_points for team in teams]) > 0:
			prono_groupwinner = user.prono_groupstage_winners.filter(group=group,ranking=1)[0].team
			prono_grouprunnerup = user.prono_groupstage_winners.filter(group=group,ranking=2)[0].team
			
			if len(teams)>0:
				if teams[0] in [prono_groupwinner,prono_grouprunnerup]:
					groupstage_winners = groupstage_winners + 2
				
			if len(teams)>1:
				if teams[1] in [prono_groupwinner,prono_grouprunnerup]:
					groupstage_winners = groupstage_winners + 2
					
			if len(teams)>0:
				if teams[0] == prono_groupwinner:
					groupstage_winners = groupstage_winners + 4

	userpoints['groupstage_winners'] = groupstage_winners


	# knockoutstage teams
	knockoutstage_teams = 0
	stages = get_stages()
	stage_points = {16:10,8:18,4:28,2:42,1:60}

	# remove the largest stage and the groupstage
	if len(stages) > 0:
		if stages[0] == 0:
			del stages[0]
	if len(stages) > 0:		
		del stages[0]

	for stage in stages:
		for prono in user.prono_knockoutstage_teams.filter(stage=stage):
			# check if the team is still in the competition at this stage
			if not prono.team == None:
				if len(prono.team.matches_team1.filter(stage=stage)) > 0 or len(prono.team.matches_team2.filter(stage=stage)) > 0:
					knockoutstage_teams = knockoutstage_teams + stage_points[stage]
			

	# check if the winner is correct
	pronowinner = user.prono_knockoutstage_teams.filter(stage=1)
	if len(pronowinner)>0:
		team = pronowinner[0].team
		match = Match.objects.filter(stage=2)
		if len(match)>0:
			match = match[0]
			match_result = match.result
			if team in [match.team1,match.team2]:
				if (match_result.score1>-1 and match_result.score2>-1):
					team1correct = (match_result.score1+match_result.penalty1 > match_result.score2+match_result.penalty2) and team == match.team1
					team2correct = (match_result.score1+match_result.penalty1 < match_result.score2+match_result.penalty2) and team == match.team2
					if team1correct or team2correct:
						knockoutstage_teams = knockoutstage_teams + stage_points[1]

	userpoints['knockoutstage_teams'] = knockoutstage_teams


	# total_goals
	goals = 0
	for result in MatchResult.objects.all():
		if result.score1>-1 and result.score2>-1:
			goals = goals + result.score1 + result.score2

		
	prono_goals = user.prono_total_goals.all()
	if len(prono_goals)>0:
		prono_goals = prono_goals[0].goals
	else:
		prono_goals = -1
		
	if goals>0 and prono_goals > -1:
		userpoints['total_goals'] = max(0,100-6*abs(prono_goals-goals))
	else:
		userpoints['total_goals'] = 0

	# team_result
	team_result_points = 0
	stages = get_stages()
	
	stage_points = {0:5,16:10,8:30,4:50,2:100,1:150}
	for result in user.prono_team_result.all():
		if result.result > -1:
			team = result.team
			# determine in which stage the team is eliminated
			teaminstage = []
			for stage in stages:
				temp_teaminstage = 0
				for match in Match.objects.filter(stage=stage):
					
					if match.team1 == team or match.team2 == team:
						temp_teaminstage = 1;
					
					if match.team1 == None or match.team2 == None:
						temp_teaminstage = -1;  # teams not known yet

				teaminstage.append(temp_teaminstage);

				
			stage = -1;
			for i in range(len(teaminstage)-1):
				if teaminstage[i] == 1 and teaminstage[i+1] == 0:
					stage = stages[i]
					break
					
			
			# final or winner, check the score
			if stage == -1 and teaminstage[-1] == 1:
				finalmatch = Match.objects.filter(stage=2)
				if len(finalmatch)>0:
					finalmatch = finalmatch[0]
					if team == finalmatch.team1:
						if finalmatch.result.score1>-1 and finalmatch.result.score2>-1:
							if finalmatch.result.score1 + 0.1*finalmatch.result.penalty1 > finalmatch.result.score2 + 0.1*finalmatch.result.penalty2:
								stage = 1;
							else:
								stage = 2;
					elif team == finalmatch.team2:
						if finalmatch.result.score1>-1 and finalmatch.result.score2>-1:
							if finalmatch.result.score1 + 0.1*finalmatch.result.penalty1 > finalmatch.result.score2 + 0.1*finalmatch.result.penalty2:
								stage = 2;
							else:
								stage = 1;
								
			if result.result == stage:
				# determine the points
				team_result_points = team_result_points + stage_points[stage]


	userpoints['team_result'] = team_result_points

	# total
	keys = ['groupstage_result','groupstage_score','knockoutstage_result','knockoutstage_score','groupstage_winners','knockoutstage_teams','total_goals','team_result']

	userpoints['total'] = sum([userpoints[key] for key in keys])
	
	return userpoints



def check_matches():
	"""
	checks if all database entries are present for all matches
	"""
	# check if all matches have a result
	for match in Match.objects.all():
		try:
			match.result
		except:
			result = MatchResult(match=match)
			result.save()
			#print('Added result for match {}'.format(match))
		

def set_last_update(pk=1):	
	"""
	checks if the lastupdate model is present and updates is 
	"""

	try:
		lastupdate = LastUpdate.objects.get(pk=pk)
		lastupdate.date = unixtimestamp()
		lastupdate.save()

	except:
		lastupdate = LastUpdate(date=unixtimestamp())
		lastupdate.save()


def get_stages():
	stages = []
	for match in Match.objects.all():
		if not match.stage in stages:
			stages.append(match.stage)
	stages.sort(reverse=True)
	
	# move the groupstage to the front
	if 0 in stages:
		stages.insert(0, stages.pop(stages.index(0)))

	return stages

	

def jwt_payload_handler(user):
	payload = base_jwt_payload_handler(user)
	
	stages = get_stages()
	
	# get the current stage and the 1st match of the current stage
	currentstage = -1
	firstmatchdate = unixtimestamp() + 24*3600
	for stage in stages:
		# all matches of the stage are in the future
		if len( Match.objects.filter(stage=stage) ) == len(  Match.objects.filter(stage=stage,date__gt=unixtimestamp()+3600) ):
			currentstage = stage
			matches = Match.objects.filter(stage=stage).order_by('date')
			firstmatchdate = matches[0].date
			break
	
	
	# add aditional data to the payload	
	payload['stage'] = currentstage
	payload['access_exp'] = firstmatchdate-3600

	if user.is_staff:
		payload['permission'] = 9
	else:
		payload['permission'] = 1

	return payload
	
	
