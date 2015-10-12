



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
		$('#edit_team').find('[name="name"]').val(app.teams.data[id].name);
		$('#edit_team').find('[name="abr"]').val(app.teams.data[id].abr);
		$('#edit_team').find('[name="icon"]').val(app.teams.data[id].icon);

		// open the popup
		$(document).trigger('openPopup',['#edit_team']);
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














	
/*
////////////////////////////////////////////////////////////////////////////////
// Login                                                                      //
////////////////////////////////////////////////////////////////////////////////
	// try to login using a cookie
	$(document).trigger('login',[{}]);

	// try to login using the login form
	$('#login form').submit(function(event){
		event.preventDefault();
		var username = $(this).find('[name=username]').val();
		var password = $(this).find('[name=password]').val();
		$(document).trigger('login',[{username:username,password:password}]);
	});

////////////////////////////////////////////////////////////////////////////////
// Register                                                                   //
////////////////////////////////////////////////////////////////////////////////
	$('#register form').submit(function(event){
		event.preventDefault();
		var username = $(this).find('[name=username]').val();
		var password = $(this).find('[name=password]').val();
		var password2 = $(this).find('[name=password2]').val();
		app.navigation.back();

		
	});

////////////////////////////////////////////////////////////////////////////////
// Logout                                                                     //
////////////////////////////////////////////////////////////////////////////////
	$(document).on('click tap','[data-control="logout"]',function(event){
		$.post('authenticate/logout.php',{id:app.model.user.id},function(result){
			if(result>0){
				app.model.user.unset();
				app.navigation.go('#login')
			}
		});
	});


////////////////////////////////////////////////////////////////////////////////
// Users                                                                      //
////////////////////////////////////////////////////////////////////////////////
	$(document).on('click tap','[data-template="users"] [data-control="delete"]',function(event){
		var id = $(event.target).parent('[data-id]').attr('data-id');
		app.model.users.del(id);
	});



*/



////////////////////////////////////////////////////////////////////////////////
// reoccurring functions                                                      //
////////////////////////////////////////////////////////////////////////////////
$(document).on('login',function(event,data){
	$.post('authenticate/login.php',data,function(result){
		result = JSON.parse(result);
		if(result['status']>0){
			app.model.user.set(result['user']);
			app.navigation.go('#ranking')
		}
	});
});
