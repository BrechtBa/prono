

// JQuery wrapper
$(document).ready(function(){

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

	
	

	// start
	$(document).trigger('getTeamsModel');
	
	
	
	// test changing scores
	app.matches.put({id:1,team1:1,score1:5,team2:2,score2:1, date:100100});
	console.log(app.matches.data[1])
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

		$.post('authenticate/register.php',{username:username,password:password,password2:password2},function(result){
			result = JSON.parse(result);			
			if(result['status']>0){
				$(document).trigger('login',[{username:username,password:password}]);
			}
			else{
				console.log(result);
			}
		});
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

// close wrapper
});



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
