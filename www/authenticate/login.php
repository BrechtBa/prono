<?php
	session_start();
	include_once('mysql.php');
	include_once('hashfunctions.php');

	$status = 0;
	$token = '';
	
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
				
				$status = 1;

				// generate a JWT
				$payload = array('id' => $dbuser['id'],  'username' => $dbuser['username'], 'permission' => $dbuser['permission']);
				$token = jwt_encode($payload)
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

?>
