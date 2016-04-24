from django.contrib.auth.models import User, Group
from rest_framework import serializers

from api.models import Team,Match


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username','email','groups')

class TeamSerializer(serializers.ModelSerializer):
	class Meta:
		model = Team
		fields = ('id','name','abr','icon','iso_icon','groupstage_points')


class MatchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Match
		fields = ('id','team1','team2','defaultteam1','defaultteam2','date','stage','group','position')
