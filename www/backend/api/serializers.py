from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup

from rest_framework import serializers

from api.models import UserStatus,UserProfile,Points,LastUpdate,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult


class RegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = AuthUser
		fields = ('username','email','password')

class ChangePasswordSerializer(serializers.ModelSerializer):
	class Meta:
		model = AuthUser
		fields = ('password',)

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = AuthUser
		fields = ('id','username','email','groups')

class UserProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserProfile
		
class UserStatusSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserStatus	



class TeamSerializer(serializers.ModelSerializer):
	class Meta:
		model = Team
	
class GroupSerializer(serializers.ModelSerializer):
	class Meta:
		model = Group		
	
class MatchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Match
	
class MatchResultSerializer(serializers.ModelSerializer):
	class Meta:
		model = MatchResult



class PointsSerializer(serializers.ModelSerializer):
	class Meta:
		model = Points
		
class PronoResultSerializer(serializers.ModelSerializer):
	class Meta:
		model = PronoResult

class PronoGroupstageWinnersSerializer(serializers.ModelSerializer):
	class Meta:
		model = PronoGroupstageWinners

class PronoKnockoutstageTeamsSerializer(serializers.ModelSerializer):
	class Meta:
		model = PronoKnockoutstageTeams

class PronoTotalGoalsSerializer(serializers.ModelSerializer):
	class Meta:
		model = PronoTotalGoals

class PronoTeamResultSerializer(serializers.ModelSerializer):
	class Meta:
		model = PronoTeamResult

class LastUpdateSerializer(serializers.ModelSerializer):
	class Meta:
		model = LastUpdate
		fields = ('id','date')
		




