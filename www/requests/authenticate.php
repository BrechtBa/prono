<?php
	session_start();	
	include('../config/config.php');

	$session_token = base64_encode(hash(HASH_ALGORITHM, SESSION_TOKEN.$_SERVER['HTTP_USER_AGENT'].session_id(),true));

	if($session_token==$_SESSION['token'] && $_SESSION['id'] > 0){ 
		echo $_SESSION['priveledge'];
	}
	else{
		echo -1;
	}
?>
