
app.service = {};

////////////////////////////////////////////////////////////////////////////////
// API                                                                        //
////////////////////////////////////////////////////////////////////////////////
app.service.api = {
	location: '',
	get: function(apipath,callback){
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: app.service.api.location+'api/index.php/'+apipath,
			headers: {'Authentication': app.service.user.token},
			statusCode: {
				200: function(result){
					if (typeof(result.error) == 'undefined'){
						callback(result);
					}
					else{
						console.log(result);
						//callback({});
					}
				}
			},
			error: function(result){
				console.log(result);
			}
		});
	},
	put: function(apipath,data,callback){
		$.ajax({
			type: 'PUT',
			dataType: 'json',
			data: data,
			url: app.service.api.location+'api/index.php/'+apipath,
			headers: {'Authentication': app.service.user.token},
			success: function(result, textStatus, request){
				geturl = request.getResponseHeader('geturl');
				callback(result,geturl);
			},
			error: function(result){
				console.log(result);
			}
		});
	},
	post: function(apipath,data,callback){
		$.ajax({
			type: 'POST',
			dataType: 'json',
			data: data,
			url: app.service.api.location+'api/index.php/'+apipath,
			headers: {'Authentication': app.service.user.token},
			success: function(result, textStatus, request){
				geturl = request.getResponseHeader('geturl');
				callback(result,geturl);
			},
			error: function(result){
				console.log(result);
			}
		});
	},
	delete: function(apipath,callback){		
		$.ajax({
			type: 'DELETE',
			dataType: 'json',
			url: app.service.api.location+'api/index.php/'+apipath,
			headers: {'Authentication': app.service.user.token},
			statusCode: {
				200: function(result){
					callback(result);
				}
			},
			error: function(result){
				console.log(result);
			}
		});
	}


};

////////////////////////////////////////////////////////////////////////////////
// User                                                                       //
////////////////////////////////////////////////////////////////////////////////
app.service.user = {
	id: -1,
	username: '',
	permission: 0,
	token: '',
	login: function(){
		that = this;
		
		// check if the token exists in local storage
		var token = localStorage.getItem('token');
		if(token !== null){
			// get the data from the token
			var parts = token.split('.');
			
			var header = JSON.parse(atob(parts[0]));
			var payload = JSON.parse(atob(parts[1]));
			
			that.token = token;
			that.id = payload['id'];
			that.username = payload['username'];
			that.permission = payload['permission'];
			
			$(document).trigger('loggedin');
		}
	},
	logout: function(){
		that = this;
		that.id = -1;
		that.username = '';
		that.permission = 0;
		that.token = '';
		
		// clear local storage
		localStorage.clear();
	},
	formlogin: function(username,password){
		console.log('loggigng in');
		that = this;
		
		$.post('authenticate/login.php',{username:username,password:password},function(result){
			result = JSON.parse(result);
			if(result.status>0){
				// store the token in webstorage
				localStorage.setItem('token', result.token);
				that.login()
			}
		});
	},
	register: function(username,password,password2){
		that = this;
		$.post('authenticate/register.php',{username:username,password:password,password2:password2},function(result){
			console.log(result);
			result = JSON.parse(result);
				
			if(result['status']>0){
				that.formlogin(username,password);
			}
			else{
				console.log(result);
			}
		});
	}
}

