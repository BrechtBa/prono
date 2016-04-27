from django.test import TestCase
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework_jwt.utils import jwt_decode_handler

import json
import datetime
import random

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

		
		
class EC2016Test(TestCase):
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
		self.groups.append( Group.objects.create(name='B') )
		self.groups.append( Group.objects.create(name='C') )
		self.groups.append( Group.objects.create(name='D') )
		self.groups.append( Group.objects.create(name='E') )
		self.groups.append( Group.objects.create(name='F') )
		
		# add teams
		self.teams = []
		self.teams.append( Team.objects.create(name='Frankrijk',abr='FRA',iso_icon='FR',group=self.groups[0]) )
		self.teams.append( Team.objects.create(name='Roemenie',abr='ROU',iso_icon='RO',group=self.groups[0]) )
		self.teams.append( Team.objects.create(name='Albanie',abr='ALB',iso_icon='AL',group=self.groups[0]) )
		self.teams.append( Team.objects.create(name='Zwitserland',abr='SUI',iso_icon='CH',group=self.groups[0]) )
		
		self.teams.append( Team.objects.create(name='Wales',abr='FRA',iso_icon='FR',group=self.groups[1]) )
		self.teams.append( Team.objects.create(name='Slovakije',abr='ROU',iso_icon='RO',group=self.groups[1]) )
		self.teams.append( Team.objects.create(name='Engeland',abr='ALB',iso_icon='AL',group=self.groups[1]) )
		self.teams.append( Team.objects.create(name='Rusland',abr='SUI',iso_icon='CH',group=self.groups[1]) )
		
		self.teams.append( Team.objects.create(name='Turkije',abr='FRA',iso_icon='FR',group=self.groups[2]) )
		self.teams.append( Team.objects.create(name='Kroatie',abr='ROU',iso_icon='RO',group=self.groups[2]) )
		self.teams.append( Team.objects.create(name='Polen',abr='ALB',iso_icon='AL',group=self.groups[2]) )
		self.teams.append( Team.objects.create(name='Noord-Ierland',abr='SUI',iso_icon='CH',group=self.groups[2]) )
		
		self.teams.append( Team.objects.create(name='Duitsland',abr='FRA',iso_icon='FR',group=self.groups[3]) )
		self.teams.append( Team.objects.create(name='Oekraine',abr='ROU',iso_icon='RO',group=self.groups[3]) )
		self.teams.append( Team.objects.create(name='Spanje',abr='ALB',iso_icon='AL',group=self.groups[3]) )
		self.teams.append( Team.objects.create(name='Chechie',abr='SUI',iso_icon='CH',group=self.groups[3]) )
		
		self.teams.append( Team.objects.create(name='Ierland',abr='FRA',iso_icon='FR',group=self.groups[4]) )
		self.teams.append( Team.objects.create(name='Zweden',abr='ROU',iso_icon='RO',group=self.groups[4]) )
		self.teams.append( Team.objects.create(name='Belgie',abr='ALB',iso_icon='AL',group=self.groups[4]) )
		self.teams.append( Team.objects.create(name='Italie',abr='SUI',iso_icon='CH',group=self.groups[4]) )
		
		self.teams.append( Team.objects.create(name='Oostenrijk',abr='FRA',iso_icon='FR',group=self.groups[5]) )
		self.teams.append( Team.objects.create(name='Hongarije',abr='ROU',iso_icon='RO',group=self.groups[5]) )
		self.teams.append( Team.objects.create(name='Portugal',abr='ALB',iso_icon='AL',group=self.groups[5]) )
		self.teams.append( Team.objects.create(name='Ijsland',abr='SUI',iso_icon='CH',group=self.groups[5]) )
		
		self.team_dict = {}
		for i,group in enumerate(self.groups):
			for j in range(4):
				self.team_dict['{}{}'.format(group.name,j+1)] = self.teams[i*4+j]
		
		# add matches
		self.matches = []
		# groupstage
		self.matches.append( Match.objects.create(team1=self.teams[0],team2=self.teams[1],defaultteam1='A1',defaultteam2='A2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,11,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[2],team2=self.teams[3],defaultteam1='A3',defaultteam2='A4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,11,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[4],team2=self.teams[5],defaultteam1='B1',defaultteam2='B2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,11,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[6],team2=self.teams[7],defaultteam1='B3',defaultteam2='B4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,11,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[8],team2=self.teams[9],defaultteam1='C1',defaultteam2='C2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,12,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[10],team2=self.teams[11],defaultteam1='C3',defaultteam2='C4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,12,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[12],team2=self.teams[13],defaultteam1='D1',defaultteam2='D2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,12,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[14],team2=self.teams[15],defaultteam1='D3',defaultteam2='D4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,13,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[16],team2=self.teams[17],defaultteam1='E1',defaultteam2='E2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,13,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[18],team2=self.teams[19],defaultteam1='E3',defaultteam2='E4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,13,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[20],team2=self.teams[21],defaultteam1='F1',defaultteam2='F2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,14,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.teams[22],team2=self.teams[23],defaultteam1='F3',defaultteam2='F4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,14,21-2)) ) )
		
		self.matches.append( Match.objects.create(team1=self.team_dict['B2'],team2=self.team_dict['B4'],defaultteam1='B2',defaultteam2='B4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,15,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['A2'],team2=self.team_dict['A4'],defaultteam1='A2',defaultteam2='A4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,15,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['A1'],team2=self.team_dict['A3'],defaultteam1='A1',defaultteam2='A3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,15,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['B1'],team2=self.team_dict['B3'],defaultteam1='B1',defaultteam2='B3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,16,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['C2'],team2=self.team_dict['C4'],defaultteam1='C2',defaultteam2='C4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,16,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['C1'],team2=self.team_dict['C3'],defaultteam1='C1',defaultteam2='C3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,16,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['E2'],team2=self.team_dict['E4'],defaultteam1='E2',defaultteam2='E4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,17,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['D2'],team2=self.team_dict['D4'],defaultteam1='D2',defaultteam2='D4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,17,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['D1'],team2=self.team_dict['D3'],defaultteam1='D1',defaultteam2='D3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,17,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['E1'],team2=self.team_dict['E3'],defaultteam1='E1',defaultteam2='E3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,18,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['F2'],team2=self.team_dict['F4'],defaultteam1='F2',defaultteam2='F4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,18,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['F1'],team2=self.team_dict['F3'],defaultteam1='F1',defaultteam2='F3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,18,21-2)) ) )
		
		self.matches.append( Match.objects.create(team1=self.team_dict['A2'],team2=self.team_dict['A3'],defaultteam1='A2',defaultteam2='A3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,19,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['A4'],team2=self.team_dict['A1'],defaultteam1='A4',defaultteam2='A1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,19,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['B2'],team2=self.team_dict['B3'],defaultteam1='B2',defaultteam2='B3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,19,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['B4'],team2=self.team_dict['B1'],defaultteam1='B4',defaultteam2='B1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,19,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['C2'],team2=self.team_dict['C3'],defaultteam1='C2',defaultteam2='C3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,20,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['C4'],team2=self.team_dict['C1'],defaultteam1='C4',defaultteam2='C1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,20,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['D2'],team2=self.team_dict['D3'],defaultteam1='D2',defaultteam2='D3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,20,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['D4'],team2=self.team_dict['D1'],defaultteam1='D4',defaultteam2='D1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,20,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['E2'],team2=self.team_dict['E3'],defaultteam1='E2',defaultteam2='E3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,21,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['E4'],team2=self.team_dict['E1'],defaultteam1='E4',defaultteam2='E1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,21,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['F2'],team2=self.team_dict['F3'],defaultteam1='F2',defaultteam2='F3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,21,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['F4'],team2=self.team_dict['F1'],defaultteam1='F4',defaultteam2='F1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,21,21-2)) ) )
		
		# round of 16 random
		self.matches.append( Match.objects.create(team1=self.team_dict['A2'],team2=self.team_dict['C2'],defaultteam1='RA',defaultteam2='RC',stage=16,position=1,date=unixtimestamp(datetime.datetime(2016,6,25,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['B1'],team2=self.team_dict['A3'],defaultteam1='WB',defaultteam2='3ACD',stage=16,position=2,date=unixtimestamp(datetime.datetime(2016,6,25,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['D1'],team2=self.team_dict['B3'],defaultteam1='WD',defaultteam2='3BEF',stage=16,position=3,date=unixtimestamp(datetime.datetime(2016,6,25,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['A1'],team2=self.team_dict['D3'],defaultteam1='WA',defaultteam2='3CDE',stage=16,position=4,date=unixtimestamp(datetime.datetime(2016,6,26,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['C1'],team2=self.team_dict['F3'],defaultteam1='WC',defaultteam2='3ABF',stage=16,position=5,date=unixtimestamp(datetime.datetime(2016,6,26,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['F1'],team2=self.team_dict['E2'],defaultteam1='WF',defaultteam2='RE',stage=16,position=6,date=unixtimestamp(datetime.datetime(2016,6,26,15-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['E1'],team2=self.team_dict['D2'],defaultteam1='WE',defaultteam2='RD',stage=16,position=7,date=unixtimestamp(datetime.datetime(2016,6,27,18-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['B2'],team2=self.team_dict['F2'],defaultteam1='RB',defaultteam2='RF',stage=16,position=8,date=unixtimestamp(datetime.datetime(2016,6,27,21-2)) ) )
		
		# quarterfinal random
		self.matches.append( Match.objects.create(team1=self.team_dict['A2'],team2=self.team_dict['D1'],defaultteam1='W37',defaultteam2='W39',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,6,30,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['B1'],team2=self.team_dict['E2'],defaultteam1='W38',defaultteam2='W42',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,6,30,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['F3'],team2=self.team_dict['E1'],defaultteam1='W41',defaultteam2='W43',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,6,30,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['D3'],team2=self.team_dict['B2'],defaultteam1='W40',defaultteam2='W44',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,6,30,21-2)) ) )
		
		# semi final random
		self.matches.append( Match.objects.create(team1=self.team_dict['D1'],team2=self.team_dict['E2'],defaultteam1='W45',defaultteam2='W46',stage=4,position=1,date=unixtimestamp(datetime.datetime(2016,7,6,21-2)) ) )
		self.matches.append( Match.objects.create(team1=self.team_dict['F3'],team2=self.team_dict['B2'],defaultteam1='W47',defaultteam2='W48',stage=4,position=1,date=unixtimestamp(datetime.datetime(2016,7,6,21-2)) ) )
		
		# final random
		self.matches.append( Match.objects.create(team1=self.team_dict['D1'],team2=self.team_dict['F3'],defaultteam1='W49',defaultteam2='W50',stage=2,position=1,date=unixtimestamp(datetime.datetime(2016,7,10,21-2)) ) )

		# add users
		for credentials in self.usercredentials[1:]:
			self.users.append( AuthUser.objects.create_user(username=credentials['username'],password=credentials['password']) )
		
	def add_scores_constant():
		for match in Match.objects.all():
			match_result = match.result
			match_result.score1 = 3
			match_result.score2 = 1
			match_result.save()
			
	def add_scores_random():
		for match in Match.objects.all():
			match_result = match.result
			match_result.score1 = random.randint(0,5)
			match_result.score2 = random.randint(0,5)
			if match_result.score1 == match_result.score2:
				if random.random()>0.5:
					match_result.penalty1 = 5
					match_result.penalty2 = random.randint(0,4)
				else:
					match_result.penalty2 = 5
					match_result.penalty1 = random.randint(0,4)
		
		
	def generate_token(self,credentials):	
		response = self.client.post('/token-auth/', {'username':credentials['username'], 'password':credentials['password']})
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		token = responsedata['token']
		return token
	

	def tearDown(self):
		pass



