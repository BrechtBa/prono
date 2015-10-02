<?php
	session_start();
	include('../data/mysql.php');
	
	$session_token = hash(HASH_ALGORITHM, SESSION_TOKEN.$_SERVER['HTTP_USER_AGENT'].session_id(),true);
	if(hash_equals($session_token,$_SESSION['token']) && $_SESSION['userid'] > 0){ 
		
		$user_id = $_SESSION['user_id'];
		
		$table = $_POST['table'];
		$column = $_POST['column'];
		$value = $_POST['value'];
		$where = $_POST['where'];
		
		$column = explode(',', $column);
		$value  = explode(',', $value);
		
		// convert column, value pairs to column=value set
		$set = array();
		for($i=0;$i<count($column);$i++){
			if(is_string($value[$i])){
				$value[$i] = "'".$value[$i]."'";
			}
			$set[] = $column[$i].'='.$value[$i];
		}
		$set = implode( ',' $set);
		
		$query = "UPDATE $table SET $set WHERE $where";
		$result = mysql_query($query) or die('MySQL Error: ' . mysql_error());
		echo $result;
	}
?>