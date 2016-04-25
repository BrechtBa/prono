from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework import generics
from rest_framework import filters
from rest_framework import permissions

from api.models import UserProfile,Points,Team,Group,Match,MatchResult,check
from api.serializers import UserSerializer,UserProfileSerializer,PointsSerializer,TeamSerializer,GroupSerializer,MatchSerializer,MatchResultSerializer
from api.permissions import IsOwnerOrAdmin,IsAdminOrReadOnly,IsOwnerOrReadOnly,PointsPermissions


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
	permission_classes = (permissions.IsAdminUser,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),AuthUser)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
		
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserSerializer
	permission_classes = (IsOwnerOrAdmin,)
	def get_queryset(self):
		queryset = AuthUser.objects.all()
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
	
	
# user profiles	
class UserProfileList(generics.ListCreateAPIView):
	serializer_class = UserProfileSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),UserProfile)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
		
class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserProfileSerializer
	permission_classes = (IsOwnerOrAdmin,)
	def get_queryset(self):
		queryset = UserProfile.objects.all()
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
	
	
# points	
class PointsList(generics.ListCreateAPIView):
	serializer_class = PointsSerializer
	permission_classes = (PointsPermissions,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),Points)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
	
	
class PointsDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PointsSerializer
	permission_classes = (PointsPermissions,)
	def get_queryset(self):
		queryset = Points.objects.all()
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
		
# teams
class TeamList(generics.ListCreateAPIView):
	serializer_class = TeamSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),Team)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
		
class TeamDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = TeamSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = Team.objects.all()
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

	
# groups
class GroupList(generics.ListCreateAPIView):
	serializer_class = GroupSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),Group)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
		
class GroupDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = GroupSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = Group.objects.all()
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
	
	
# matches
class MatchList(generics.ListCreateAPIView):
	serializer_class = MatchSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		args = filterargs(self.kwargs)
		
		if 'team' in args:
			filterargs1 = dict(args)
			filterargs2 = dict(args)
			filterargs1['team1'] = args['team']
			filterargs2['team2'] = args['team']
			del filterargs1['team']
			del filterargs2['team']
			
			queryset = simplefilter(filterargs1,Match) | simplefilter(filterargs2,Match)
		else:
			queryset = simplefilter(args,Match)
			
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

class MatchDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = MatchSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = Match.objects.all()
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset
	
	
# match results
class MatchResultList(generics.ListCreateAPIView):
	serializer_class = MatchResultSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = MatchResult.objects.all()
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

class MatchResultDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = MatchResultSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = MatchResult.objects.all()
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset