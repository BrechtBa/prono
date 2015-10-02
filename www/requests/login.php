<?php
	session_start();
	include('../config/mysql.php');


	$status = 0;
	$user = 0;

	
	function loginuser($userid){
		$query = "SELECT * FROM users WHERE id='$userid'";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		if( mysql_num_rows($result) > 0 ){
		
			$dbuser = mysql_fetch_array($result);
			$user = array('username' => $dbuser['username'], 'id' => $dbuser['id']);

	
			$_SESSION['token'] = hash(HASH_ALGORITHM, SESSION_TOKEN.$_SERVER['HTTP_USER_AGENT'].session_id(),true);
			$_SESSION['userid'] = $user['id'];

		
			//$session_token = hash(HASH_ALGORITHM, SESSION_TOKEN.$_SERVER['HTTP_USER_AGENT'].session_id(),true);
			//if(hash_equals($session_token,$_SESSION['token']) && $_SESSION['userid'] > 0){ 
			//	//valid session
			//}
		}
		else{
			$user = 0;
		}
		return $user;
	}
	
	
	if(isset($_COOKIE['token'])) {
		// try authentication via a set cookie
		$array = explode(':',$_COOKIE['token'],2);
		$tokenid = $array[0];
		$token = $array[1];
		$hashtoken = base64_encode(hash(HASH_ALGORITHM, $token, true));
		
		$query = "SELECT * FROM auth_tokens WHERE id='$tokenid'";
		$result = mysql_query($query) or die('Error: ' . mysql_error());

		if( mysql_num_rows($result) > 0 ){
			$token = mysql_fetch_array($result);
			
			if( $hashtoken==$token['token'] ){	
				$user = loginuser($token['user_id']);
			}
		}
	}
	else{
		// the cookie is not set
		if( isset($_POST['username']) && isset($_POST['password']) ){
			// try authentication via the login form
			$username = $_POST['username'];
			
			// select the user from the table
			$query = "SELECT id,password FROM users WHERE username='$username'";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
			
			if( mysql_num_rows($result) > 0 ){
				$dbuser = mysql_fetch_array($result);
				
				// verify the user password
				if( base64_encode(hash(HASH_ALGORITHM, $_POST['password'], true))==$dbuser['password'] ){
				// passwordhash in db generated with
				//password_hash(base64_encode(hash(HASH_ALGORITHM, $_POST['password'], true)), PASSWORD_DEFAULT);
					
					$user = loginuser($dbuser['id']);
					$status = 1;
					
					// delete old auth_tokens
					$userid = $user['id'];
					$query = "DELETE FROM auth_tokens WHERE user_id='$userid'";
					$result = mysql_query($query) or die('MySQL Error: ' . mysql_error());

					// generate a new auth_token
					$token = base64_encode(openssl_random_pseudo_bytes(64));
					$hashtoken = base64_encode(hash(HASH_ALGORITHM, $token, true));
					$query = "INSERT INTO auth_tokens (token,user_id) VALUES ('$hashtoken','$userid')";
					$result = mysql_query($query) or die('MySQL Error: ' . mysql_error());

					$query = "SELECT LAST_INSERT_ID()";
					$result = mysql_query($query) or die('MySQL Error: ' . mysql_error());
					$tokenid = mysql_fetch_array($result);
					$tokenid = $tokenid[0];

					// set the token in a cookie
					$token = $tokenid.':'.$token;
					setcookie('token', $token, time()+(24*3600*365), '/');
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
	}
	echo json_encode( array('status' => $status, 'user' => $user) );

?>
