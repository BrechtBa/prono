from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from api import views


urlpatterns = [
	url(r'^users/$', views.UserList.as_view()),
	url(r'^teams/$', views.TeamList.as_view()),
	url(r'^teams/(?P<pk>[0-9]+)/$', views.TeamDetail.as_view()),
	url(r'^matches/$', views.MatchList.as_view()),
	url(r'^matches/(?P<pk>[0-9]+)/$', views.MatchDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
