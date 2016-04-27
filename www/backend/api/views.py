from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework import generics
from rest_framework import filters
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response

from api.models import UserProfile,Points,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult
from api.serializers import *
from api.permissions import *


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
# register
@api_view(['POST'])
@permission_classes((permissions.AllowAny, ))
def register(request):
	serializer = RegisterSerializer(data=request.data)
	if serializer.is_valid():
		AuthUser.objects.create_user(username=serializer.data['username'], password=serializer.data['password'])
		return Response(serializer.data, status=status.HTTP_201_CREATED)
	else:
		return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)

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
	queryset = AuthUser.objects.all()
	
	
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
	queryset = UserProfile.objects.all()
	
	
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
	queryset = Points.objects.all()

		
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
	queryset = Team.objects.all()

	
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
	queryset = Group.objects.all()
	
	
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
	queryset = Match.objects.all()
	
	
# match results
class MatchResultList(generics.ListCreateAPIView):
	serializer_class = MatchResultSerializer
	permission_classes = (IsAdminOrReadOnly,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),MatchResult)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

class MatchResultDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = MatchResultSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = MatchResult.objects.all()

	
# prono result
class PronoResultList(generics.ListCreateAPIView):
	serializer_class = PronoResultSerializer
	permission_classes = (PronoResultPermission,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),PronoResult)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

class PronoResultDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoResultSerializer
	permission_classes = (PronoResultPermission,)
	queryset = PronoResult.objects.all()
	

# prono groupstage winners
class PronoGroupstageWinnersList(generics.ListCreateAPIView):
	serializer_class = PronoGroupstageWinnersSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),PronoGroupstageWinners)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

class PronoGroupstageWinnersDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoGroupstageWinnersSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoGroupstageWinners.objects.all()


# prono knockoutstage teams
class PronoKnockoutstageTeamsList(generics.ListCreateAPIView):
	serializer_class = PronoKnockoutstageTeamsSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),PronoKnockoutstageTeams)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

class PronoKnockoutstageTeamsDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoKnockoutstageTeamsSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoKnockoutstageTeams.objects.all()


# prono total goals
class PronoTotalGoalsList(generics.ListCreateAPIView):
	serializer_class = PronoTotalGoalsSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),PronoTotalGoals)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

class PronoTotalGoalsDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoTotalGoalsSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoTotalGoals.objects.all()


# prono total goals
class PronoTeamResultList(generics.ListCreateAPIView):
	serializer_class = PronoTeamResultSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	def get_queryset(self):
		queryset = simplefilter(filterargs(self.kwargs),PronoTeamResult)
		for obj in queryset:
			self.check_object_permissions(self.request, obj)
		return queryset

class PronoTeamResultDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoTeamResultSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoTeamResult.objects.all()





