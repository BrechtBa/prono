<?php
	session_start();
	include('../config/mysql.php');


	$status = 0;

	if( isset($_POST['id']) ){

		$userid = $_POST['id'];
		$query = "DELETE FROM auth_tokens WHERE user_id='$userid'";
		$result = mysql_query($query) or die('MySQL Error: ' . mysql_error());
		unset($_COOKIE['token']);
		setcookie('token', null, -1, '/');
		$status = 1;
	}
	
	echo $status;

?>
