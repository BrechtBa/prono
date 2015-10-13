



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
		$(document).trigger('getTeamsModel');
		app.users.get();
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
		var id = $(event.target).parent('[data-bind="user in data"]').attr('data-id');
		if( id != app.service.user.id ){ 
			app.users.del( id );
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
		
		app.teams.post({'name':'','abr':'','icon':''});

	});
	// edit a team
	$(document).on('click tap','[data-view="teams"] [data-control="edit"]',function(event){
		var id = $(event.target).parent('[data-bind="team in data"]').attr('data-id');
		// populate the popup
		$('#edit_team').find('[name="id"]').val(id);
		$('#edit_team').find('[name="name"]').val(app.teams.data[id].name);
		$('#edit_team').find('[name="abr"]').val(app.teams.data[id].abr);
		$('#edit_team').find('[name="icon"]').val(app.teams.data[id].icon);

		// open the popup
		$(document).trigger('openPopup',['#edit_team']);
	});
	$(document).submit('#edit_team form',function(event){
		event.preventDefault();
		console.log(event);

		// populate the popup
		var id = $('#edit_team').find('[name="id"]').val();
		app.teams.put(id,{
			'name':$('#edit_team').find('[name="name"]').val(),
			'abr':$('#edit_team').find('[name="abr"]').val(),
			'icon':$('#edit_team').find('[name="icon"]').val()
		});

		// close the popup
		$(document).trigger('closePopup');
	});	
	// delete a team
	$(document).on('click tap','[data-view="teams"] [data-control="delete"]',function(event){
		var id = $(event.target).parent('[data-bind="team in data"]').attr('data-id');
		app.teams.del(id);
	});




////////////////////////////////////////////////////////////////////////////////
// Matches                                                                      //
////////////////////////////////////////////////////////////////////////////////
	// add a match
	$(document).on('click tap','[data-view="matches"] [data-control="add"]',function(event){
		
		app.matches.post({'team1':0,'score1':-1,'penalty1':-1,'team2':0,'score2':-1,'penalty2':-1,'date':0});

	});
	// edit a match
	$(document).on('click tap','[data-view="matches"] [data-control="edit"]',function(event){
		var id = $(event.target).parent('[data-bind="match in data"]').attr('data-id');
		// populate the popup
		$('#edit_match').find('[name="id"]').val(id);
		$('#edit_match').find('[name="score1"]').val(app.matches.data[id].score1);
		$('#edit_match').find('[name="score2"]').val(app.matches.data[id].score2);
		$('#edit_match').find('[name="penalty1"]').val(app.matches.data[id].penalty1);
		$('#edit_match').find('[name="penalty2"]').val(app.matches.data[id].penalty2);
		$('#edit_match').find('[name="date"]').val(app.matches.data[id].date);

		// populate the teams select lists
		populate_select_list($('#edit_match').find('[name="team1"]'),app.teams.data,'id','name');
		populate_select_list($('#edit_match').find('[name="team2"]'),app.teams.data,'id','name');
		$('#edit_match').find('[name="team1"]').val(app.matches.data[id].team1.id);
		$('#edit_match').find('[name="team2"]').val(app.matches.data[id].team2.id);
		
		// open the popup
		$(document).trigger('openPopup',['#edit_match']);
	});
	$(document).submit('#edit_match form',function(event){
		event.preventDefault();
		console.log(event);

		// populate the popup
		var id = $('#edit_match').find('[name="id"]').val();
		app.matches.put(id,{
			'team1':$('#edit_match').find('[name="team1"]').val(),
			'team2':$('#edit_match').find('[name="team2"]').val(),
			'score1':$('#edit_match').find('[name="score1"]').val(),
			'score2':$('#edit_match').find('[name="score2"]').val(),
			'penalty1':$('#edit_match').find('[name="penalty1"]').val(),
			'penalty2':$('#edit_match').find('[name="penalty2"]').val(),
			'date':$('#edit_match').find('[name="date"]').val()
		});

		// close the popup
		$(document).trigger('closePopup');
	});	
	// delete a team
	$(document).on('click tap','[data-view="matches"] [data-control="delete"]',function(event){
		var id = $(event.target).parent('[data-bind="match in data"]').attr('data-id');
		app.matches.del(id);
	});



////////////////////////////////////////////////////////////////////////////////
// Prono                                                                      //
////////////////////////////////////////////////////////////////////////////////
	$(document).on('getTeamsModel',function(event,data){
		console.log('getting teams');
		app.teams.get();
	});
	$(document).on('getMatchesModel',function(event,data){
		console.log('getting matches');
		app.matches.get();
	});
	$(document).on('getGroupstageModel',function(event,data){
		console.log('getting groupstage');
		app.groupstage.get();
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





////////////////////////////////////////////////////////////////////////////////
// Common functions                                                           //
////////////////////////////////////////////////////////////////////////////////
//populate select list
function populate_select_list(object,model,val,text){
	object.children().remove();
	$.each(model,function(index,value){
		object.append('<option value="'+value[val]+'">'+value[text]+'</option');
	});
}
