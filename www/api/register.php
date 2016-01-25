<?php

	include_once('common.php');

	$id = 0;
	$response_http = response_http(400);

	$post_data = json_decode(file_get_contents("php://input"),true);
	if( isset($post_data['login']) && isset($post_data['password']) ){

		//connect to the database
		$db = new PDO('mysql:host='.MYSQL_HOST.';dbname='.MYSQL_DATABASE.';charset=utf8', MYSQL_USER, MYSQL_PASSWORD);
		// set the PDO error mode to exception
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$query = sprintf( "SELECT count(*) FROM %s WHERE login='%s'" ,AUTH_TABLE,$post_data['login']);
		$stmt = $db->prepare($query);
		$stmt->execute();
		$numRows = $stmt->fetchColumn();	

		if( $numRows==0 ){

			// set the users permissions
			$query = sprintf( "SELECT count(*) FROM %s",AUTH_TABLE);
			$stmt = $db->prepare($query);
			$stmt->execute();
			$numUsers = $stmt->fetchColumn();	
			if($numUsers==0){
				$permission = ADMIN_PERMISSION;
			}
			else{
				$permission = DEFAULT_PERMISSION;
			}

			// add the user to the database
			// generate query
			$query = sprintf( "INSERT INTO %s (login,password,permission)  VALUES ('%s','%s','%s')" ,AUTH_TABLE,$post_data['login'],create_hash($post_data['password']),$permission );
			$id = $query;
			$stmt = $db->prepare($query);
			$stmt->execute();

			// get the last inserted id
			$stmt = $db->query( "SELECT LAST_INSERT_ID()" );
			$id = $stmt->fetch(PDO::FETCH_NUM);
			$id = $id[0];
			$response_http = response_http(201);
		}
		else{
			$id = -1;
			$response_http = response_http(409);
		}

		$db = null;
	}

	header('Content-Type: application/json; charset=utf-8');
	header(sprintf('HTTP/1.0 %s %s',$response_http['status'],$response_http['statusText']));
	echo json_encode($id);

?>

