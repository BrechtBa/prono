from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework_jwt.views import refresh_jwt_token


from api import views



urlpatterns = [
	url(r'^token-auth/', obtain_jwt_token, name='token-auth'),
	url(r'^token-refresh/', refresh_jwt_token),
	url(r'^users/$', views.UserList.as_view()),
	url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
	url(r'^userprofiles/$', views.UserProfileList.as_view()),
	url(r'^userprofiles/(?P<pk>[0-9]+)/$', views.UserProfileDetail.as_view()),
	url(r'^points/$', views.PointsList.as_view()),
	url(r'^points/(?P<key0>.+)/(?P<val0>.+)/$', views.PointsList.as_view()),
	url(r'^points/(?P<pk>[0-9]+)/$', views.PointsDetail.as_view()),
	url(r'^teams/$', views.TeamList.as_view()),
	url(r'^teams/(?P<key0>.+)/(?P<val0>.+)/$', views.TeamList.as_view()),
	url(r'^teams/(?P<pk>[0-9]+)/$', views.TeamDetail.as_view()),
	url(r'^groups/$', views.GroupList.as_view()),
	url(r'^groups/(?P<pk>[0-9]+)/$', views.GroupDetail.as_view()),
	url(r'^matches/$', views.MatchList.as_view()),
	url(r'^matches/(?P<key0>.+)/(?P<val0>.+)/$', views.MatchList.as_view()),
	url(r'^matches/(?P<pk>[0-9]+)/$', views.MatchDetail.as_view()),
	url(r'^matchresults/$', views.MatchResultList.as_view()),
	url(r'^matchresults/(?P<key0>.+)/(?P<val0>.+)/$', views.MatchResultList.as_view()),
	url(r'^matchresults/(?P<pk>[0-9]+)/$', views.MatchResultDetail.as_view()),
	url(r'^pronoresults/$', views.PronoResultList.as_view()),
	url(r'^pronoresults/(?P<key0>.+)/(?P<val0>.+)/$', views.PronoResultList.as_view()),
	url(r'^pronoresults/(?P<pk>[0-9]+)/$', views.PronoResultDetail.as_view()),
	url(r'^pronogroupstagewinners/$', views.PronoGroupstageWinnersList.as_view()),
	url(r'^pronogroupstagewinners/(?P<key0>.+)/(?P<val0>.+)/$', views.PronoGroupstageWinnersList.as_view()),
	url(r'^pronogroupstagewinners/(?P<pk>[0-9]+)/$', views.PronoGroupstageWinnersDetail.as_view()),
	url(r'^pronoknockoutstageteams/$', views.PronoKnockoutstageTeamsList.as_view()),
	url(r'^pronoknockoutstageteams/(?P<key0>.+)/(?P<val0>.+)/$', views.PronoKnockoutstageTeamsList.as_view()),
	url(r'^pronoknockoutstageteams/(?P<pk>[0-9]+)/$', views.PronoKnockoutstageTeamsDetail.as_view()),
	url(r'^pronototalgoals/$', views.PronoTotalGoalsList.as_view()),
	url(r'^pronototalgoals/(?P<key0>.+)/(?P<val0>.+)/$', views.PronoTotalGoalsList.as_view()),
	url(r'^pronototalgoals/(?P<pk>[0-9]+)/$', views.PronoTotalGoalsDetail.as_view()),
	url(r'^pronoteamresult/$', views.PronoTeamResultList.as_view()),
	url(r'^pronoteamresult/(?P<key0>.+)/(?P<val0>.+)/$', views.PronoTeamResultList.as_view()),
	url(r'^pronoteamresult/(?P<pk>[0-9]+)/$', views.PronoTeamResultDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
