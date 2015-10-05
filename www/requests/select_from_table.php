<?php
	session_start();
	include('../config/mysql.php');

	$session_token = base64_encode(hash(HASH_ALGORITHM, SESSION_TOKEN.$_SERVER['HTTP_USER_AGENT'].session_id(),true));
	
	if($session_token==$_SESSION['token'] && $_SESSION['id'] > 0){ 
	
		$table = $_POST['table'];
		$column = $_POST['column'];
		$where = $_POST['where'];
		
		$query = "SELECT $column FROM $table WHERE $where";	
		$result = mysql_query($query) or die('MySQL Error: ' . mysql_error());

		
		$rows = array();
		while($row=mysql_fetch_array($result)){
			$rows[] = $row;
		}
		
		echo json_encode($rows);
	}
	else{
		echo 0;
	}
?>
