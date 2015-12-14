<?php

	include_once('common.php');

	$token = '';
	$response_http = response_http(400);

	$post_data = json_decode(file_get_contents("php://input"),true);
	if( isset($post_data['login']) && isset($post_data['password']) ){

		$response_http = response_http(409);

		//connect to the database
		$db = new PDO('mysql:host='.MYSQL_HOST.';dbname='.MYSQL_DATABASE.';charset=utf8', MYSQL_USER, MYSQL_PASSWORD);
		// set the PDO error mode to exception
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$query = sprintf( "SELECT * FROM %s WHERE login='%s' AND password='%s'" ,AUTH_TABLE, $post_data['login'], create_hash($post_data['password']));

		$stmt = $db->query($query);
		$stmt->setFetchMode(PDO::FETCH_ASSOC);

		if( $user = $stmt->fetch() ){

			// parse the valid uri's to replace %s with the user id
			$user_valid_uri = [];
			foreach($valid_uri[ $user['permission'] ] as $request => $uri_list){
				$parsed_uri_list = [];
				foreach($uri_list as $uri){
					$parsed_uri_list[] = sprintf($uri,$user['id']);
				}
				$user_valid_uri[$request] = $parsed_uri_list;	
			}

			// parse the valid data to replace %s with the user id
			$user_valid_data = [];
			foreach($valid_data[ $user['permission'] ] as $key => $val){
				$user_valid_data[$key] = sprintf($val,$user['id']);
			}

			// set user data in the json web token
			$payload = ['user_id'=>$user['id'],'permission'=>$user['permission'],'valid_uri'=>$user_valid_uri,'valid_data'=>$user_valid_data];
			
			// add additional data to the json web token
			foreach($jwt_data as $key => $data){
				$payload[$key] = $data;
			}

			// generate a json web token
			$token = jwt_encode($payload);
			$response_http = response_http(201);

		}

		$db = null;
	}


	header('Content-Type: application/json; charset=utf-8');
	header(sprintf('HTTP/1.0 %s %s',$response_http['status'],$response_http['statusText']));

	echo json_encode($token);

?>
