



// JQuery wrapper
$(document).ready(function(){
////////////////////////////////////////////////////////////////////////////////
// Login                                                                      //
////////////////////////////////////////////////////////////////////////////////
	// try to login using a cookie
	app.service.user.login();
	// form login
	$('#login form').submit(function(event){
		event.preventDefault();
		app.service.user.login( $(this).find('[name=username]').val(),$(this).find('[name=password]').val() );
	});
	// logout
	$(document).on('click tap', '[data-control="logout"]',function(event,data){
		app.service.user.logout();
	});
	// event triggered when a user logs in
	$(document).on('loggedin',function(event,data){
		console.log('user is logged in');
		$(document).trigger('usersModelGet');
		$(document).trigger('teamsModelGet');
	});

////////////////////////////////////////////////////////////////////////////////
// Register                                                                   //
////////////////////////////////////////////////////////////////////////////////
	$('#register form').submit(function(event){
		event.preventDefault();
		app.service.user.register( $(this).find('[name=username]').val(),$(this).find('[name=password]').val(),$(this).find('[name=password2]').val() );
		$(document).trigger('closePopup');
	});

////////////////////////////////////////////////////////////////////////////////
// Users                                                                      //
////////////////////////////////////////////////////////////////////////////////
	$(document).on('click tap','[data-view="users"] [data-control="delete"]',function(event){
		var id = $(event.target).parent('[data-bind="user in users"]').attr('data-id');
		if( id != app.service.user.id ){ 
			app.users.delete( id );
		}
		else{
			console.log('Error: you con not delete yourself');
		}
	});




////////////////////////////////////////////////////////////////////////////////
// Teams                                                                      //
////////////////////////////////////////////////////////////////////////////////
	// add a team
	$(document).on('click tap','[data-view="teams"] [data-control="add"]',function(event){
		app.model.teams.post({'name':'','abr':'','icon':''});
	});
	// edit a team
	$(document).on('click tap','[data-view="teams"] [data-control="edit"]',function(event){
		var id = $(event.target).parents('[data-bind="team in teams"]').attr('data-id');
		app.model.editteam.put(1,{
			'id': id,
			'name': app.model.teams[id]['name'],
			'abr':  app.model.teams[id]['abr'],
			'icon': app.model.teams[id]['icon'],
		});
		// open the popup
		$(document).trigger('openPopup',['#editteam']);
	});
	$(document).on('submit','#editteam form',function(event){
		event.preventDefault();
		console.log('editteam form submit');
		
		var id = $('#editteam').find('[name="id"]').val();
		app.model.teams.put(id,{
			'name': $('#editteam').find('[name="name"]').val(),
			'abr':  $('#editteam').find('[name="abr"]').val(),
			'icon': $('#editteam').find('[name="icon"]').val()
		});

		// close the popup
		$(document).trigger('closePopup');
	});	
	// delete a team
	$(document).on('click tap','[data-view="teams"] [data-control="delete"]',function(event){
		var id = $(event.target).parents('[data-bind="team in teams"]').attr('data-id');
		app.model.teams.delete(id);
	});




////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
	// add a group
	$(document).on('click tap','[data-view="groups"] [data-control="add"]',function(event){
		console.log('add group');
		app.model.groups.post({'name':'','team1':'','team2':''});
	});
	// edit a group
	$(document).on('click tap','[data-view="groups"] [data-control="edit"]',function(event){
		var id = $(event.target).parents('[data-bind="group in groups"]').attr('data-id');
		
		// check if the teams are defined
		if( typeof app.model.groups[id].team1 === 'undefined'){
			team1 = 0;
		}
		else{
			team1 = app.model.groups[id].team1.id
		}
		if( typeof app.model.groups[id].team2 === 'undefined'){
			team2 = 0;
		}
		else{
			team2 = app.model.groups[id].team2.id
		}
		
		app.model.editgroup.put(1,{
			'id': 		id,
			'name':   	app.model.groups[id].name,
			'team1':    team1,
			'team2':	team2
		});

		// open the popup
		$(document).trigger('openPopup',['#editgroup']);
	});
	$(document).on('submit','#editgroup form',function(event){
		event.preventDefault();
		console.log('editgroup form submit');
		
		var id = $('#editgroup').find('[name="id"]').val();
		app.model.groups.put(id,{
			'team1':    $('#editgroup').find('[name="team1"]').val(),
			'team2':    $('#editgroup').find('[name="team2"]').val(),
			'name':     $('#editgroup').find('[name="name"]').val()
		});

		// close the popup
		$(document).trigger('closePopup');
	});	




////////////////////////////////////////////////////////////////////////////////
// Matches                                                                    //
////////////////////////////////////////////////////////////////////////////////
	// add a match
	$(document).on('click tap','[data-view="matches"] [data-control="add"]',function(event){
		console.log('add match');
		app.model.matches.post({'team1':'','score1':'','penalty1':'','team2':'','score2':'','penalty2':'','date':''});
	});
	// edit a match
	$(document).on('click tap','[data-view="matches"] [data-control="edit"]',function(event){
		var id = $(event.target).parents('[data-bind="match in matches"]').attr('data-id');
		
		// check if the teams are defined
		if( typeof app.model.matches[id].team1 === 'undefined'){
			team1 = 0;
		}
		else{
			team1 = app.model.matches[id].team1.id
		}
		if( typeof app.model.matches[id].team2 === 'undefined'){
			team2 = 0;
		}
		else{
			team2 = app.model.matches[id].team2.id
		}
		// check if the group is defined
		if( typeof app.model.matches[id].group === 'undefined'){
			group = 0;
		}
		else{
			group = app.model.matches[id].group.id
		}
		
		app.model.editmatch.put(1,{
			'id': 			id,
			'date':     	app.model.matches[id].date,
			'stage': 		app.model.matches[id].stage,
			'group':    	group,
			'position': 	app.model.matches[id].position,
			'team1':    	team1,
			'team2':    	team2,
			'defaultteam1': app.model.matches[id].defaultteam1,
			'defaultteam2': app.model.matches[id].defaultteam2
		});

		// open the popup
		$(document).trigger('openPopup',['#editmatch']);
	});
	$(document).on('submit','#editmatch form',function(event){
		event.preventDefault();
		console.log('editmatch form submit');
		
		var id = $('#editmatch').find('[name="id"]').val();
		
		// parse the date string
		var datestring = $('#editmatch').find('[name="date"]').val();
		var dateparts = datestring.split(' ');
   		var timeparts = dateparts[1].split(':');
   		dateparts = dateparts[0].split('-');

		var date = new Date(dateparts[2], parseInt(dateparts[1], 10) - 1, dateparts[0], timeparts[0], timeparts[1]);
		date = date.getTime()/1000;

		app.model.matches.put(id,{
			'team1':    		$('#editmatch').find('[name="team1"]').val(),
			'team2':    		$('#editmatch').find('[name="team2"]').val(),
			'defaultteam1': 	$('#editmatch').find('[name="defaultteam1"]').val(),
			'defaultteam2':  	$('#editmatch').find('[name="defaultteam2"]').val(),
			'stage':    		$('#editmatch').find('[name="stage"]').val(),
			'group':    		$('#editmatch').find('[name="group"]').val(),
			'position':    		$('#editmatch').find('[name="position"]').val(),
			'date':     		date
		});

		// close the popup
		$(document).trigger('closePopup');
	});	
	// edit a match score
	$(document).on('click tap','[data-view="matches"] [data-control="editscore"]',function(event){
		var id = $(event.target).parents('[data-bind="match in matches"]').attr('data-id');		

		app.model.editmatch.put(1,{
			'id': id,
			'score1':   app.model.matches[id].score1,
			'score2':   app.model.matches[id].score2,
			'penalty1': app.model.matches[id].penalty1,
			'penalty2': app.model.matches[id].penalty2,
		});

		// open the popup
		$(document).trigger('openPopup',['#editmatchscore']);
	});
	$(document).on('submit','#editmatchscore form',function(event){
		event.preventDefault();
		console.log('editmatchscore form submit');
		
		var id = $('#editmatchscore').find('[name="id"]').val();
		app.model.matches.put(id,{
			'score1':   $('#editmatchscore').find('[name="score1"]').val(),
			'score2':   $('#editmatchscore').find('[name="score2"]').val(),
			'penalty1': $('#editmatchscore').find('[name="penalty1"]').val(),
			'penalty2': $('#editmatchscore').find('[name="penalty2"]').val(),
		});

		// close the popup
		$(document).trigger('closePopup');
	});	
	// delete a match
	$(document).on('click tap','[data-view="matches"] [data-control="delete"]',function(event){
		var id = $(event.target).parents('[data-bind="match in matches"]').attr('data-id');
		app.model.matches.delete(id);
	});




////////////////////////////////////////////////////////////////////////////////
// Data get events                                                            //
////////////////////////////////////////////////////////////////////////////////
	$(document).on('usersModelGet',function(event,data){
		console.log('getting users');
		app.model.users.get();
	});
	$(document).on('teamsModelGet',function(event,data){
		console.log('getting teams');
		app.model.teams.get();
	});
	$(document).on('groupsModelGet',function(event,data){
		console.log('getting groups');
		app.model.groups.get();
	});
	$(document).on('matchesModelGet',function(event,data){
		console.log('getting matches');
		app.model.matches.get();
	});
	$(document).on('groupstageModelGet',function(event,data){
		console.log('getting groupstage');
		app.model.groupstage.get();
	});
	$(document).on('knockoutstageModelGet',function(event,data){
		console.log('getting knockoutstage');
		app.model.roundof16left.get();
		app.model.roundof16right.get();
		app.model.quarterfinalleft.get();
		app.model.quarterfinalright.get();
		app.model.semifinalleft.get();
		app.model.semifinalright.get();
		app.model.final.get();
	});
	$(document).on('userbetsModelGet',function(event,data){
		console.log('getting bets');
		app.model.userbetsscore.get();
	});

// JQuery wrapper
});





////////////////////////////////////////////////////////////////////////////////
// Testing                                                                    //
////////////////////////////////////////////////////////////////////////////////
$(document).on('loggedin',function(event,data){
	//app.service.api.get('users/',function(result){console.log(result);});
	//app.service.api.get('users/1',function(result){console.log(result);});

	//app.service.api.put('users/2',{'username':'test'},function(result){console.log(result);});
	
	

});
