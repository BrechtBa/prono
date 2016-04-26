from rest_framework import status
from rest_framework_jwt.utils import jwt_decode_handler

import json
import datetime
import mock

from ..models import UserProfile,Points,Group,Team,Match,MatchResult,PronoResult
from ..utils import unixtimestamp

from .utils import PronoTest,MockDatetime
	
class APIAccessTests(PronoTest):

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
	
	def test_user_token_stage(self):
		token = self.generate_token(self.usercredentials[1])
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['stage'], 0)
	
	@mock.patch('api.utils.datetime.datetime', MockDatetime)
	def test_user_token_stage_during_groupstage(self):
		MockDatetime.utcnow = classmethod(lambda cls: datetime.datetime(2016,6,11,21))
	
		token = self.generate_token(self.usercredentials[1])
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['stage'], 16)

	def test_user_token_access_exp(self):
		token = self.generate_token(self.usercredentials[1])
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['access_exp'], self.matches[0].date-3600)
		
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
		id = self.users[1].prono_result.all()[0].id
		token = self.generate_token(self.usercredentials[0])
		response = self.client.get('/pronoresults/{}/'.format(id), HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_prono_results_filtered_access_with_token(self):
		id = self.users[1].prono_result.all()[0].id
		token = self.generate_token(self.usercredentials[1])
		response = self.client.get('/pronoresults/user/{}/'.format(id), HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
	def test_wrong_user_prono_results_access_with_token(self):
		token = self.generate_token(self.usercredentials[1])
		response = self.client.get('/pronoresults/1/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)	
		
		
