from rest_framework import status
from rest_framework_jwt.utils import jwt_decode_handler

import json
import datetime
import mock

from ..models import UserProfile,Points,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult
from ..utils import unixtimestamp

from .utils import PronoTest,MockDatetime
	
class UserCreationTests(PronoTest):

	def test_register_user(self):
		response = self.client.post('/register/', {'username':'test123', 'password':'somepassword'})
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
	
	def test_request_token(self):
		credentials = self.usercredentials[1]
		response = self.client.post('/token-auth/', {'username':credentials['username'], 'password':credentials['password']})
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_prepare_database_for_user(self):
		response = self.client.post('/register/', {'username':'test123', 'password':'somepassword'})
		
		token = self.generate_token({'username':'test123', 'password':'somepassword'})
		
		response = self.client.post('/preparedatabaseforuser/', {}, content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_prepare_database_for_user_status(self):
		response = self.client.post('/register/', {'username':'test123', 'password':'somepassword'})
		
		token = self.generate_token({'username':'test123', 'password':'somepassword'})
		payload = jwt_decode_handler(token)

		response = self.client.post('/preparedatabaseforuser/', {}, HTTP_AUTHORIZATION='JWT {}'.format(token))

		response = self.client.get('/userstatus/?user={}'.format(payload['user_id']), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		
		self.assertEqual(responsedata[0]['databaseprepared'], True)

	def test_change_password(self):
		response = self.client.post('/register/', {'username':'test123', 'password':'somepassword'})
		
		token = self.generate_token({'username':'test123', 'password':'somepassword'})
		payload = jwt_decode_handler(token)
		user_id = payload['user_id']

		response = self.client.put('/changepassword/{}/'.format(user_id), data=json.dumps({'password':'newpassword'}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		response = self.client.post('/token-auth/', {'username':'test123', 'password':'newpassword'})
		self.assertEqual(response.status_code, status.HTTP_200_OK)
	

	def test_change_password_admin(self):
		response = self.client.post('/register/', {'username':'test123', 'password':'somepassword'})
		
		token = self.generate_token({'username':'test123', 'password':'somepassword'})
		payload = jwt_decode_handler(token)
		user_id = payload['user_id']

		token = self.generate_token({'username':'user1', 'password':'password123'})
		payload = jwt_decode_handler(token)

		response = self.client.put('/changepassword/{}/'.format(user_id), data=json.dumps({'password':'newpassword'}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		response = self.client.post('/token-auth/', {'username':'test123', 'password':'newpassword'})
		self.assertEqual(response.status_code, status.HTTP_200_OK)


	def test_change_password_wronguser(self):
		response = self.client.post('/register/', {'username':'test123', 'password':'somepassword'})
		
		token = self.generate_token({'username':'test123', 'password':'somepassword'})
		payload = jwt_decode_handler(token)
		user_id = payload['user_id']

		token = self.generate_token({'username':'user2', 'password':'password123'})
		payload = jwt_decode_handler(token)

		response = self.client.put('/changepassword/{}/'.format(user_id), data=json.dumps({'password':'newpassword'}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

		response = self.client.post('/token-auth/', {'username':'test123', 'password':'somepassword'})
		self.assertEqual(response.status_code, status.HTTP_200_OK)

