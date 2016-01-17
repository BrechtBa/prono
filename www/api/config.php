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
	


	// Perform actions to set the payload
	$exp = time()+60*24*3600;


	//connect to the database
	$db = new PDO('mysql:host='.MYSQL_HOST.';dbname='.MYSQL_DATABASE.';charset=utf8', MYSQL_USER, MYSQL_PASSWORD);
	// set the PDO error mode to exception
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// get the current stage
	$temp = [];
	$stage = -1;
	$db_exp = $exp;
	$tempstages = array(0, 16, 8, 4, 2);
	foreach( $tempstages as $tempstage){
		// check if all matches of the stage are in the future
		$query = sprintf( "SELECT count(*) FROM matches WHERE stage='%s'", $tempstage );
		$stmt = $db->prepare($query);
		$stmt->execute(); 
		$number1 = $stmt->fetchColumn();

		$query = sprintf( "SELECT count(*) FROM matches WHERE stage='%s' AND date>'%s'", $tempstage, time()+3600 );
		$stmt = $db->prepare($query);
		$stmt->execute(); 
		$number2 = $stmt->fetchColumn();

		if( $number1 == $number2 ){
			// set user data in the json web token
			$stage = $tempstage;
			
			// get the 1st match of the stage
			$query = sprintf( "SELECT * FROM matches WHERE stage='%s' ORDER BY date LIMIT 1" ,$tempstage );
			$stmt = $db->query($query);
			$stmt->setFetchMode(PDO::FETCH_ASSOC);
			if( $match = $stmt->fetch() ){
				$db_exp = $match['date']-1*3600;
			}
			break;
		}

	}

	// get all matches of the current stage
	$query = sprintf( "SELECT * FROM matches WHERE stage='%s'" ,$stage);
	$stmt = $db->query($query);
	$stmt->setFetchMode(PDO::FETCH_ASSOC);
	$matches = [];
	while($row = $stmt->fetch()){
		$matches[] = $row;
	}



	// close the database connection
	$db = null;

	

	// JWT data
	// data is placed in the jwt payload under the specified field
	// keys can not match "exp", "", "user_id", "permission", "valid_uri" or "valid_data"
	// example :
	// $jwt_data = ['mydata' => 5];
	$jwt_data = ['stage' => $stage];




	// JWT expiration
	// after the expiration time "exp" the JWT is no longer valid and the user must resupply their credentials
	// after the database expiration time "db_exp" batabase operations are no longer permitted but a new token can be requested using the current token as long as it has not expired
	$expires = ['exp' => $exp, 'db_exp' => $db_exp];



	// all uri's are checked to be allowed according to the values below and the user permission
    // the valid request strings will be parsed using sprintf( ,$user['id'])
	// '*' implies all requests are valid
	$put1 = [];

	$put1[] = 'user_profiles/user_id/%s';
	if($stage==0){
		$put1[] = 'prono_team/user_id/%s';
		$put1[] = 'prono_stage/user_id/%s';
		$put1[] = 'prono_number/user_id/%s';
	}	
	foreach( $matches as $match){
		$put1[] = 'prono_score/user_id/%s/match_id/'.$match['id'];
	}

	$valid_uri = [1 => ['POST' => ['prono_score','prono_team','prono_stage','prono_number','user_profiles'], 
                        'GET' => ['user_profiles','rules','teams','matches','groups','prono_score/user_id/%s','prono_team/user_id/%s','prono_stage/user_id/%s','prono_number/user_id/%s'],
                        'PUT' => $put1,
                        'DELETE' => ['']],
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
