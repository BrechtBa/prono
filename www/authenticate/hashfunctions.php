<?php
	session_start();
	include_once('../config/config.php');

	//
	function create_hash($password){
		return base64_encode(hash('sha256', $password.SALT, true));
	}
	//
	function generate_token(){
		return base64_encode(openssl_random_pseudo_bytes(64));
	}
	//

	function generate_session_token(){
		return base64_encode(hash('sha256', SESSION_TOKEN.$_SERVER['HTTP_USER_AGENT'].session_id(),true));
	}

?>
