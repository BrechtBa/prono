<?php
	session_start();
	include('../data/mysql.php');

	$session_token = hash(HASH_ALGORITHM, SESSION_TOKEN.$_SERVER['HTTP_USER_AGENT'].session_id(),true);
	if(hash_equals($session_token,$_SESSION['token']) && $_SESSION['userid'] > 0){ 
	
		$table = $_POST['table'];
		
		$column = $_POST['column'];
		$value = $_POST['value'];
		
		// insert into the table
		$query = "INSERT INTO $table ($column) VALUES ($value)";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		
		// return the last row
		$query = "SELECT LAST_INSERT_ID()";
		$result = mysql_query($query) or die('MySQL Error: ' . mysql_error());
		echo json_encode(mysql_fetch_array($result));
		
	}
?>