from django.test import TestCase
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework import status
from rest_framework_jwt.utils import jwt_decode_handler

import json

from .models import UserProfile,Points,Group,Team,Match,MatchResult,PronoResult







class PronoTest(TestCase):
	"""
	base class
	"""

	def setUp(self):
		# add users
		self.usercredentials = [{'username':'user1','password':'password123'},
								{'username':'user2','password':'password123'},
								{'username':'user3','password':'password123'},]
		
		self.users = []
		for credentials in self.usercredentials:
			self.users.append( AuthUser.objects.create_user(username=credentials['username'],password=credentials['password']) )
		
		# create an admin user
		self.users[0].is_staff = True
		self.users[0].save()
	
	
		# add groups
		self.groups = []
		self.groups.append( Group.objects.create(name='A') )
		
		# add teams
		self.teams = []
		self.teams.append( Team.objects.create(name='Frankrijk',abr='FRA',iso_icon='FR',group=self.groups[0]) )
		self.teams.append( Team.objects.create(name='Roemenie',abr='ROU',iso_icon='RO',group=self.groups[0]) )
		self.teams.append( Team.objects.create(name='Albanie',abr='ALB',iso_icon='AL',group=self.groups[0]) )
		self.teams.append( Team.objects.create(name='Zwitserland',abr='SUI',iso_icon='CH',group=self.groups[0]) )
		
		# add matches
		self.matches = []
		self.matches.append( Match.objects.create(team1=self.teams[0],team2=self.teams[1],defaultteam1='A1',defaultteam2='A2') )
		self.matches.append( Match.objects.create(team1=self.teams[2],team2=self.teams[3],defaultteam1='A3',defaultteam2='A4') )
		
	def generate_token(self,credentials):	
		response = self.client.post('/token-auth/', {'username':credentials['username'], 'password':credentials['password']})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		token = responsedata['token']
		return token
	
	def tearDown(self):
		pass

		
		

class CompetitionCreationTests(PronoTest):

	def test_match_result_created_when_match_created(self):
		match = Match()
		match.save()

		result = match.result

		self.assertEqual(result.score1,-1)
		self.assertEqual(result.score2,-1)

		
		
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
		
		
class PronoPointsTests(PronoTest):
	
	def test_prono_groupstage_result_points_calculation_correct(self):
	
		# fill in prono for a match for a user
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

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,3)
		
		
	def test_prono_groupstage_result_points_calculation_correct_tie(self):
	
		# fill in prono for a match for a user
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

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,3)	
			
			
	def test_prono_groupstage_result_points_calculation_all_matches_correct(self):
	
		# fill in prono for a match for a user
		user = AuthUser.objects.all()[1]
		
		matches =  Match.objects.all()

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

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,3*len(matches))
		
		
	def test_prono_groupstage_result_points_calculation_all_matches_correct_api(self):
		
		token = self.generate_token(self.usercredentials[1])
		# get all prono results of the user
		response = self.client.get('/pronoresults/user/2/', HTTP_AUTHORIZATION='JWT {}'.format(token))
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

		# check the user points
		points = Points.objects.filter(user=self.users[1],prono='groupstage_result')[0]
		self.assertEqual(points.points,3*len(responsedata))	
	
		
	def test_prono_groupstage_result_points_calculation_incorrect(self):
	
		# fill in prono for a match for a user
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

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_result')[0]
		self.assertEqual(points.points,0)	

		
	def test_prono_groupstage_score_points_calculation_correct(self):
	
		# fill in prono for a match for a user
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

		# check the user points
		points = Points.objects.filter(user=user,prono='groupstage_score')[0]
		self.assertEqual(points.points,4)
	
	
class AccessTests(PronoTest):

	def test_request_token(self):
		credentials = self.usercredentials[1]
		response = self.client.post('/token-auth/', {'username':credentials['username'], 'password':credentials['password']})
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_request_token_wrong_password(self):
		credentials = self.usercredentials[1]
		response = self.client.post('/token-auth/', {'username':credentials['username'], 'password':'notcorrect'})
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_refresh_token(self):
		token = self.generate_token(self.usercredentials[1])
		response = self.client.post('/token-refresh/', {'token':token})
		self.assertEqual(response.status_code, status.HTTP_200_OK)


	def test_user_token_permission(self):
		token = self.generate_token(self.usercredentials[1])
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['permission'], 1)

	def test_admin_token_permission(self):
		token = self.generate_token(self.usercredentials[0])
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['permission'], 9)

	def test_user_detail_access_without_token(self):
		response = self.client.get('/users/2/')
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
	
	def test_user_detail_access_with_token(self):
		token = self.generate_token(self.usercredentials[1])

		response = self.client.get('/users/2/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		
	def test_groups_access_without_token(self):
		response = self.client.get('/groups/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_groups_detail_access_without_token(self):
		response = self.client.get('/groups/1/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
		
	def test_teams_access_without_token(self):
		response = self.client.get('/teams/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_teams_detail_access_without_token(self):
		response = self.client.get('/teams/1/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
		
	def test_matches_access_without_token(self):
		response = self.client.get('/matches/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_matches_detail_access_without_token(self):
		response = self.client.get('/matches/1/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
		
	def test_match_results_access_without_token(self):
		response = self.client.get('/matchresults/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_match_results_detail_access_without_token(self):
		response = self.client.get('/matchresults/1/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_match_results_detail_post_with_token(self):
		token = self.generate_token(self.usercredentials[0])
		response = self.client.put('/matchresults/1/', data=json.dumps({'score1':3, 'score2':2}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)	
		
	def test_prono_results_access_without_token(self):
		response = self.client.get('/pronoresults/')
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
			
	def test_prono_results_detail_access_without_token(self):
		response = self.client.get('/pronoresults/1/')
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
		
	def test_user_prono_results_access_with_token(self):
		token = self.generate_token(self.usercredentials[1])
		response = self.client.get('/pronoresults/2/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_prono_results_filtered_access_with_token(self):
		token = self.generate_token(self.usercredentials[1])
		response = self.client.get('/pronoresults/user/2/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
		
	def test_wrong_user_prono_results_access_with_token(self):
		token = self.generate_token(self.usercredentials[1])
		response = self.client.get('/pronoresults/1/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)	
		
		