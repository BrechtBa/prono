var app = angular.module('app',[]);


////////////////////////////////////////////////////////////////////////////////
// Authentication                                                             //
////////////////////////////////////////////////////////////////////////////////
app.controller('MainController',['$scope','api', function($scope,api){
	// user
	$scope.user = {
		id:0,
		username:''
	};
	// users
	$scope.get_users = function(){
		api.get('users',function(result){
			console.log(result);
		});
	}
	$scope.users = {
	};

	// dialog
	$scope.dialog = {
		content:'',
		show:function(){
			jQuery(document).trigger('openPopup','#dialog');
		}
	};
}]);


////////////////////////////////////////////////////////////////////////////////
// Login                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.controller('LoginController',['$scope','$http', function($scope,$http){
	$scope.username = '';
	$scope.password = '';
	
	$scope.login = function(username,password){
		console.log({username:$scope.username,password:$scope.password});
		
		$http({method:'POST', url:'authenticate/login.php', data:{username:$scope.username,password:$scope.password}}).then(
		function(result){
			result = angular.fromJson(result);
			if(result.data.status>0){
				$scope.user.id = result.data.user.id;
				$scope.user.username = result.data.user.username;
				
				window.location.hash = '#ranking';
				$scope.get_users();
			}
			else{
				console.log(result);
			}
		}).catch(
		function(error){
			console.log('Error: can not connect to the database');
			$scope.dialog.content = '<p>Error: can not connect to the database</p>';
			// timeout required as jquery isn't ready when the exception occurs
			setTimeout(function(){
				$scope.dialog.show();
			},1000);
		});
	}
	
}]);






////////////////////////////////////////////////////////////////////////////////
// Services                                                                   //
////////////////////////////////////////////////////////////////////////////////
// API
app.factory('api',function($http){
	var api = {};
	api.get = function(url,callback){
		$http({method: 'GET',url:'authenticate/index.php'}).then(function(result){
			result = angular.fromJson(result);
			console.log(result.data);
			console.log(result.data.priveledge);
			console.log(result.data.api_token);

			$http({method:'GET',url:'api/index.php/'+url,headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8','Authorization':result.data.api_token}}).then(function(result){
				console.log(result);				
				//callback(result)
			});
		});
	}
	return api;
});




/*
app.controller('userslist',function($scope){
	$scope.users = {1:{id:1,username:'BB'},2:{id:2,username:'test'}};
});



$http({method: 'GET',url: '/authenticate/index.php'}).then(function(result){
	result = angular.toJson(result);
	console.log(response.priveledge);
	console.log(response.token);
	
	$http({method: 'GET',url: '/api/index.php/users',headers: {'api_token': response.token}}).then(function(result){
	// do stuff 
	
	});
});
*/

/*
$http.get('users', {
	headers: { 'api_token': 'C3PO R2D2' }
}).success(function() { 
	
});

$http({method: 'GET',
       url: '/entity/'+id+'?access_token='+token,
	   headers: {'api_token': 'Bearer '+token}
}).then(function(response){
	// do stuff 
});
*/
