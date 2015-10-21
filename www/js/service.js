
app.service = {};

////////////////////////////////////////////////////////////////////////////////
// API                                                                        //
////////////////////////////////////////////////////////////////////////////////
app.service.api = {
	location: '',
	get: function(apipath,callback){
		app.service.user.authenticate(function(result){		
			if(result.permission>0){
				$.ajax({
					type: 'GET',
					dataType: 'json',
					url: app.service.api.location+'api/index.php/'+apipath,
					headers: {'Authentication': result.api_token},
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
			}
		});
	},
	put: function(apipath,data,callback){
		app.service.user.authenticate(function(result){			
			if(result.permission>0){
				$.ajax({
					type: 'PUT',
					dataType: 'json',
					data: data,
					url: app.service.api.location+'api/index.php/'+apipath,
					headers: {'Authentication': result.api_token},
					success: function(result, textStatus, request){
						geturl = request.getResponseHeader('geturl');
						callback(result,geturl);
					},
					error: function(result){
						console.log(result);
					}
				});
			}
		});
	},
	post: function(apipath,data,callback){
		app.service.user.authenticate(function(result){			
			if(result.permission>0){
				$.ajax({
					type: 'POST',
					dataType: 'json',
					data: data,
					url: app.service.api.location+'api/index.php/'+apipath,
					headers: {'Authentication': result.api_token},
					success: function(result, textStatus, request){
						geturl = request.getResponseHeader('geturl');
						callback(result,geturl);
					},
					error: function(result){
						console.log(result);
					}
				});
			}
		});
	},
	delete: function(apipath,callback){
		app.service.user.authenticate(function(result){			
			if(result.permission>0){
				$.ajax({
					type: 'DELETE',
					dataType: 'json',
					url: app.service.api.location+'api/index.php/'+apipath,
					headers: {'Authentication': result.api_token},
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
		});
	}


};

////////////////////////////////////////////////////////////////////////////////
// User                                                                       //
////////////////////////////////////////////////////////////////////////////////
app.service.user = {
	id: -1,
	username: '',
	login: function(username,password){
		console.log('loggigng in');
		that = this;
		var data = {username:username,password:password};
		if(typeof username == "undefined"){
			data = {};
		}
		$.post('authenticate/login.php',data,function(result){
			result = JSON.parse(result);
			if(result.status>0){
				that.id = result.data.id;
				that.username = result.data.username;
				$(document).trigger('loggedin');
				window.location.hash = '#ranking';
			}
		});
	},
	logout: function(){
		that = this;
		$.post('authenticate/logout.php',{id:that.id},function(result){
			that.id = -1;
			that.username = '';
			$(document).trigger('loggedout');
			window.location.hash = '#login';
		});
	},
	authenticate: function(callback){
		$.get('authenticate/index.php',function(result){
			result = JSON.parse(result);
			callback(result);
		});
	},
	register: function(username,password,password2){
		that = this;
		$.post('authenticate/register.php',{username:username,password:password,password2:password2},function(result){
			console.log(result);
			result = JSON.parse(result);
				
			if(result['status']>0){
				that.login(username,password);
			}
			else{
				console.log(result);
			}
		});
	}
}

