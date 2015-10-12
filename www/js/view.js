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
	
	matchesView = new app.classes.view($('[data-view="matches"]'),app.teams);
	matchesView.update();
	$(document).on('updateMatchesView',function(event,data){
		matchesView.update();		
	});
	
});
