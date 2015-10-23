<?php
	include_once('mysql.php');
	include_once('hashfunctions.php');
	
	

	$status = 0;
	$token = '';
	
	// check if a valid token is sent in the header, if so renew the token
	$result = jwt_decode(getallheaders()['Authentication']);
	if( $result['status'] == 1 ){
	
		$payload = $result['payload'];
		$token = generate_token($payload['id'],$payload['username'],$payload['permission']);
		$status = 1;
		
	}
	elseif( isset($_POST['username']) && isset($_POST['password']) ){
		// try authentication via the login form
		$username = $_POST['username'];
		
		// select the user from the table
		$query = "SELECT * FROM users WHERE username='$username'";
		$result = mysql_query($query) or die('Error: ' . mysql_error());

		if( mysql_num_rows($result) > 0 ){
			$dbuser = mysql_fetch_array($result);
			
			// verify the user password
			if( create_hash($_POST['password'])==$dbuser['password'] ){
				
				// generate a token
				$token = generate_token($dbuser['id'],$dbuser['username'],$dbuser['permission']);
				$status = 1;
			}
			else{
				$status = -2;
			}
		}
		else{
			// user does not exist
			$status = -1;
		}
	}

	// return the status and token to the user
	echo json_encode( array('status' => $status, 'token' => $token) );
	
	
	
	
	
	
	
	
	
	// generate a token	
	function generate_token($id,$username,$permission){

		$time = time();
		$query = "SELECT * FROM matches WHERE date>=$time ORDER BY date";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		if( mysql_num_rows($result) > 0 ){
			$match = mysql_fetch_array($result);
			$stage = $match['stage'];
			$exp = $match['date']-3600;
		}
		else{
			// create a token at stage 100, valid for one day
			$stage = 100;
			$exp = time()+24*3600;
		}
		$payload = array('id' => $id, 'username' => $username, 'permission' => $permission, 'exp' => $exp, 'stage' => $stage);

		return jwt_encode($payload);
	}


?>
