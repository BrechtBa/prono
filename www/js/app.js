var app = angular.module('app',['ngRoute']);

////////////////////////////////////////////////////////////////////////////////
// Routing                                                                    //
////////////////////////////////////////////////////////////////////////////////
app.config(['$routeProvider', '$locationProvider',function($routeProvider,$locationProvider) {
    $routeProvider
    .when('/login', {
		templateUrl: 'views/login.html',
        controller: 'LoginController'
    })
	.when('/ranking', {
		templateUrl: 'views/ranking.html',
		controller: 'RankingController'
    })
	.when('/prono', {
		templateUrl: 'views/prono.html',
		controller: 'PronoController'
    })
	.when('/rules', {
		templateUrl: 'views/rules.html',
		controller: 'RulesController'
    })
	.when('/users', {
		templateUrl: 'views/users.html',
		controller: 'UsersController'
    })
    .otherwise({
		redirectTo: '/login'
    });
    //$locationProvider.html5Mode(true); //Remove the '#' from URL.
}]);


////////////////////////////////////////////////////////////////////////////////
// Main controller                                                            //
////////////////////////////////////////////////////////////////////////////////
app.controller('MainController',['$scope','$location','api','user',function($scope,$location,api,user){
	
	// check if the user is logged in and redirect them to the login page otherwise
	$scope.$on('$routeChangeStart',function(event){
        if (user.priveledge < 1) {
            console.log('Access not allowed!');
			console.log(user);
            //event.preventDefault();
            $location.path('/login');
        }
    });
	
	// menu control
	$scope.showMenu = false;
	$scope.toggleMenu = function(){
		$scope.showMenu = !$scope.showMenu;
	};
}]);

////////////////////////////////////////////////////////////////////////////////
// Login                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.controller('LoginController',['$scope','$http','user', function($scope,$http,user){
	$scope.username = '';
	$scope.password = '';
	
	$scope.login = function(){
		
		console.log({username:$scope.username,password:$scope.password});
		//user.login(1,'BB',9,'jdshsd')
/*
		$http({method:'POST', url:'authenticate/login.php', data:{username:$scope.username,password:$scope.password}}).then(
		function(result){
			result = angular.fromJson(result);
			console.log(result.data);
			userid = result.data.user.id;
			username = result.data.user.username;
			if(result.data.status>0){
				// get the api token
				$http({method: 'GET',url:'authenticate/index.php'}).then(function(result){
					console.log(result.data);
					console.log(result.data.priveledge);
					console.log(result.data.api_token);
					user.login(userid,username,result.data.priveledge,result.data.api_token)
				});
			}
			else{
				console.log(result);
			}
		}).catch(
		function(error){
			console.log('Error: can not connect to the database');
		});*/
	}
	
	$scope.showRegister = false;
	$scope.toggleRegister = function(){
		$scope.showRegister = !$scope.showRegister;
	};
}]);

app.controller('RankingController',['$scope','api', function($scope,api){
	
}]);

app.controller('UsersController',['$scope','api', function($scope,api){
	
}]);

app.controller('PronoController',['$scope','api', function($scope,api){
	
}]);

////////////////////////////////////////////////////////////////////////////////
// Directives                                                                 //
////////////////////////////////////////////////////////////////////////////////
// panel
app.directive('panel', function() {
	var panel = {
		restrict: 'E',
		scope: {
			visible: '='
		},
		replace: true,    // Replace with the template below
		transclude: true, // we want to insert custom content inside the directive
		link: function(scope, element, attributes) {
			scope.hide = function() {
				scope.visible = false;
			};
		},
		templateUrl: 'views/panel.html'
	};
	return panel;
});

// popup
app.directive('popup', function() {
	var popup = {
		restrict: 'E',
		scope: {
			visible: '='
		},
		replace: true,    // Replace with the template below
		transclude: true, // we want to insert custom content inside the directive
		link: function(scope, element, attributes) {
			scope.hide = function() {
				scope.visible = false;
			};
		},
		templateUrl: 'views/popup.html'
	};
	return popup;
});


////////////////////////////////////////////////////////////////////////////////
// Services                                                                   //
////////////////////////////////////////////////////////////////////////////////
// API
app.factory('api',function($http,user){
	var api = {};
	api.get = function(url,callback){
		
		console.log(user.api_token)
		$http({method:'GET',url:'api/index.php/'+url,headers:{'Content-Type':'application/x-www-form-urlencoded;','Authorization': 'Basic '+user.api_token}}).then(function(result){
			console.log(result);				
			//callback(result)
		});
	}
	return api;
});
// User
app.factory('user',function($location){
	var user = {
		id:0,
		username:'',
		priveledge:0,
		api_token: ''
	};
	user.login = function(id,username,priveledge,api_token){
        user.id = id;
		user.username = username;
		user.priveledge = priveledge;
		user.api_token = api_token;
		
		$location.path('/ranking');
    }
	return user;
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
