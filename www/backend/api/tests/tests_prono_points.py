from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup

import json
import mock
import random

from ..models import UserProfile,Points,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult

from .utils import PronoTest,EC2016Test,MockDatetime
		
class PronoPointsTests(PronoTest):
	
	def test_prono_groupstage_result_points_calculation_correct(self):
	
		# fill in prono
		user = AuthUser.objects.all()[1]
		
		match = Match.objects.all()[0]
		prono_result = PronoResult.objects.filter(match=match,user=user)[0]
		prono_result.score1 = 2
		prono_result.score2 = 1
		prono_result.save()
		
		# edit the match result
		match_result = match.result
		match_result.score1 = 4
		match_result.score2 = 2
		match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,3)
		
		
	def test_prono_groupstage_result_points_calculation_correct_tie(self):
	
		# fill in prono
		user = AuthUser.objects.all()[1]
		
		match = Match.objects.all()[0]
		prono_result = PronoResult.objects.filter(match=match,user=user)[0]
		prono_result.score1 = 2
		prono_result.score2 = 2
		prono_result.save()

		
		# edit the match result
		match_result = match.result
		match_result.score1 = 2
		match_result.score2 = 2
		match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,3)	
			
	def test_prono_groupstage_result_points_calculation_noprono_tie(self):
	
		# fill in prono
		user = AuthUser.objects.all()[1]
		
		match = Match.objects.all()[0]

		# edit the match result
		match_result = match.result
		match_result.score1 = 1
		match_result.score2 = 1
		match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,0)
		
	def test_prono_groupstage_result_points_calculation_all_matches_correct(self):
	
		# fill in prono
		user = AuthUser.objects.all()[1]
		
		matches =  Match.objects.filter(stage=0)

		for match in matches:
			prono_result = PronoResult.objects.filter(match=match,user=user)[0]
			prono_result.score1 = 2
			prono_result.score2 = 1
			prono_result.save()
		
		
		for match in matches:
			match_result = match.result
			match_result.score1 = 4
			match_result.score2 = 2
			match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,3*len(matches))
		
		
	def test_prono_groupstage_result_points_calculation_all_matches_correct_api(self):
		
		token = self.generate_token(self.usercredentials[1])
		
		# get all prono results of the user
		response = self.client.get('/pronoresults/?user=2', HTTP_AUTHORIZATION='JWT {}'.format(token))
		responsedata = json.loads(response.rendered_content.decode('utf-8'))

		# edit the prono results
		for prono_result in responsedata:
			response = self.client.put('/pronoresults/{}/'.format(prono_result['id']), data=json.dumps({'score1':3, 'score2':2}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
			
		# obtain an admin token
		token = self.generate_token(self.usercredentials[0])
		# edit the match results
		response = self.client.get('/matchresults/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		
		for match_result in responsedata:
			response = self.client.put('/matchresults/{}/'.format(match_result['id']), data=json.dumps({'score1':3, 'score2':2}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))

		matches = Match.objects.filter(stage=0)

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=self.users[1],prono='groupstage_result')[0]
		self.assertEqual(points.points,3*len(matches))	
	
		
	def test_prono_groupstage_result_points_calculation_incorrect(self):
	
		# fill in prono
		user = AuthUser.objects.all()[1]
		
		match = Match.objects.all()[0]
		prono_result = PronoResult.objects.filter(match=match,user=user)[0]
		prono_result.score1 = 4
		prono_result.score2 = 2
		prono_result.save()
		
		# edit the match result
		match_result = match.result
		match_result.score1 = 2
		match_result.score2 = 3
		match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,0)	

		
	def test_prono_groupstage_score_points_calculation_correct(self):
	
		# fill in prono
		user = AuthUser.objects.all()[1]
		
		match = Match.objects.all()[0]
		prono_result = PronoResult.objects.filter(match=match,user=user)[0]
		prono_result.score1 = 2
		prono_result.score2 = 1
		prono_result.save()
		
		# edit the match result
		match_result = match.result
		match_result.score1 = 2
		match_result.score2 = 1
		match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_score')[0]
		self.assertEqual(points.points,4)
	

	def test_prono_knockoutstage_result_points_calculation_all_matches_correct(self):
	
		# fill in prono
		user = AuthUser.objects.all()[1]
		
		matches =  Match.objects.filter(stage__gt=0)

		for match in matches:
			prono_result = PronoResult.objects.filter(match=match,user=user)[0]
			prono_result.score1 = 2
			prono_result.score2 = 1
			prono_result.save()
		
		
		for match in matches:
			match_result = match.result
			match_result.score1 = 4
			match_result.score2 = 2
			match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='knockoutstage_result')[0]
		self.assertEqual(points.points,6*len(matches))


	def test_prono_knockoutstage_score_points_calculation_all_matches_correct(self):
	
		# fill in prono for a match for a user
		user = AuthUser.objects.all()[1]
		
		matches =  Match.objects.filter(stage__gt=0)

		for match in matches:
			prono_result = PronoResult.objects.filter(match=match,user=user)[0]
			prono_result.score1 = 2
			prono_result.score2 = 1
			prono_result.save()
		
		
		for match in matches:
			match_result = match.result
			match_result.score1 = 2
			match_result.score2 = 1
			match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='knockoutstage_score')[0]
		self.assertEqual(points.points,8*len(matches))

	def test_prono_groupstage_winners_points_calculation_correct(self):
	
		# fill in prono
		user = self.users[1]
		groups = [self.groups[0]]
		
		for group in groups:
			teams = group.teams.all()
		
			prono = PronoGroupstageWinners.objects.filter(group=group,user=user,ranking=1)[0]
			prono.team = teams[1]
			prono.save()
			
			prono = PronoGroupstageWinners.objects.filter(group=group,user=user,ranking=2)[0]
			prono.team = teams[3]
			prono.save()
		
		# set results
		for group in groups:
			teams = group.teams.all()
			team = teams[0]
			team.groupstage_points = 0
			team.save()
			
			team = teams[1]
			team.groupstage_points = 9
			team.save()
			
			team = teams[2]
			team.groupstage_points = 7.3
			team.save()
			
			team = teams[3]
			team.groupstage_points = 7.4
			team.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_winners')[0]
		self.assertEqual(points.points,8)

		
	def test_prono_groupstage_winners_points_calculation_partial(self):
	
		# fill in prono
		user = self.users[1]
		groups = [self.groups[0]]
		
		for group in groups:
			teams = group.teams.all()
		
			prono = PronoGroupstageWinners.objects.filter(group=group,user=user,ranking=1)[0]
			prono.team = teams[1]
			prono.save()
			
			prono = PronoGroupstageWinners.objects.filter(group=group,user=user,ranking=2)[0]
			prono.team = teams[3]
			prono.save()
		
		# set results
		for group in groups:
			teams = group.teams.all()
			team = teams[0]
			team.groupstage_points = 0
			team.save()
			
			team = teams[1]
			team.groupstage_points = 7.4
			team.save()
			
			team = teams[2]
			team.groupstage_points = 7.3
			team.save()
			
			team = teams[3]
			team.groupstage_points = 9
			team.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_winners')[0]
		self.assertEqual(points.points,4)
		
	def test_prono_groupstage_winners_points_calculation_winner_only(self):
	
		# fill in prono
		user = self.users[1]
		groups = [self.groups[0]]
		
		for group in groups:
			teams = group.teams.all()
		
			prono = PronoGroupstageWinners.objects.filter(group=group,user=user,ranking=1)[0]
			prono.team = teams[1]
			prono.save()
			
			prono = PronoGroupstageWinners.objects.filter(group=group,user=user,ranking=2)[0]
			prono.team = teams[3]
			prono.save()
		
		# set results
		for group in groups:
			teams = group.teams.all()
			team = teams[0]
			team.groupstage_points = 0
			team.save()
			
			team = teams[1]
			team.groupstage_points = 9
			team.save()
			
			team = teams[2]
			team.groupstage_points = 7.3
			team.save()
			
			team = teams[3]
			team.groupstage_points = 7.2
			team.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_winners')[0]
		self.assertEqual(points.points,6)
		
		
	def test_prono_knockoutstage_teams_points_calculation_semifinals_correct(self):
	
		# fill in prono
		user = self.users[1]
		stages = [4]
		
		teams = Team.objects.all()
		
		for stage in stages:
			pronos = PronoKnockoutstageTeams.objects.filter(stage=stage,user=user)
			for i,prono in enumerate(pronos):
				prono.team = teams[i]
				prono.save()

		# set results
		for stage in stages:
			matches = Match.objects.filter(stage=stage)
			
			# add matches if required
			for i in range(int(stage/2)-len(matches)):
				match = Match(stage=stage)
				match.save()
				
			matches = Match.objects.filter(stage=stage)	
			for i,match in enumerate(matches):
				match.team1 = teams[2*i]
				match.team2 = teams[2*i+1]
				match.save()
				
		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='knockoutstage_teams')[0]
		self.assertEqual(points.points,4*28)
		
		
	def test_prono_knockoutstage_teams_points_calculation_winner_correct(self):
	
		# fill in prono
		user = self.users[1]
		
		teams = Team.objects.all()
		
		pronos = PronoKnockoutstageTeams.objects.filter(stage=1,user=user)
		for i,prono in enumerate(pronos):
			prono.team = teams[1]
			prono.save()

		# set results
		match = Match.objects.filter(stage=2)[0]

		match.team1 = teams[1]
		match.team2 = teams[2]
		match.save()
				
		match_result = match.result
		match_result.score1 = 1
		match_result.score2 = 1
		match_result.penalty1 = 6
		match_result.penalty2 = 5
		match_result.save()
		
		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='knockoutstage_teams')[0]
		self.assertEqual(points.points,60)
		
	def test_prono_knockoutstage_teams_points_calculation_winner_incorrect(self):
	
		# fill in prono
		user = self.users[1]
		
		teams = Team.objects.all()
		
		pronos = PronoKnockoutstageTeams.objects.filter(stage=1,user=user)
		for i,prono in enumerate(pronos):
			prono.team = teams[2]
			prono.save()

		# set results
		match = Match.objects.filter(stage=2)[0]

		match.team1 = teams[1]
		match.team2 = teams[2]
		match.save()
				
		match_result = match.result
		match_result.score1 = 1
		match_result.score2 = 1
		match_result.penalty1 = 6
		match_result.penalty2 = 5
		match_result.save()
		
		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='knockoutstage_teams')[0]
		self.assertEqual(points.points,0)
		
		
	def test_prono_total_goals_points_calculation_correct(self):
		# fill in prono
		user = self.users[1]
		
		total_goals = len( Match.objects.all() )*4
		
		prono = PronoTotalGoals.objects.filter(user=user)[0]
		prono.goals = total_goals
		prono.save()
		
		# set results
		for match in Match.objects.all():
			match_result = match.result
			
			match_result.score1 = random.randint(0,4)
			match_result.score2 = 4-match_result.score1
			match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='total_goals')[0]
		self.assertEqual(points.points,100)

	def test_prono_total_goals_points_calculation_incorrect(self):
		# fill in prono
		user = self.users[1]
		
		total_goals = len( Match.objects.all() )*4
		
		prono = PronoTotalGoals.objects.filter(user=user)[0]
		prono.goals = total_goals+8
		prono.save()
		
		# set results
		for match in Match.objects.all():
			match_result = match.result
			
			match_result.score1 = random.randint(0,4)
			match_result.score2 = 4-match_result.score1
			match_result.save()

		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='total_goals')[0]
		self.assertEqual(points.points,100-8*6)
		
	def test_prono_total_goals_points_calculation_less_than_zero(self):
		# fill in prono
		user = self.users[1]
		
		total_goals = len( Match.objects.all() )*4
		
		prono = PronoTotalGoals.objects.filter(user=user)[0]
		prono.goals = total_goals-18
		prono.save()
		
		# set results
		for match in Match.objects.all():
			match_result = match.result
			
			match_result.score1 = random.randint(0,4)
			match_result.score2 = 4-match_result.score1
			match_result.save()


		# calculate points
		response = self.client.post('/calculatepoints/')

		# check the user points
		points = Points.objects.filter(user=user,prono='total_goals')[0]
		self.assertEqual(points.points,0)
	
	def test_team_result_points_calculation_groupstage_correct(self):
		# fill in prono
		user = self.users[1]
		team = self.teams[1]
		
		prono = PronoTeamResult.objects.filter(user=user,team=team)[0]
		prono.result = 0
		prono.save()
		
		# set results
		for match in Match.objects.filter(stage=16):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=8):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=4):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=2):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
			match_result = match.result
			match_result.score1 = 4
			match_result.score2 = 0
			match_result.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')
	
		# check the user points
		points = Points.objects.filter(user=user,prono='team_result')[0]
		self.assertEqual(points.points,5)
		
	def test_team_result_points_calculation_roundof16_correct(self):
		# fill in prono
		user = self.users[1]
		team = self.teams[1]
		
		prono = PronoTeamResult.objects.filter(user=user,team=team)[0]
		prono.result = 16
		prono.save()
		
		# set results
		for match in Match.objects.filter(stage=16):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=8):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=4):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=2):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
			match_result = match.result
			match_result.score1 = 4
			match_result.score2 = 0
			match_result.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')
	
		# check the user points
		points = Points.objects.filter(user=user,prono='team_result')[0]
		self.assertEqual(points.points,10)
		
	def test_team_result_points_calculation_quarterfinal_incorrect(self):
		# fill in prono
		user = self.users[1]
		team = self.teams[1]
		
		prono = PronoTeamResult.objects.filter(user=user,team=team)[0]
		prono.result = 8
		prono.save()
		
		# set results
		for match in Match.objects.filter(stage=16):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=8):
			match.team1 = self.teams[2]
			match.team2 = self.teams[1]
			match.save()
			
		for match in Match.objects.filter(stage=4):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=2):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
			match_result = match.result
			match_result.score1 = 4
			match_result.score2 = 0
			match_result.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')
	
		# check the user points
		points = Points.objects.filter(user=user,prono='team_result')[0]
		self.assertEqual(points.points,0)	
		
	def test_team_result_points_calculation_semifinal_correct(self):
		# fill in prono
		user = self.users[1]
		team = self.teams[1]
		
		prono = PronoTeamResult.objects.filter(user=user,team=team)[0]
		prono.result = 4
		prono.save()
		
		# set results
		for match in Match.objects.filter(stage=16):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=8):
			match.team1 = self.teams[2]
			match.team2 = self.teams[1]
			match.save()
			
		for match in Match.objects.filter(stage=4):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=2):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
			match_result = match.result
			match_result.score1 = 4
			match_result.score2 = 0
			match_result.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')
	
		# check the user points
		points = Points.objects.filter(user=user,prono='team_result')[0]
		self.assertEqual(points.points,50)
		
		
	def test_team_result_points_calculation_final_incorrect(self):
		# fill in prono
		user = self.users[1]
		team = self.teams[1]
		
		prono = PronoTeamResult.objects.filter(user=user,team=team)[0]
		prono.result = 2
		prono.save()
		
		# set results
		for match in Match.objects.filter(stage=16):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=8):
			match.team1 = self.teams[2]
			match.team2 = self.teams[1]
			match.save()
			
		for match in Match.objects.filter(stage=4):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=2):
			match.team1 = self.teams[2]
			match.team2 = self.teams[3]
			match.save()
			
			match_result = match.result
			match_result.score1 = 4
			match_result.score2 = 0
			match_result.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')	

		# check the user points
		points = Points.objects.filter(user=user,prono='team_result')[0]
		self.assertEqual(points.points,0)
		
		
	def test_team_result_points_calculation_winner_correct(self):
		# fill in prono
		user = self.users[1]
		team = self.teams[1]
		
		prono = PronoTeamResult.objects.filter(user=user,team=team)[0]
		prono.result = 1
		prono.save()
		
		# set results
		for match in Match.objects.filter(stage=16):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=8):
			match.team1 = self.teams[2]
			match.team2 = self.teams[1]
			match.save()
			
		for match in Match.objects.filter(stage=4):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
		for match in Match.objects.filter(stage=2):
			match.team1 = self.teams[1]
			match.team2 = self.teams[3]
			match.save()
			
			match_result = match.result
			match_result.score1 = 4
			match_result.score2 = 0
			match_result.save()
			
		# calculate points
		response = self.client.post('/calculatepoints/')
	
		# check the user points
		points = Points.objects.filter(user=user,prono='team_result')[0]
		self.assertEqual(points.points,150)	



