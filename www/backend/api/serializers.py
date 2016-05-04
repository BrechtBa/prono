from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.models import Group as AuthGroup

from rest_framework import serializers

from api.models import UserStatus,UserProfile,Points,LastUpdate,Team,Group,Match,MatchResult,PronoResult,PronoGroupstageWinners,PronoKnockoutstageTeams,PronoTotalGoals,PronoTeamResult


class RegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = AuthUser
		fields = ('username','email','password')

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = AuthUser
		fields = ('id','username','email','groups')

class UserStatusSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserStatus
		fields = ('id','user','databaseprepared')

class UserProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserProfile
		fields = ('id','user','displayname','avatar')
		
	
class TeamSerializer(serializers.ModelSerializer):
	class Meta:
		model = Team
		fields = ('id','name','abr','icon','iso_icon','group','groupstage_points')
	
	
class GroupSerializer(serializers.ModelSerializer):
	class Meta:
		model = Group
		fields = ('id','name')
		
	
class MatchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Match
		fields = ('id','team1','team2','defaultteam1','defaultteam2','date','stage','group','position')
	
	
class MatchResultSerializer(serializers.ModelSerializer):
	class Meta:
		model = MatchResult
		fields = ('id','match','score1','score2','penalty1','penalty2')



class PointsSerializer(serializers.ModelSerializer):
	class Meta:
		model = Points
		fields = ('id','user','prono','points')
		
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
		




