<?php
	session_start();
	include_once('../config/config.php');

	// password hashing
	function create_hash($password){
		return base64_encode(hash('sha256', $password.SALT, true));
	}
	
	// json web tokens
	function jwt_signature($header,$payload){
		return hash_hmac($header['alg'],base64_encode(json_encode($header)).'.'.base64_encode(json_encode($payload)),JWT_KEY);
	}
	function jwt_encode($payload){
		$header = array('alg' => 'SHA256', 'typ' => 'JWT');
		$signature =  jwt_signature($header,$payload);
		
		return base64_encode(json_encode($header)).'.'.base64_encode(json_encode($payload)).'.'.base64_encode(json_encode($signature));
	}
	function jwt_decode($token){
		$parts = explode('.',$token);
		$header = json_decode(base64_decode($parts[0]));
		$payload = json_decode(base64_decode($parts[1]));
		$signature = $parts[2];
		
		// verify the signature
		if($signature == jwt_signature($header,$payload)){
			return array('status' => 1, 'payload' =>$payload);
		}
		else{
			return array('status' => -1, 'payload' =>array());
		}
	}

	
?>
