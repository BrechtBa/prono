from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup
from rest_framework import generics
from rest_framework import filters
from rest_framework import permissions
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from api.models import UserProfile,AvatarUpload,Points,LastUpdate,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult
from api.models import check_user
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
	queryset = AuthUser.objects.all()
	filter_fields = ('groups',)
		
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserSerializer
	permission_classes = (IsOwnerOrAdmin,)
	queryset = AuthUser.objects.all()
	
	
# user profiles	
class UserProfileList(generics.ListCreateAPIView):
	serializer_class = UserProfileSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = UserProfile.objects.all()
		
class UserProfileDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = UserProfileSerializer
	permission_classes = (IsOwnerOrAdmin,)
	queryset = UserProfile.objects.all()
	

# avatar upload
class AvatarUploadView(APIView):
	parser_classes = (MultiPartParser,)
	permission_classes = (permissions.AllowAny,)

	def put(self, request, format=None):
		file_obj = request.data['file']

		avatarupload = AvatarUpload.objects.get(user=request.user)

		avatarupload.file = file_obj
		avatarupload.save()

		return Response({'url':'http://pronoapi.duckdns.org/media/{}'.format(avatarupload.file)},status=status.HTTP_200_OK)

# check user tables
class CheckUserView(APIView):
	permission_classes = (permissions.AllowAny,)

	def post(self, request, format=None):
		check_user(request.user)

		return Response(status=status.HTTP_200_OK)

# points	
class PointsList(generics.ListCreateAPIView):
	serializer_class = PointsSerializer
	permission_classes = (PointsPermissions,)
	queryset = Points.objects.all()
	filter_fields = ('user','prono',)
	
class PointsDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PointsSerializer
	permission_classes = (PointsPermissions,)
	queryset = Points.objects.all()


# lastupdate	
class LastUpdateList(generics.ListCreateAPIView):
	serializer_class = LastUpdateSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = LastUpdate.objects.all()
	
class LastUpdateDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = LastUpdateSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = LastUpdate.objects.all()

		
# teams
class TeamList(generics.ListCreateAPIView):
	serializer_class = TeamSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = Team.objects.all()
	filter_fields = ('group','name',)
		
class TeamDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = TeamSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = Team.objects.all()

	
# groups
class GroupList(generics.ListCreateAPIView):
	serializer_class = GroupSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = Group.objects.all()
	filter_fields = ('name',)
		
class GroupDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = GroupSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = Group.objects.all()
	
	
# matches
class MatchList(generics.ListCreateAPIView):
	serializer_class = MatchSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = Match.objects.all()
	filter_fields = ('group','stage','team1','team2',)

class MatchDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = MatchSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = Match.objects.all()
	
	
# match results
class MatchResultList(generics.ListCreateAPIView):
	serializer_class = MatchResultSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = MatchResult.objects.all()
	filter_fields = ('match',)

class MatchResultDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = MatchResultSerializer
	permission_classes = (IsAdminOrReadOnly,)
	queryset = MatchResult.objects.all()

	
# prono result
class PronoResultList(generics.ListCreateAPIView):
	serializer_class = PronoResultSerializer
	permission_classes = (PronoResultPermission,)
	queryset = PronoResult.objects.all()
	filter_fields = ('user','match',)

class PronoResultDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoResultSerializer
	permission_classes = (PronoResultPermission,)
	queryset = PronoResult.objects.all()
	

# prono groupstage winners
class PronoGroupstageWinnersList(generics.ListCreateAPIView):
	serializer_class = PronoGroupstageWinnersSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoGroupstageWinners.objects.all()
	filter_fields = ('user','group','ranking',)

class PronoGroupstageWinnersDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoGroupstageWinnersSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoGroupstageWinners.objects.all()


# prono knockoutstage teams
class PronoKnockoutstageTeamsList(generics.ListCreateAPIView):
	serializer_class = PronoKnockoutstageTeamsSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoKnockoutstageTeams.objects.all()
	filter_fields = ('user','stage','team',)

class PronoKnockoutstageTeamsDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoKnockoutstageTeamsSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoKnockoutstageTeams.objects.all()


# prono total goals
class PronoTotalGoalsList(generics.ListCreateAPIView):
	serializer_class = PronoTotalGoalsSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoTotalGoals.objects.all()
	filter_fields = ('user',)

class PronoTotalGoalsDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoTotalGoalsSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoTotalGoals.objects.all()


# prono team result
class PronoTeamResultList(generics.ListCreateAPIView):
	serializer_class = PronoTeamResultSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoTeamResult.objects.all()
	filter_fields = ('user','team','result',)

class PronoTeamResultDetail(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = PronoTeamResultSerializer
	permission_classes = (IsOwnerOrAdminGroupstage,)
	queryset = PronoTeamResult.objects.all()





