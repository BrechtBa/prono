<?php
	session_start();

	include('data/mysql.php');
	include('data/functions_print.php');
	include('data/functions_prono.php');
	include('data/teams.php');

	$userid=$_GET['userid'];
	
	$query = "SELECT * FROM wk_users WHERE ID=$userid";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row = mysql_fetch_array($result);
	$username = $row['username'];
	
	///////////////////////////////////////////////////////////////////////////////
	// Pronostiek weergeven
	///////////////////////////////////////////////////////////////////////////////
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
	<body onload='window.print()'>
			<article class='print'>
				<h1>$username Pronostiek Deel 1</h1>";
	
	$prono = 1;
	$enabled = 0;
	if( time()<$phase1_end ){
		$enabled = 1;
	}
	
	
	include('groupstage.php');

	include('knockout_teams.php');
	
	echo "			
				<h1>$username Pronostiek Deel 2</h1>";
				
	$enabled = 1;			
	include('knockoutstage.php');
				
	echo "
				<form class='prono' name='print_pronostiek' action='print_pronostiek.php' target='_blank' method='post'>
					<div class='submit'><input type='submit' value='Print pronostiek'></div>
				</form>
			</article>
	</body>
</html>";
					
?>