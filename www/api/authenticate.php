<?php

	include_once('common.php');

	$payload = [];
	$token = '';
	$response_http = response_http(400);

	$post_data = json_decode(file_get_contents("php://input"),true);

	
	if( isset($post_data['login']) && isset($post_data['password']) ){
		// get the user credentials from the database
		$response_http = response_http(409);

		//connect to the database
		$db = new PDO('mysql:host='.MYSQL_HOST.';dbname='.MYSQL_DATABASE.';charset=utf8', MYSQL_USER, MYSQL_PASSWORD);
		// set the PDO error mode to exception
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$query = sprintf( "SELECT * FROM %s WHERE login='%s' AND password='%s'" ,AUTH_TABLE, $post_data['login'], create_hash($post_data['password']));

		$stmt = $db->query($query);
		$stmt->setFetchMode(PDO::FETCH_ASSOC);

		if( $user = $stmt->fetch() ){
			// set user data in the json web token
			$payload = ['user_id'=>$user['id'], 'login'=>$user['login'], 'permission'=>$user['permission']];

			// add expiration data
			foreach($expires as $key => $val){
				$payload[$key] = $val;
			}
		}
		$db = null;
	}
	else{
		// check if a token is supplied
		$result = jwt_decode(getallheaders()['Authentication']);
		if( $result['status'] < 0){
			// try lowercase, apparently chrome sends lowercase headers
			$result = jwt_decode(getallheaders()['authentication']);
		}

		
		if( $result['status'] == 1 && $result['exp'] <= time() ){
			// the token is valid and a new token can be requested
			$payload = [ 'user_id'=>$result['payload']['user_id'], 'login'=>$result['payload']['login']  , 'permission'=>$result['payload']['permission'] ];

			// add expiration data
			foreach($expires as $key => $val){
				$payload[$key] = $val;
			}
			// keep the old expiration date
			$payload['exp'] = $result['payload']['exp'];
		}
	}


	// add data to the token payload
	if( isset($payload['user_id']) ){

		// parse the valid uri's to replace %s with the user id
		$user_valid_uri = [];
		foreach($valid_uri[ $payload['permission'] ] as $key => $val){
			$parsed_uri_list = [];
			foreach($val as $uri){
				$parsed_uri_list[] = sprintf($uri,$payload['user_id']);
			}
			$user_valid_uri[$key] = $parsed_uri_list;	
		}
		$payload['valid_uri'] = $user_valid_uri;

		// parse the valid data to replace %s with the user id
		$user_valid_data = [];
		foreach($valid_data[ $payload['permission'] ] as $key => $val){
			$user_valid_data[$key] = sprintf($val,$payload['user_id']);
		}
		$payload['valid_data'] = $user_valid_data;

		// add additional data to the json web token
		foreach($jwt_data as $key => $data){
			$payload[$key] = $data;
		}

		// generate a json web token
		$token = jwt_encode($payload);
		$response_http = response_http(201);
	}

	header('Content-Type: application/json; charset=utf-8');
	header(sprintf('HTTP/1.0 %s %s',$response_http['status'],$response_http['statusText']));

	echo json_encode($token);

?>
