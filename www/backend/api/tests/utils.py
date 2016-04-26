from django.test import TestCase
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework_jwt.utils import jwt_decode_handler

import json
import datetime

from ..models import UserProfile,Points,Group,Team,Match,MatchResult,PronoResult
from ..utils import unixtimestamp


################################################################################
# Mock functions
################################################################################
class MockDatetime(datetime.datetime):
	pass 
	



class PronoTest(TestCase):
	"""
	base class
	"""

	def setUp(self):

		self.usercredentials = [{'username':'user1','password':'password123'},
								{'username':'user2','password':'password123'},
								{'username':'user3','password':'password123'},]


		# add admin user
		self.users = []
		self.users.append( AuthUser.objects.create_user(username=self.usercredentials[0]['username'],password=self.usercredentials[0]['password']) )
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
		self.matches.append( Match.objects.create(team1=self.teams[0],team2=self.teams[1],defaultteam1='A1',defaultteam2='A2',date=unixtimestamp(datetime.datetime(2016,6,11,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[2],team2=self.teams[3],defaultteam1='A3',defaultteam2='A4',date=unixtimestamp(datetime.datetime(2016,6,11,15-2)) ) )
		
		self.matches.append( Match.objects.create(defaultteam1='RA',defaultteam2='RC',stage=16,position=1,date=unixtimestamp(datetime.datetime(2016,6,25,15-2)) ) )
		self.matches.append( Match.objects.create(defaultteam1='W37',defaultteam2='W39',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,6,30,21-2)) ) )
		self.matches.append( Match.objects.create(defaultteam1='W45',defaultteam2='W46',stage=4,position=1,date=unixtimestamp(datetime.datetime(2016,7,6,21-2)) ) )
		self.matches.append( Match.objects.create(defaultteam1='W49',defaultteam2='W50',stage=2,position=1,date=unixtimestamp(datetime.datetime(2016,7,10,21-2)) ) )

		# add users
		for credentials in self.usercredentials[1:]:
			self.users.append( AuthUser.objects.create_user(username=credentials['username'],password=credentials['password']) )
		
		
		
		
	def generate_token(self,credentials):	
		response = self.client.post('/token-auth/', {'username':credentials['username'], 'password':credentials['password']})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		token = responsedata['token']
		return token
	

	def tearDown(self):
		pass

		
		


