from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework import generics

from api.models import UserProfile,Points,Team,Group,Match,MatchResult
from api.serializers import UserSerializer,UserProfileSerializer,PointsSerializer,TeamSerializer,GroupSerializer,MatchSerializer,MatchResultSerializer

# users
class UserList(generics.ListCreateAPIView):
	queryset = AuthUser.objects.all()
	serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = AuthUser.objects.all()
	serializer_class = UserSerializer
	
# user profiles	
class UserProfileList(generics.ListCreateAPIView):
	queryset = UserProfile.objects.all()
	serializer_class = UserProfileSerializer

class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = UserProfile.objects.all()
	serializer_class = UserProfileSerializer
	
# user points	
class PointsList(generics.ListCreateAPIView):
	queryset = Points.objects.all()
	serializer_class = PointsSerializer

class PointsDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Points.objects.all()
	serializer_class = PointsSerializer	
	
	
# teams
class TeamList(generics.ListCreateAPIView):
	queryset = Team.objects.all()
	serializer_class = TeamSerializer

class TeamDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Team.objects.all()
	serializer_class = TeamSerializer

# groups
class GroupList(generics.ListCreateAPIView):
	queryset = Group.objects.all()
	serializer_class = GroupSerializer

class GroupDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Group.objects.all()
	serializer_class = GroupSerializer	
	
# matches
class MatchList(generics.ListCreateAPIView):
	queryset = Match.objects.all()
	serializer_class = MatchSerializer

class MatchDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = Match.objects.all()
	serializer_class = MatchSerializer

# match results
class MatchResultList(generics.ListCreateAPIView):
	queryset = MatchResult.objects.all()
	serializer_class = MatchResultSerializer

class MatchResultDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = MatchResult.objects.all()
	serializer_class = MatchResultSerializer