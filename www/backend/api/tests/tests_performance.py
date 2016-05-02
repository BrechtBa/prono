from rest_framework import status

from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup

import json
import datetime
import mock
import time

from ..models import UserProfile,Points,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult

from .utils import PronoTest,EC2016Test,MockDatetime



class PerformanceTests(EC2016Test):

	def test_create_users(self):

		numusers = 50

		time1 = time.time()
		for i in range(numusers):
			response = self.client.post('/register/', {'username':'testuser{}'.format(i+1), 'password':'somepassword'})
			self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		time2 = time.time()
		print('{} users created in       {:>5.2f}s'.format(numusers,time2-time1))


	def test_enter_prono(self):
		
		numusers = 50
		time1 = time.time()
		for i in range(numusers):
			response = self.client.post('/register/', {'username':'testuser{}'.format(i+1), 'password':'somepassword'})
			self.assertEqual(response.status_code, status.HTTP_201_CREATED)

		time2 = time.time()
		print('{} users created in       {:>5.2f}s'.format(numusers,time2-time1))


		time1 = time.time()
		for user in AuthUser.objects.filter(is_staff=False):
			
			token = self.generate_token({'username':'{}'.format(user.username), 'password':'somepassword'})

			# set all prono results of the user
			response = self.client.get('/pronoresults/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
			responsedata = json.loads(response.rendered_content.decode('utf-8'))

			for prono in responsedata:
				response = self.client.put('/pronoresults/{}/'.format(prono['id']), data=json.dumps({'score1':3, 'score2':1}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))


			# set prono groupstage winners of the user
			response = self.client.get('/pronogroupstagewinners/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
			responsedata = json.loads(response.rendered_content.decode('utf-8'))

			groupwinners = {1:{1:self.team_dict['A1'],2:self.team_dict['A2']},
							2:{1:self.team_dict['B1'],2:self.team_dict['B2']},
							3:{1:self.team_dict['C1'],2:self.team_dict['C2']},
							4:{1:self.team_dict['D1'],2:self.team_dict['D2']},
							5:{1:self.team_dict['E1'],2:self.team_dict['E2']},
							6:{1:self.team_dict['F1'],2:self.team_dict['F2']}}
			teampoints = {self.team_dict['A1'].id:9,self.team_dict['A2'].id:6,
						  self.team_dict['B1'].id:9,self.team_dict['B2'].id:6,
						  self.team_dict['C1'].id:9,self.team_dict['C2'].id:6,
						  self.team_dict['D1'].id:9,self.team_dict['D2'].id:6,
						  self.team_dict['E1'].id:9,self.team_dict['E2'].id:6,
						  self.team_dict['F1'].id:9,self.team_dict['F2'].id:6}

			for prono in responsedata:
				response = self.client.put('/pronogroupstagewinners/{}/'.format(prono['id']), data=json.dumps({'team': groupwinners[prono['group']][prono['ranking']].id}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))


			# set prono knockoutstage teams of the user
			knockoutstageteams = {8:[self.team_dict['A2'],self.team_dict['D1'],self.team_dict['B1'],self.team_dict['E2'],self.team_dict['F3'],self.team_dict['E1'],self.team_dict['D3'],self.team_dict['B2']],
								  4:[self.team_dict['D1'],self.team_dict['E2'],self.team_dict['F3'],self.team_dict['B2']],
								  2:[self.team_dict['D1'],self.team_dict['F3']],
								  1:[self.team_dict['D1']]}

			response = self.client.get('/pronoknockoutstageteams/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
			responsedata = json.loads(response.rendered_content.decode('utf-8'))
			tempknockoutstageteams = dict(knockoutstageteams)
			for prono in responsedata:
				team = tempknockoutstageteams[prono['stage']].pop()
				response = self.client.put('/pronoknockoutstageteams/{}/'.format(prono['id']), data=json.dumps({'team': team.id}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))


			# set prono total goals of the user
			response = self.client.get('/pronototalgoals/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
			responsedata = json.loads(response.rendered_content.decode('utf-8'))
			for prono in responsedata:
				response = self.client.put('/pronototalgoals/{}/'.format(prono['id']), data=json.dumps({'goals': len(Match.objects.all())*4}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))


			# set prono home team ranking
			response = self.client.get('/pronoteamresult/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
			responsedata = json.loads(response.rendered_content.decode('utf-8'))
			for prono in responsedata:
				if prono['team']==self.team_dict['D1'].id:
					response = self.client.put('/pronoteamresult/{}/'.format(prono['id']), data=json.dumps({'result': 1}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))

		time2 = time.time()

		print('{} full pronos entered in {:>5.2f}s'.format(numusers,time2-time1))
		

		# set all results
		time1 = time.time()

		token = self.generate_token({'username':'user1', 'password':'password123'})
		response = self.client.get('/matchresults/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		for result in responsedata:
			response = self.client.put('/matchresults/{}/'.format(result['id']), data=json.dumps({'score1':3, 'score2':1}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
	

		# set groupstage points
		response = self.client.get('/teams/', HTTP_AUTHORIZATION='JWT {}'.format(token))
		responsedata = json.loads(response.rendered_content.decode('utf-8'))
		for team in responsedata:
			if team['id'] in teampoints:
				response = self.client.put('/teams/{}/'.format(team['id']), data=json.dumps({'groupstage_points':teampoints[team['id']]}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
			else:
				response = self.client.put('/teams/{}/'.format(team['id']), data=json.dumps({'groupstage_points':1}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))


		time2 = time.time()
		print('all scores entered in     {:>5.2f}s'.format(time2-time1))
		
		
		# get scores for all users
		scores = []
		for user in AuthUser.objects.filter(is_staff=False):
			response = self.client.get('/points/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
			responsedata = json.loads(response.rendered_content.decode('utf-8'))
			scores.append({a['prono']:a['points'] for a in responsedata})

		scores_avg = {}
		for key in scores[0]:
			scores_avg[key] = sum([a[key] for a in scores])/len(scores)

		print(' ')
		print('maximum score:')
		for key in scores[0]:
			print('{}: {}'.format(key,scores[0][key]))
			self.assertEqual(scores_avg[key], scores[0][key])



