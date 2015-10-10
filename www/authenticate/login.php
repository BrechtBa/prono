<?php
	session_start();
	include_once('../config/mysql.php');
	include_once('hashfunctions.php');

	$status = 0;
	$user = 0;

	
	function loginuser($userid){
		$query = "SELECT * FROM users WHERE id='$userid'";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		if( mysql_num_rows($result) > 0 ){
		
			$dbuser = mysql_fetch_array($result);
			$user = array('username' => $dbuser['username'], 'id' => $dbuser['id']);

	
			$_SESSION['token'] = generate_session_token();
			$_SESSION['id'] = $dbuser['id'];
			$_SESSION['priveledge'] = $dbuser['priveledge'];
		
			
			//if(generate_session_token()==$_SESSION['token'] && $_SESSION['id'] > 0){ 
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
		
		$query = "SELECT * FROM auth_tokens WHERE id='$tokenid'";
		$result = mysql_query($query) or die('Error: ' . mysql_error());

		if( mysql_num_rows($result) > 0 ){
			$dbtoken = mysql_fetch_array($result);
			
			if( create_hash($token) == $dbtoken['token'] ){	
				$user = loginuser($dbtoken['user_id']);
				$status = 1;
			}
		}
	}

	if($status==0){
		// the cookie is not set or wrong
		if( isset($_POST['username']) && isset($_POST['password']) ){
			// try authentication via the login form
			$username = $_POST['username'];
			
			// select the user from the table
			$query = "SELECT id,password FROM users WHERE username='$username'";
			$result = mysql_query($query) or die('Error: ' . mysql_error());

			if( mysql_num_rows($result) > 0 ){
				$dbuser = mysql_fetch_array($result);
				
				// verify the user password
				if( create_hash($_POST['password'])==$dbuser['password'] ){
					
					$user = loginuser($dbuser['id']);
					$status = 1;
					
					// delete old cookie_tokens
					$userid = $user['id'];
					$query = "DELETE FROM auth_tokens WHERE user_id='$userid'";
					$result = mysql_query($query) or die('MySQL Error: ' . mysql_error());

					// generate a new auth_token
					$token = generate_cookie_token();
					$hashtoken = create_hash($token);
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
