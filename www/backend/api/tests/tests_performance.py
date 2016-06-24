from rest_framework import status
from rest_framework_jwt.utils import jwt_decode_handler

from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup

import json
import datetime
import mock
import time

from ..models import UserStatus,UserProfile,Points,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult

from .utils import PronoTest,EC2016Test,MockDatetime



class PerformanceTests(EC2016Test):
    """
    def test_create_users(self):

        numusers = 50

        # set the teams in stage0
        self.set_stage_matches(0)

        time1 = time.time()
        for i in range(numusers):
            response = self.client.post('/register/', {'username':'testuser{}'.format(i+1), 'password':'somepassword'})
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            
            token = self.generate_token({'username':'testuser{}'.format(i+1), 'password':'somepassword'})
            response = self.client.post('/preparedatabaseforuser/', HTTP_AUTHORIZATION='JWT {}'.format(token))
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        
        time.sleep(10)
        #user = AuthUser.objects.get(username='testuser1')
        #print(user.points.all())
        #for s in UserStatus.objects.all():
        #    print(s.databaseprepared)

        time2 = time.time()
        print('{} users created in                         {:>5.2f}s'.format(numusers,time2-time1))
    """

    @mock.patch('api.utils.datetime.datetime', MockDatetime)
    def test_enter_prono(self):
        
        numusers = 50

        MockDatetime.utcnow = classmethod(lambda cls: self.dates['before_stage_0'])

        # set the teams in stage0
        self.set_stage_matches(0)

        # register users
        time1 = time.time()
        for i in range(numusers):
            response = self.client.post('/register/', {'username':'testuser{}'.format(i+1), 'password':'somepassword'})
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            token = self.generate_token({'username':'testuser{}'.format(i+1), 'password':'somepassword'})
            response = self.client.post('/preparedatabaseforuser/', HTTP_AUTHORIZATION='JWT {}'.format(token))
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        time2 = time.time()
        print('{} users created in                         {:>5.2f}s'.format(numusers,time2-time1))


        # set correct prono's for all users except admin
        time1 = time.time()
        for user in AuthUser.objects.filter(is_staff=False):
            
            token = self.generate_token({'username':'{}'.format(user.username), 'password':'somepassword'})
            payload = jwt_decode_handler(token)

            # set the prono results
            for i,match in enumerate(self.matches):
                if match.stage==0:
                    # set all prono results of the user
                    response = self.client.get('/pronoresults/?user={}&match={}'.format(user.id,match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                    responsedata = json.loads(response.rendered_content.decode('utf-8'))

                    prono = responsedata[0]
                    response = self.client.put('/pronoresults/{}/'.format(prono['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))

            # set prono groupstage winners of the user
            response = self.client.get('/pronogroupstagewinners/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
            responsedata = json.loads(response.rendered_content.decode('utf-8'))

            for prono in responsedata:
                response = self.client.put('/pronogroupstagewinners/{}/'.format(prono['id']), data=json.dumps({'team': self.groupwinners[prono['group']][prono['ranking']].id}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))


            # set prono knockoutstage teams of the user
            response = self.client.get('/pronoknockoutstageteams/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
            responsedata = json.loads(response.rendered_content.decode('utf-8'))

            # copy the dictionary manually
            knockoutstageteams = {}
            for s in [8,4,2,1]:
                knockoutstageteams[s] = [t for t in self.knockoutstageteams[s]]

            for prono in responsedata:
                team = knockoutstageteams[prono['stage']].pop()
                response = self.client.put('/pronoknockoutstageteams/{}/'.format(prono['id']), data=json.dumps({'team': team.id}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))


            # set prono total goals of the user
            response = self.client.get('/pronototalgoals/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
            responsedata = json.loads(response.rendered_content.decode('utf-8'))
            for prono in responsedata:
                response = self.client.put('/pronototalgoals/{}/'.format(prono['id']), data=json.dumps({'goals': self.total_goals}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))


            # set prono home team ranking
            response = self.client.get('/pronoteamresult/?user={}'.format(user.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
            responsedata = json.loads(response.rendered_content.decode('utf-8'))
            for prono in responsedata:
                if prono['team']==self.team_dict['D1'].id:
                    response = self.client.put('/pronoteamresult/{}/'.format(prono['id']), data=json.dumps({'result': 1}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))

        time2 = time.time()

        print('initial prono entered for {} users in       {:>5.2f}s'.format(numusers,time2-time1))


        MockDatetime.utcnow = classmethod(lambda cls: self.dates['before_stage_16'])

        # set groupstage results
        time1 = time.time()

        token = self.generate_token({'username':'user1', 'password':'password123'})

        for i,match in enumerate(self.matches):
            if match.stage==0:
                response = self.client.get('/matchresults/?match={}'.format(match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                responsedata = json.loads(response.rendered_content.decode('utf-8'))

                result = responsedata[0]
                response = self.client.put('/matchresults/{}/'.format(result['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
                #response = self.client.post('/calculatepoints/')


        time2 = time.time()
        print('all groupstage scores entered in            {:>5.2f}s     {:>5.2f}s/match'.format(time2-time1,(time2-time1)/24))


        # set groupstage points
        time1 = time.time()
        for team in Team.objects.all():
            if team.id in self.teampoints:
                response = self.client.put('/teams/{}/'.format(team.id), data=json.dumps({'groupstage_points':self.teampoints[team.id]}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))

            #response = self.client.post('/calculatepoints/')

        time2 = time.time()
        print('groupstage points entered in                {:>5.2f}s     {:>5.2f}s/group'.format(time2-time1,(time2-time1)/6))
        

        # round of 16
        self.set_stage_matches(16)

        # set correct prono's for stage matches
        time1 = time.time()
        for user in AuthUser.objects.filter(is_staff=False):
            
            token = self.generate_token({'username':'{}'.format(user.username), 'password':'somepassword'})

            # set the prono results
            for i,match in enumerate(self.matches):
                if match.stage==16:
                    # set all prono results of the user
                    response = self.client.get('/pronoresults/?user={}&match={}'.format(user.id,match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                    responsedata = json.loads(response.rendered_content.decode('utf-8'))

                    prono = responsedata[0]
                    response = self.client.put('/pronoresults/{}/'.format(prono['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
        time2 = time.time()
        print('round of 16 prono entered for {} users in   {:>5.2f}s'.format(numusers,time2-time1))

        # set the results
        MockDatetime.utcnow = classmethod(lambda cls: self.dates['before_stage_8'])

        time1 = time.time()
        token = self.generate_token({'username':'user1', 'password':'password123'})
        for i,match in enumerate(self.matches):
            if match.stage==16:
                response = self.client.get('/matchresults/?match={}'.format(match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                responsedata = json.loads(response.rendered_content.decode('utf-8'))

                result = responsedata[0]
                response = self.client.put('/matchresults/{}/'.format(result['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
                #response = self.client.post('/calculatepoints/')

        time2 = time.time()
        print('all round of 16 scores entered in           {:>5.2f}s     {:>5.2f}s/match'.format(time2-time1,(time2-time1)/8))




        # quarterfinal
        self.set_stage_matches(8)

        # set correct prono's for stage matches
        time1 = time.time()
        for user in AuthUser.objects.filter(is_staff=False):
            
            token = self.generate_token({'username':'{}'.format(user.username), 'password':'somepassword'})

            # set the prono results
            for i,match in enumerate(self.matches):
                if match.stage==8:
                    # set all prono results of the user
                    response = self.client.get('/pronoresults/?user={}&match={}'.format(user.id,match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                    responsedata = json.loads(response.rendered_content.decode('utf-8'))

                    prono = responsedata[0]
                    response = self.client.put('/pronoresults/{}/'.format(prono['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
        time2 = time.time()
        print('quarterfinal prono entered for {} users in  {:>5.2f}s'.format(numusers,time2-time1))

        # set the results
        MockDatetime.utcnow = classmethod(lambda cls: self.dates['before_stage_4'])

        time1 = time.time()
        token = self.generate_token({'username':'user1', 'password':'password123'})
        for i,match in enumerate(self.matches):
            if match.stage==8:
                response = self.client.get('/matchresults/?match={}'.format(match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                responsedata = json.loads(response.rendered_content.decode('utf-8'))

                result = responsedata[0]
                response = self.client.put('/matchresults/{}/'.format(result['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
                #response = self.client.post('/calculatepoints/')

        time2 = time.time()
        print('quarterfinal scores entered in              {:>5.2f}s     {:>5.2f}s/match'.format(time2-time1,(time2-time1)/4))



        # semifinal
        self.set_stage_matches(4)

        # set correct prono's for stage matches
        time1 = time.time()
        for user in AuthUser.objects.filter(is_staff=False):
            
            token = self.generate_token({'username':'{}'.format(user.username), 'password':'somepassword'})

            # set the prono results
            for i,match in enumerate(self.matches):
                if match.stage==4:
                    # set all prono results of the user
                    response = self.client.get('/pronoresults/?user={}&match={}'.format(user.id,match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                    responsedata = json.loads(response.rendered_content.decode('utf-8'))

                    prono = responsedata[0]
                    response = self.client.put('/pronoresults/{}/'.format(prono['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
        time2 = time.time()
        print('semifinal prono entered for {} users in     {:>5.2f}s'.format(numusers,time2-time1))

        # set the results
        MockDatetime.utcnow = classmethod(lambda cls: self.dates['before_stage_2'])

        time1 = time.time()
        token = self.generate_token({'username':'user1', 'password':'password123'})
        for i,match in enumerate(self.matches):
            if match.stage==4:
                response = self.client.get('/matchresults/?match={}'.format(match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                responsedata = json.loads(response.rendered_content.decode('utf-8'))

                result = responsedata[0]
                response = self.client.put('/matchresults/{}/'.format(result['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
                #response = self.client.post('/calculatepoints/')

        time2 = time.time()
        print('semifinal scores entered in                 {:>5.2f}s     {:>5.2f}s/match'.format(time2-time1,(time2-time1)/2))




        # final
        self.set_stage_matches(2)

        # set correct prono's for stage matches
        time1 = time.time()
        for user in AuthUser.objects.filter(is_staff=False):
            
            token = self.generate_token({'username':'{}'.format(user.username), 'password':'somepassword'})

            # set the prono results
            for i,match in enumerate(self.matches):
                if match.stage==2:
                    # set all prono results of the user
                    response = self.client.get('/pronoresults/?user={}&match={}'.format(user.id,match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                    responsedata = json.loads(response.rendered_content.decode('utf-8'))

                    prono = responsedata[0]
                    response = self.client.put('/pronoresults/{}/'.format(prono['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
        time2 = time.time()
        print('final prono entered for {} users in         {:>5.2f}s'.format(numusers,time2-time1))

        # set the results
        MockDatetime.utcnow = classmethod(lambda cls: self.dates['finished'])

        time1 = time.time()
        token = self.generate_token({'username':'user1', 'password':'password123'})
        for i,match in enumerate(self.matches):
            if match.stage==2:
                response = self.client.get('/matchresults/?match={}'.format(match.id), HTTP_AUTHORIZATION='JWT {}'.format(token))
                responsedata = json.loads(response.rendered_content.decode('utf-8'))

                result = responsedata[0]
                response = self.client.put('/matchresults/{}/'.format(result['id']), data=json.dumps({'score1':self.matchdata[i]['score1'], 'score2':self.matchdata[i]['score2']}), content_type='application/json', HTTP_AUTHORIZATION='JWT {}'.format(token))
                #response = self.client.post('/calculatepoints/')

        time2 = time.time()
        print('final scores entered in                     {:>5.2f}s     {:>5.2f}s/match'.format(time2-time1,(time2-time1)/1))




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



