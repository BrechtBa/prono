<?php

	include_once('common.php');


	$url = '';
	$response_http = response_http(400);

	// get the upload directory
	$dir = '../' . $_POST['folder'];

	$filename = $_POST['filename'];
	$name = $_FILES['file']['name'];

	$target_path = $dir . $filename;


	if($target_path) {
		chmod($target_path,0755); //Change the file permissions if allowed
		unlink($target_path);     //remove the file
	}

	if(@move_uploaded_file($_FILES['file']['tmp_name'], $target_path)){
		$url = $target_path ;
		$response_http = response_http(200);
	}


	header(sprintf('HTTP/1.0 %s %s',$response_http['status'],$response_http['statusText']));
	echo json_encode($url);
?>

