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
		self.user0 = AuthUser.objects.create_user(username='user0',password='password123')
		self.user0.is_staff = True
		self.user0.save()

		self.user1 = AuthUser.objects.create_user(username='user1',password='password123')
		self.user2 = AuthUser.objects.create_user(username='user2',password='password123')
	

	def tearDown(self):
		self.user0.delete()
		self.user1.delete()
		self.user2.delete()	

	def test_request_token(self):
		
		response = self.client.post('/token-auth/', {'username':'user1', 'password':'password123'})

		self.assertEqual(response.status_code, status.HTTP_200_OK)
	
	def test_request_token_wrong_password(self):
		
		response = self.client.post('/token-auth/', {'username':'user1', 'password':'password12'})

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_refresh_token(self):
		
		response = self.client.post('/token-auth/', {'username':'user1', 'password':'password123'})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		token = responsedata['token']
		
		response = self.client.post('/token-refresh/', {'token':token})
		self.assertEqual(response.status_code, status.HTTP_200_OK)


	def test_user_token_permission(self):

		response = self.client.post('/token-auth/', {'username':'user1', 'password':'password123'})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		
		token = responsedata['token']
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['permission'], 1)

	def test_admin_token_permission(self):

		response = self.client.post('/token-auth/', {'username':'user0', 'password':'password123'})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		
		token = responsedata['token']
		payload = jwt_decode_handler(token)
		self.assertEqual(payload['permission'], 9)


class CompetitionDefinitionTests(TestCase):

	def test_match_result_created_when_match_created(self):
		match = Match()
		match.save()

		result = match.result

		self.assertEqual(result.score1,-1)
		self.assertEqual(result.score2,-1)
