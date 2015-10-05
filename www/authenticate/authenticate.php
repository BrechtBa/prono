<?php
	session_start();	
	include_once('../config/config.php');
	include_once('hashfunctions.php');

	if( generate_session_token() ==$_SESSION['token'] && $_SESSION['id'] > 0){ 
		echo $_SESSION['priveledge'];
	}
	else{
		echo -1;
	}
?>
