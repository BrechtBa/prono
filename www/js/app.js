var app = angular.module('app',[]);


////////////////////////////////////////////////////////////////////////////////
// Authentication                                                             //
////////////////////////////////////////////////////////////////////////////////
app.controller('MainController',['$scope', function($scope){
	$scope.user = {id:0,
				   username:''};
	
}]);


////////////////////////////////////////////////////////////////////////////////
// Authentication                                                             //
////////////////////////////////////////////////////////////////////////////////
app.controller('LoginController',['$scope','$http', function($scope,$http){
	$scope.username = '';
	$scope.password = '';
	$scope.login = function(username,password){
		console.log({username:$scope.username,password:$scope.password});
		
		$http({method:'POST', url:'/authenticate/login.php', data:{username:$scope.username,password:$scope.password}}).then(function(result){
			result = angular.toJson(result);
			if(result['status']>0){
				console.log(result);
				user.id = result.user.id;
				user.username = result.user.username;
				
			}
			else{
				console.log(result);
			}
		});
	}
}]);




////////////////////////////////////////////////////////////////////////////////
// Services                                                                   //
////////////////////////////////////////////////////////////////////////////////
app.factory('api',function($http){
	var api = {};
	api.get = function(url,callback){
		$http({method: 'GET',url:'/authenticate/index.php'}).then(function(result){
			result = angular.toJson(result);
			console.log(response.priveledge);
			console.log(response.token);
			
			$http({method:'GET',url:'/api/index.php/'.url,headers:{'api_token':response.token}}).then(callback(result));
		});
	}
	api.post = function(url,data,callback){
		$http({method: 'GET',url:'/authenticate/index.php'}).then(function(result){
			result = angular.toJson(result);
			console.log(response.priveledge);
			console.log(response.token);
			
			$http({method:'POST',url:'/api/index.php/'.url,data:data,headers:{'api_token':response.token}}).then(callback(result));
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