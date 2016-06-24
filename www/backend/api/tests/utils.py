from django.test import TestCase
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework_jwt.utils import jwt_decode_handler

import json
import datetime
import random
import time

from ..models import UserProfile,Points,Group,Team,Match,MatchResult,PronoResult
from ..models import prepare_database_for_user
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
        self.matches.append( Match.objects.create(team1=self.teams[2],team2=self.teams[3],defaultteam1='A3',defaultteam2='A4',date=unixtimestamp(datetime.datetime(2016,6,12,15-2)) ) )
        
        self.matches.append( Match.objects.create(defaultteam1='RA',defaultteam2='RC',stage=16,position=1,date=unixtimestamp(datetime.datetime(2016,6,25,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='W37',defaultteam2='W39',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,6,30,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='W45',defaultteam2='W46',stage=4,position=1,date=unixtimestamp(datetime.datetime(2016,7,6,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='W49',defaultteam2='W50',stage=2,position=1,date=unixtimestamp(datetime.datetime(2016,7,10,21-2)) ) )

        # define dates
        self.dates = {}
        self.dates['before_first_match'] = datetime.datetime(2016,6,10,21)
        self.dates['after_first_match'] = datetime.datetime(2016,6,11,21)

        # add users
        for credentials in self.usercredentials[1:]:
            self.users.append( AuthUser.objects.create_user(username=credentials['username'],password=credentials['password']) )
        
        # prepare the database for the users
        for user in AuthUser.objects.all():
            prepare_database_for_user(user)
        
        
    def generate_token(self,credentials):    
        response = self.client.post('/token-auth/', {'username':credentials['username'], 'password':credentials['password']})
        responsedata = json.loads(response.rendered_content.decode('utf-8'))
        token = responsedata['token']
        return token
    
    def tearDown(self):
        pass

        
        
class EC2016Test(PronoTest):
    """
    base class
    """

    def setUp(self):

        self.usercredentials = [{'username':'user1','password':'password123'},]

        # add admin user
        self.users = []
        self.users.append( AuthUser.objects.create_user(username=self.usercredentials[0]['username'],password=self.usercredentials[0]['password']) )
        self.users[0].is_staff = True
        self.users[0].save()


        #print(' ')
        #print('-'*70)
        time1 = time.time()
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
        self.matchdata = []

        # groupstage day 1
        self.matches.append( Match.objects.create(defaultteam1='A1',defaultteam2='A2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,10,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='A3',defaultteam2='A4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,11,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='B1',defaultteam2='B2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,11,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='B3',defaultteam2='B4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,11,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='C1',defaultteam2='C2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,12,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='C3',defaultteam2='C4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,12,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='D1',defaultteam2='D2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,12,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='D3',defaultteam2='D4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,13,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='E1',defaultteam2='E2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,13,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='E3',defaultteam2='E4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,13,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='F1',defaultteam2='F2', stage=0,date=unixtimestamp(datetime.datetime(2016,6,14,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='F3',defaultteam2='F4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,14,21-2)) ) )
        
        self.matchdata.append({'team1':self.team_dict['A1'], 'team2':self.team_dict['A2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['A3'], 'team2':self.team_dict['A4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['B1'], 'team2':self.team_dict['B2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['B3'], 'team2':self.team_dict['B4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['C1'], 'team2':self.team_dict['C2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['C3'], 'team2':self.team_dict['C4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['D1'], 'team2':self.team_dict['D2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['D3'], 'team2':self.team_dict['D4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['E1'], 'team2':self.team_dict['E2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['E3'], 'team2':self.team_dict['E4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F1'], 'team2':self.team_dict['F2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F3'], 'team2':self.team_dict['F4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )

        # groupstage day 2
        self.matches.append( Match.objects.create(defaultteam1='B2',defaultteam2='B4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,15,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='A2',defaultteam2='A4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,15,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='A1',defaultteam2='A3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,15,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='B1',defaultteam2='B3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,16,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='C2',defaultteam2='C4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,16,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='C1',defaultteam2='C3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,16,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='E2',defaultteam2='E4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,17,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='D2',defaultteam2='D4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,17,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='D1',defaultteam2='D3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,17,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='E1',defaultteam2='E3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,18,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='F2',defaultteam2='F4', stage=0,date=unixtimestamp(datetime.datetime(2016,6,18,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='F1',defaultteam2='F3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,18,21-2)) ) )

        self.matchdata.append({'team1':self.team_dict['B2'], 'team2':self.team_dict['B4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['A2'], 'team2':self.team_dict['A4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['A1'], 'team2':self.team_dict['A3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['B1'], 'team2':self.team_dict['B3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['C2'], 'team2':self.team_dict['C4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['C1'], 'team2':self.team_dict['C3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['E2'], 'team2':self.team_dict['E4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['D2'], 'team2':self.team_dict['D4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['D1'], 'team2':self.team_dict['D3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['E1'], 'team2':self.team_dict['E3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F2'], 'team2':self.team_dict['F4'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F1'], 'team2':self.team_dict['F3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )

        # groupstage day 3
        self.matches.append( Match.objects.create(defaultteam1='A2',defaultteam2='A3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,19,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='A4',defaultteam2='A1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,19,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='B2',defaultteam2='B3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,19,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='B4',defaultteam2='B1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,19,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='C2',defaultteam2='C3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,20,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='C4',defaultteam2='C1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,20,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='D2',defaultteam2='D3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,20,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='D4',defaultteam2='D1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,20,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='E2',defaultteam2='E3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,21,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='E4',defaultteam2='E1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,21,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='F2',defaultteam2='F3', stage=0,date=unixtimestamp(datetime.datetime(2016,6,21,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='F4',defaultteam2='F1', stage=0,date=unixtimestamp(datetime.datetime(2016,6,21,21-2)) ) )
        
        self.matchdata.append({'team1':self.team_dict['A2'], 'team2':self.team_dict['A3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['A4'], 'team2':self.team_dict['A1'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['B2'], 'team2':self.team_dict['B3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['B4'], 'team2':self.team_dict['B1'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['C2'], 'team2':self.team_dict['C3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['C4'], 'team2':self.team_dict['C1'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['D2'], 'team2':self.team_dict['D3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['D4'], 'team2':self.team_dict['D1'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['E2'], 'team2':self.team_dict['E3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['E4'], 'team2':self.team_dict['E1'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F2'], 'team2':self.team_dict['F3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F4'], 'team2':self.team_dict['F1'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )


        # round of 16
        self.matches.append( Match.objects.create(defaultteam1='RA',defaultteam2='RC',stage=16,position=1,date=unixtimestamp(datetime.datetime(2016,6,25,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='WB',defaultteam2='3ACD',stage=16,position=2,date=unixtimestamp(datetime.datetime(2016,6,25,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='WD',defaultteam2='3BEF',stage=16,position=3,date=unixtimestamp(datetime.datetime(2016,6,25,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='WA',defaultteam2='3CDE',stage=16,position=4,date=unixtimestamp(datetime.datetime(2016,6,26,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='WC',defaultteam2='3ABF',stage=16,position=5,date=unixtimestamp(datetime.datetime(2016,6,26,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='WF',defaultteam2='RE',stage=16,position=6,date=unixtimestamp(datetime.datetime(2016,6,26,15-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='WE',defaultteam2='RD',stage=16,position=7,date=unixtimestamp(datetime.datetime(2016,6,27,18-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='RB',defaultteam2='RF',stage=16,position=8,date=unixtimestamp(datetime.datetime(2016,6,27,21-2)) ) )
        
        self.matchdata.append({'team1':self.team_dict['A2'], 'team2':self.team_dict['C2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['B1'], 'team2':self.team_dict['A3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['D1'], 'team2':self.team_dict['B3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['A1'], 'team2':self.team_dict['D3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['C1'], 'team2':self.team_dict['F3'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F1'], 'team2':self.team_dict['E2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['E1'], 'team2':self.team_dict['D2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['B2'], 'team2':self.team_dict['F2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )

        # quarterfinal
        self.matches.append( Match.objects.create(defaultteam1='W37',defaultteam2='W39',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,6,30,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='W38',defaultteam2='W42',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,7,1,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='W41',defaultteam2='W43',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,7,2,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='W40',defaultteam2='W44',stage=8,position=1,date=unixtimestamp(datetime.datetime(2016,7,3,21-2)) ) )
        
        self.matchdata.append({'team1':self.team_dict['A2'], 'team2':self.team_dict['D1'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['B1'], 'team2':self.team_dict['E2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F3'], 'team2':self.team_dict['E1'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['D3'], 'team2':self.team_dict['B2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )

        # semi final
        self.matches.append( Match.objects.create(defaultteam1='W45',defaultteam2='W46',stage=4,position=1,date=unixtimestamp(datetime.datetime(2016,7,6,21-2)) ) )
        self.matches.append( Match.objects.create(defaultteam1='W47',defaultteam2='W48',stage=4,position=1,date=unixtimestamp(datetime.datetime(2016,7,7,21-2)) ) )
        
        self.matchdata.append({'team1':self.team_dict['D1'], 'team2':self.team_dict['E2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )
        self.matchdata.append({'team1':self.team_dict['F3'], 'team2':self.team_dict['B2'], 'score1':random.randint(0,4), 'score2':random.randint(0,4)} )

        # final
        self.matches.append( Match.objects.create(defaultteam1='W49',defaultteam2='W50',stage=2,position=1,date=unixtimestamp(datetime.datetime(2016,7,10,21-2)) ) )
        
        self.matchdata.append({'team1':self.team_dict['D1'], 'team2':self.team_dict['F3'], 'score1':3, 'score2':2} )



        self.groupwinners = {
            1:{1:self.team_dict['A1'],2:self.team_dict['A2']},
            2:{1:self.team_dict['B1'],2:self.team_dict['B2']},
            3:{1:self.team_dict['C1'],2:self.team_dict['C2']},
            4:{1:self.team_dict['D1'],2:self.team_dict['D2']},
            5:{1:self.team_dict['E1'],2:self.team_dict['E2']},
            6:{1:self.team_dict['F1'],2:self.team_dict['F2']}
        }
        self.teampoints = {
            self.team_dict['A1'].id:9,self.team_dict['A2'].id:6,self.team_dict['A3'].id:1.1,self.team_dict['A4'].id:1,
            self.team_dict['B1'].id:9,self.team_dict['B2'].id:6,self.team_dict['B3'].id:1.1,self.team_dict['B4'].id:1,
            self.team_dict['C1'].id:9,self.team_dict['C2'].id:6,self.team_dict['C3'].id:1.1,self.team_dict['C4'].id:1,
            self.team_dict['D1'].id:9,self.team_dict['D2'].id:6,self.team_dict['D3'].id:1.1,self.team_dict['D4'].id:1,
            self.team_dict['E1'].id:9,self.team_dict['E2'].id:6,self.team_dict['E3'].id:1.1,self.team_dict['E4'].id:1,
            self.team_dict['F1'].id:9,self.team_dict['F2'].id:6,self.team_dict['F3'].id:1.1,self.team_dict['F4'].id:1
        }

        self.knockoutstageteams = {
            8:[self.team_dict['A2'],self.team_dict['D1'],self.team_dict['B1'],self.team_dict['E2'],self.team_dict['F3'],self.team_dict['E1'],self.team_dict['D3'],self.team_dict['B2']],
            4:[self.team_dict['D1'],self.team_dict['E2'],self.team_dict['F3'],self.team_dict['B2']],
            2:[self.team_dict['D1'],self.team_dict['F3']],
            1:[self.team_dict['D1']]
        }

        self.total_goals = sum([m['score1']+m['score2'] for m in self.matchdata])



        time2 = time.time()
        #print('EC2016 created in         {:>5.2f}s'.format(time2-time1))

        # define dates
        self.dates = {}
        self.dates['before_stage_0'] = datetime.datetime(2016,6,10,21-4)
        self.dates['before_stage_16'] = datetime.datetime(2016,6,25,15-4)
        self.dates['before_stage_8'] = datetime.datetime(2016,6,30,21-4)
        self.dates['before_stage_4'] = datetime.datetime(2016,7,6,21-4)
        self.dates['before_stage_2'] = datetime.datetime(2016,7,10,21-4)
        self.dates['finished'] = datetime.datetime(2016,7,11,0)

    def set_stage_matches(self,stage):
        for i,match in enumerate(Match.objects.all()):
            if match.stage == stage:
                match.team1 = self.matchdata[i]['team1']
                match.team2 = self.matchdata[i]['team2']
                match.save()

    def add_scores_constant(self):
        for match in Match.objects.all():
            match_result = match.result
            match_result.score1 = 3
            match_result.score2 = 1
            match_result.save()
            
    def add_scores_random(self):
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
        



