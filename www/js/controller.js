// JQuery wrapper
$(document).ready(function(){
	
	// try to login using a cookie
	$.post('requests/login.php',{},function(result){
		$(document).trigger('login',[{}]);
	});
	// try to login using the login form
	$('#login form').submit(function(event){
		event.preventDefault();
		var username = $(this).find('[name=username]').val();
		var password = $(this).find('[name=password]').val();
		$(document).trigger('login',[{username:username,password:password}]);
	});

	$('#register form').submit(function(event){
		event.preventDefault();
		var username = $(this).find('[name=username]').val();
		var password = $(this).find('[name=password]').val();
		var password2 = $(this).find('[name=password2]').val();
		back();

		$.post('requests/register.php',{username:username,password:password,password2:password2},function(result){
			if(result.status>0){
				$(document).trigger('login',[{username:username,password:password}]);
			}
			else{
				console.log(result);
			}
		});
	});


});

$(document).on('login',function(event,data){
	console.log(data);
	$.post('requests/login.php',data,function(result){
		console.log(result);
		if(result['status']>0){
			model.user = result['user'];
		}
	});
});


$.post('requests/authenticate.php',{},function(result){
	if(result==1){
		// user is authenticated, actions may be performed
		
	}
});
