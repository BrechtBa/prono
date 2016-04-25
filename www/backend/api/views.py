from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework import generics
from rest_framework import filters

from api.models import UserProfile,Points,Team,Group,Match,MatchResult,check
from api.serializers import UserSerializer,UserProfileSerializer,PointsSerializer,TeamSerializer,GroupSerializer,MatchSerializer,MatchResultSerializer

################################################################################
# Helper functions
################################################################################
def filterargs(kwargs):
	filterargs = {}
	if 'key0' in kwargs:
		filterargs[kwargs['key0']] =  kwargs['val0']
	
	return filterargs
	
def simplefilter(filterargs,model):
	if filterargs == {}:
		return model.objects.all()
	else:
		return model.objects.filter(**filterargs)

		
################################################################################
# Views
################################################################################
# users
class UserList(generics.ListCreateAPIView):
	serializer_class = UserSerializer
	def get_queryset(self):
		return simplefilter(filterargs(self.kwargs),AuthUser)
		
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserSerializer
	queryset = AuthUser.objects.all()
	
	
# user profiles	
class UserProfileList(generics.ListCreateAPIView):
	serializer_class = UserProfileSerializer
	def get_queryset(self):
		return simplefilter(filterargs(self.kwargs),UserProfile)
		
class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserProfileSerializer
	queryset = UserProfile.objects.all()	
	
	
# points	
class PointsList(generics.ListCreateAPIView):
	serializer_class = PointsSerializer
	def get_queryset(self):
		return simplefilter(filterargs(self.kwargs),Points)
		
class PointsDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PointsSerializer	
	queryset = Points.objects.all()
	
	
# teams
class TeamList(generics.ListCreateAPIView):
	serializer_class = TeamSerializer
	def get_queryset(self):
		return simplefilter(filterargs(self.kwargs),Team)
		
class TeamDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = TeamSerializer
	queryset = Team.objects.all()

	
# groups
class GroupList(generics.ListCreateAPIView):
	serializer_class = GroupSerializer
	def get_queryset(self):
		return simplefilter(filterargs(self.kwargs),Group)

class GroupDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = GroupSerializer	
	queryset = Group.objects.all()
	
	
# matches
class MatchList(generics.ListCreateAPIView):
	serializer_class = MatchSerializer
	def get_queryset(self):
		args = filterargs(self.kwargs)
		
		if 'team' in args:
			filterargs1 = dict(args)
			filterargs2 = dict(args)
			filterargs1['team1'] = args['team']
			filterargs2['team2'] = args['team']
			del filterargs1['team']
			del filterargs2['team']
			
			return simplefilter(filterargs1,Match) | simplefilter(filterargs2,Match)
		else:
			return simplefilter(args,Match)
			

class MatchDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = MatchSerializer
	queryset = Match.objects.all()
	
	
# match results
class MatchResultList(generics.ListCreateAPIView):
	serializer_class = MatchResultSerializer
	queryset = MatchResult.objects.all()

class MatchResultDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = MatchResultSerializer
	queryset = MatchResult.objects.all()