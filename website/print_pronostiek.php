<?php
	session_start();

	include('data/mysql.php');
	include('data/functions_display.php');
	include('data/functions_prono.php');
	include('data/teams.php');
	
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
	<body onload='window.print()'>";

	if(array_key_exists('userid',$_GET)){
		$query = "SELECT * FROM wk_users WHERE id=".$_GET['userid'];
	}
	else{
		$query = "SELECT * FROM wk_users";
	}

	$userresult = mysql_query($query) or die('Error: ' . mysql_error());	
	while($userrow = mysql_fetch_array($userresult)){

		$userid   = $userrow['id'];
		$username = $userrow['username'];
		
		echo "
			<article class='print'>
				<h1>$username Pronostiek Deel 1</h1>";
	
		$prono = 1;
		$round_enabled = array_fill (0 , count($phase_end_time) , 0 );
		
		include('data/groupstage.php');				
		
		include('data/progress.php');
		
		echo "			
				<h1>$username Pronostiek Deel 2</h1>";
				
		include('knockoutstage.php');
					
		echo "
			</article>
			<p style='page-break-before: always'></p>";
	}
	echo "
	</body>
</html>";
					
?>