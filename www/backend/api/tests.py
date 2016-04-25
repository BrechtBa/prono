from django.test import TestCase
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework import status
from rest_framework_jwt.utils import jwt_decode_handler

import json

from .models import Match,MatchResult


class JSONWebTokenTests(TestCase):

	def setUp(self):
		# add users
		self.user1 = AuthUser.objects.create_user(username='user1',password='password123')
		self.user1.is_staff = True
		self.user1.save()

		self.user2 = AuthUser.objects.create_user(username='user2',password='password123')
		self.user3 = AuthUser.objects.create_user(username='user3',password='password123')
	

	def tearDown(self):
		self.user1.delete()
		self.user2.delete()
		self.user3.delete()	

	def test_request_token(self):
		
		response = self.client.post('/token-auth/', {'username':'user2', 'password':'password123'})

		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_request_token_wrong_password(self):
		
		response = self.client.post('/token-auth/', {'username':'user2', 'password':'password12'})

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_refresh_token(self):
		
		response = self.client.post('/token-auth/', {'username':'user2', 'password':'password123'})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		token = responsedata['token']
		
		response = self.client.post('/token-refresh/', {'token':token})
		self.assertEqual(response.status_code, status.HTTP_200_OK)


	def test_user_token_permission(self):

		response = self.client.post('/token-auth/', {'username':'user2', 'password':'password123'})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		
		token = responsedata['token']
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['permission'], 1)

	def test_admin_token_permission(self):

		response = self.client.post('/token-auth/', {'username':'user1', 'password':'password123'})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		
		token = responsedata['token']
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['permission'], 9)

	def test_user_access_without_token(self):

		response = self.client.get('/users/')
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
	
	def test_user_access_with_token(self):
		response = self.client.post('/token-auth/', {'username':'user2', 'password':'password123'})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		token = responsedata['token']

		response = self.client.get('/users/3/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		print(response.rendered_content)
		self.assertEqual(response.status_code, status.HTTP_200_OK)



class CompetitionDefinitionTests(TestCase):

	def test_match_result_created_when_match_created(self):
		match = Match()
		match.save()

		result = match.result

		self.assertEqual(result.score1,-1)
		self.assertEqual(result.score2,-1)
