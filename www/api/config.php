<?php

	define("MYSQL_HOST", "localhost");
	define("MYSQL_USER", "prono");
	define("MYSQL_PASSWORD", "prono");
	define("MYSQL_DATABASE", "prono");
	define("PASSWORD_SALT", "prono");
	define("JWT_KEY", "prono");

	define("AUTH_TABLE", "users");
	define("ADMIN_PERMISSION", 9);   // 1st user to register when there are no users will recieve admin permissions
	define("DEFAULT_PERMISSION", 1);
	

	$exp = time()+60*24*3600;
	$db_exp = time()+1*3600;



	// JWT expiration
	// after the expiration time "exp" the JWT is no longer valid and the user must resupply their credentials
	// after the database expiration time "db_exp" batabase operations are no longer permitted but a new token can be requested using the current token as long as it has not expired
	$expires = ['exp' => $exp, 'db_exp' => $db_exp];



	// all uri's are checked to be allowed according to the values below and the user permission
    // the valid request strings will be parsed using sprintf( ,$user['id'])
	// '*' implies all requests are valid
	$valid_uri = [1 => ['POST' => ['table_b'], 
                        'GET' => ['teams','matches','groups','table_b/user_id/%s'],
                        'PUT' => ['table_b/user_id/%s'],
                        'DELETE' => ['table_b/user_id/%s']],
				  9 => ['POST' => ['*'],
						'GET' => ['*'],
					    'PUT' => ['*'],
					    'DELETE' => ['*']]
				 ];

	// post and put data is checked according to the values below and the user permission
	// when a key is encountered it must correspond to the allowable value
	// values are parsed using sprintf( ,$user['id'])
	$valid_data = [1 => ['user_id' => '%s'],
				   9 => []
                  ];


	// JWT data
	// data is placed in the jwt payload under the specified field
	// keys can not match "exp", "", "user_id", "permission", "valid_uri" or "valid_data"
	// example :
	// $jwt_data = ['mydata' => 5];
	$jwt_data = [];
?>
