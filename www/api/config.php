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
	

	// JWT data
	// data is placed in the jwt payload under the specified field
	// example :
	// $jwt_data = ['exp' => time()+24*3600];
	$jwt_data = ['exp' => time()+24*3600];


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

?>
