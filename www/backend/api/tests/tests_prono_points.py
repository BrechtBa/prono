from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup

import json
import mock

from ..models import UserProfile,Points,Group,Team,Match,MatchResult,PronoResult

from .utils import PronoTest,MockDatetime
		
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

		matches = Match.objects.filter(stage=0)
		# check the user points
		points = Points.objects.filter(user=self.users[1],prono='groupstage_result')[0]
		self.assertEqual(points.points,3*len(matches))	
	
		
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
	

	def test_prono_knockoutstage_result_points_calculation_all_matches_correct(self):
	
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
			match_result.score1 = 4
			match_result.score2 = 2
			match_result.save()

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

		# check the user points
		points = Points.objects.filter(user=user,prono='knockoutstage_score')[0]
		self.assertEqual(points.points,8*len(matches))

