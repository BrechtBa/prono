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
		$page = 'ranking';
	}

	$userid = $_SESSION['userid'];
	
	// create default handlers
	$admin = 0;
	$round_enabled = array_fill (0 , count($phase_end_time) , 0 );
	$subpage = "";
?>

<!DOCTYPE html> 
<html>
	<head>
		<title>3 fasen WK Pornostiek</title>

		<meta charset='utf-8'/>
		<meta name='viewport' content='width=device-width, initial-scale=1/>
		<meta name='apple-mobile-web-app-capable' content='yes' />
		<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
		<meta http-equiv='expires' content='0' />

		<link rel='icon' href='favicon.png'/>
		<link rel='apple-touch-icon' href='favicon.png' />
		<link rel='icon' href='favicon.ico' type='image/x-icon' />

		<!-- jquery mobile -->
		<link rel='stylesheet' href='jquery/jquery.mobile-1.4.4.min.css'/>
		<script src='jquery/jquery-1.11.0.min.js'></script>
		<script src='jquery/jquery.mobile-1.4.4.min.js'></script>
		
		
		<link rel='stylesheet' href='css/jquery.mobile.icons.min.css'/>
		<link rel='stylesheet' href='css/theme.css'/>
		<link rel='stylesheet' href='css/layout.css'/>
		
		<link rel='stylesheet' href='css/layout.css'/>
		<link rel='stylesheet' href='css/wk.css'/>
		<link rel='stylesheet' href='css/main.css'/>
		
		<script src='js/panel.js'></script>
		<script src='js/header.js'></script>
	</head>
	<body>
	
	
		<div id='ranking' data-role='page' data-theme='a'>
			<div data-role='content' class='ui-content'>
				<?php include('ranking.php'); ?>
			</div>
		</div>
	
	
	
		<div id='prono' data-role='page'>
			<div data-role='content' class='ui-content'>
				<?php include('prono.php'); ?>
			</div>
		</div>
		
		

		<div id='results' data-role='page'>
			<div data-role='content' class='ui-content'>
				<?php include('results.php'); ?>
			</div>
		</div>
		
		
		
		<div id='rules' data-role='page'>
			<div data-role='content' class='ui-content'>
				<?php include('rules.php'); ?>
			</div>
		</div>
		
		

		<div id='admin' data-role='page'>
			<div data-role='content' class='ui-content'>
				<?php include('admin.php'); ?>
			</div>
		</div>
		
		
		<div data-role='header' data-position='fixed'>
			<h1>3 Fasen Pronostiek</h1>
			<a class='ui-btn ui-btn-right ui-nodisc-icon ui-corner-all ui-btn-icon-notext ui-icon-bars' href='#navigation'>Navigation</a>
		</div>
		
		
		
		<div data-role='panel' data-display='overlay' data-position='right' data-theme='b' id='navigation'>
			<ul data-role='listview'>
				<li data-icon='false'><a data-transition='none' href='#prono'>Pronostiek</a></li>
				<li data-icon='false'><a data-transition='none' href='#results'>Resultaten</a></li>
				<li data-icon='false'><a data-transition='none' href='#ranking'>Rangschikking</a></li>
				<li data-icon='false'><a data-transition='none' href='#rules'>Regels</a></li>
				<li data-icon='false'><a data-transition='none' href='#admin'>Admin</a></li>
				<li data-icon='false'><a data-transition='none' href='#admin'>Logout</a></li>
			</ul>
		</div>
	</body>
</html>