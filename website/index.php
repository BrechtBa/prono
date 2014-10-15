<?php
	session_start();
	
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	
	// functions
	include('data/mysql.php');
	include('data/functions_display.php');
	include('data/functions_prono.php');
	include('data/competition_data.php');
	
	if(array_key_exists('page',$_GET)){
		$page = $_GET['page'];
	}
	else{
		$page = 'home';
	}

	$userid = $_SESSION['userid'];
	
	echo "
<html>
	<head>
		<title>3 fasen WK Pornostiek</title>

		<meta charset='utf-8'/>
		<meta name='viewport' content='width=device-width, user-scalable=yes, initial-scale=1, maximum-scale=1.3, minimum-scale=1' />
		<meta name='apple-mobile-web-app-capable' content='yes' />
		<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
		<meta http-equiv='expires' content='0' />

		<link rel='icon' href='favicon.png'/>
		<link rel='apple-touch-icon' href='favicon.png' />
		<link rel='icon' href='favicon.ico' type='image/x-icon' />

		<link rel='stylesheet' type='text/css' href='css/layout.css'/>
		<link rel='stylesheet' type='text/css' href='css/wk.css'/>
		<link rel='stylesheet' type='text/css' href='css/main.css'/>
	</head>
	<body>";
	
// basic layout		
	echo "
		<div>
			<header>";
			
	include("header.php");

	echo "
			</header>
			<div class='content'>";
			
	include("$page.php");
		
	echo "
			</div>";

	echo"
		</div>";
	echo "		
	</body>
</html>";
	
?>	