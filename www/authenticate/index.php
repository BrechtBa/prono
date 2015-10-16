<?php
	session_start();	
	include_once('hashfunctions.php');

	$result = json_encode( array('permission' => -1, 'api_token' => -1) );

	if( isset($_SESSION['token']) && isset($_SESSION['id']) ){
		if( generate_session_token()==$_SESSION['token'] && $_SESSION['id']>0){ 
			$result = json_encode( array('permission' => $_SESSION['permission'], 'api_token' => generate_api_token()) );
		}
	}
	echo $result;
?>
