from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup

import mock

from ..models import UserProfile,Points,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult

from .utils import PronoTest,MockDatetime
		
class PronoCreationTests(PronoTest):

	def test_prono_results_created_when_match_created(self):
		match = Match()
		match.save()

		results = match.prono_result.all()
		results_users = []
		for result in results:
			results_users.append( result.user )
			
		for user in AuthUser.objects.all():
			self.assertIn(user,results_users)
		
	def test_prono_results_created_when_user_created(self):
		user = AuthUser.objects.create_user(username='abc',password='password123')

		token = self.generate_token({'username':'abc', 'password':'password123'})
		response = self.client.post('/preparedatabaseforuser/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		
		results = user.prono_result.all()
		results_matches = []
		for result in results:
			results_matches.append( result.match )
			
		for match in Match.objects.all():
			self.assertIn(match,results_matches)
			
	def test_prono_results_unchanged_when_user_changes(self):
		score1 = 5
		score2 = 0
		prono_result = PronoResult.objects.all()[1]
		prono_result.score1 = score1
		prono_result.score2 = score2
		prono_result.save()
		
		# change the user
		user = prono_result.user
		user.password='test123'
		user.save()
		
		# check if the prono is unchanged
		prono_result_new = PronoResult.objects.all()[1]
		self.assertEqual(score1,prono_result_new.score1)
		self.assertEqual(score2,prono_result_new.score2)	
		


	def test_prono_groupstage_winners_created_when_user_created(self):
		user = AuthUser.objects.create_user(username='abc',password='password123')

		token = self.generate_token({'username':'abc', 'password':'password123'})
		response = self.client.post('/preparedatabaseforuser/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		
		for group in Group.objects.all():
			results = user.prono_groupstage_winners.filter(group=group,ranking=1)
			self.assertEqual(len(results),1)

			results = user.prono_groupstage_winners.filter(group=group,ranking=2)
			self.assertEqual(len(results),1)

	def test_prono_groupstage_winners_created_when_group_created(self):
		group = Group(name='J')
		group.save()

		for user in AuthUser.objects.all():
			results = user.prono_groupstage_winners.filter(group=group,ranking=1)
			self.assertEqual(len(results),1)

			results = user.prono_groupstage_winners.filter(group=group,ranking=2)
			self.assertEqual(len(results),1)

	def test_prono_knockoutstage_teams_created_when_user_created(self):
		user = AuthUser.objects.create_user(username='abc',password='password123')
		
		token = self.generate_token({'username':'abc', 'password':'password123'})
		response = self.client.post('/preparedatabaseforuser/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		
		results = user.prono_knockoutstage_teams.filter(stage=8)
		self.assertEqual(len(results),8)

		results = user.prono_knockoutstage_teams.filter(stage=4)
		self.assertEqual(len(results),4)

		results = user.prono_knockoutstage_teams.filter(stage=2)
		self.assertEqual(len(results),2)

		results = user.prono_knockoutstage_teams.filter(stage=1)
		self.assertEqual(len(results),1)


	def test_prono_knockoutstage_teams_created_when_match_created(self):
		match = Match(stage=32)
		match.save()
		# by creating this match the round of 16 will no longer be the stage
		# after the groupstage and will get a knockoutstage_teams prono

		for user in AuthUser.objects.all():
			results = user.prono_knockoutstage_teams.filter(stage=16)

			self.assertEqual(len(results),16)


	def test_prono_total_goals_created_when_user_created(self):
		user = AuthUser.objects.create_user(username='abc',password='password123')

		token = self.generate_token({'username':'abc', 'password':'password123'})
		response = self.client.post('/preparedatabaseforuser/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		
		results = user.prono_total_goals.all()
		self.assertEqual(len(results),1)

		
	def test_prono_team_result_created_when_user_created(self):
		user = AuthUser.objects.create_user(username='abc',password='password123')
		
		token = self.generate_token({'username':'abc', 'password':'password123'})
		response = self.client.post('/preparedatabaseforuser/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		
		teams = Team.objects.all()
		
		results = user.prono_team_result.all()
		self.assertEqual(len(results),len(teams))
		
	def test_prono_team_result_created_when_team_created(self):
		team = Team()
		team.save()

		for user in AuthUser.objects.all():
			results = user.prono_team_result.filter(team=team)

			self.assertEqual(len(results),1)



