var app = angular.module('app',[]);


////////////////////////////////////////////////////////////////////////////////
// Authentication                                                             //
////////////////////////////////////////////////////////////////////////////////
app.controller('MainController',['$scope', function($scope){
	// user
	$scope.user = {
		id:0,
		username:''
	};
	//users


	//message
	$scope.message = {
		message:'',
		show:function(){
			jQuery(document).trigger('openPopup','#message');
		}
	};
}]);


////////////////////////////////////////////////////////////////////////////////
// Authentication                                                             //
////////////////////////////////////////////////////////////////////////////////
app.controller('LoginController',['$scope','$http', function($scope,$http){
	$scope.username = '';
	$scope.password = '';
	
	$scope.login = function(username,password){
		console.log({username:$scope.username,password:$scope.password});
		
		$http({method:'POST', url:'/authenticate/login.php', data:{username:$scope.username,password:$scope.password}}).then(
		function(result){
			console.log('success')
			result = angular.toJson(result);
			console.log(result)
			if(result['status']>0){
				console.log(result);
				$scope.user.id = result.user.id;
				$scope.user.username = result.user.username;
				
				window.location.hash = '#ranking';
			}
			else{
				console.log(result);
			}
		}).catch(
		function(error){
			console.log('error')
			$scope.message.message = 'Error: can not connect to the database';
			// timeout required as jquery isn't ready when the exception occurs
			setTimeout(function(){
				$scope.message.show();
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