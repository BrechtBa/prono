//
// 
// view.js is part of prono
// @author: Brecht Baeten
// @license: GNU GENERAL PUBLIC LICENSE
// 
//


// JQuery wrapper
$(document).ready(function(){
	
	groupstageView = new app.classes.view($('[data-view="groupstage"]'),app.groupstage);
	groupstageView.update();
	$(document).on('updateGroupstageView',function(event,data){
		groupstageView.update();		
	});

	usersView = new app.classes.view($('[data-view="users"]'),app.users);
	usersView.update();	
	$(document).on('updateUsersView',function(event,data){
		usersView.update();		
	});

	teamsView = new app.classes.view($('[data-view="teams"]'),app.teams);
	teamsView.update();
	$(document).on('updateTeamsView',function(event,data){
		teamsView.update();		
	});
	matchesView = new app.classes.view($('[data-view="matches"]'),app.matches,{
		'parseDate': function(arg){
			var date = new Date(arg*1000);
			var month = "0" + date.getMonth();
			var day = "0" + date.getDay();
			var hours = "0" + date.getHours();
			var minutes = "0" + date.getMinutes();
			return month.substr(-2) + '-' + day.substr(-2) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2)
		}
	});
	matchesView.update();
	$(document).on('updateMatchesView',function(event,data){
		matchesView.update();		
	});
	
});
