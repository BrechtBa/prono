<?php
	session_start();

	include('data/mysql.php');
	include('data/functions_display.php');
	include('data/functions_prono.php');
	include('data/teams.php');

	$userid=$_GET['userid'];

	$query = "SELECT * FROM wk_users WHERE ID=$userid";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row = mysql_fetch_array($result);
	$username = $row['username'];
	
	$points_knockout = calculate_prono($userid)-calculate_group_prono($userid);
	
///////////////////////////////////////////////////////////////////////////////
// Detail berekening weergeven
///////////////////////////////////////////////////////////////////////////////
	echo "
<html>
	<head>
		<title>3 fasen WK Pronostiek</title>

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
	<body>
		<article>
			<h1>Details punten $username</h1>
			<h2>Punten groepsfase:</h2>
			<div class='table'>
				<div class='tiny'></div>
				<div class='tiny'>". count_correct_group_results($userid) ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>3</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_group_results($userid)*3 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>resultaten groepsfase</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'>". count_correct_group_scores($userid) ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>4</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_group_scores($userid)*4 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>scores groepsfase</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'>". count_correct_group_passers($userid) ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>2</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_group_passers($userid)*2 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>Doorstoters</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'>". count_correct_group_winners($userid) ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>4</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_group_winners($userid)*4 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>Groepswinnaars</div>
			</div>
			<div class='table'>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='wide'></div>
			</div>
			<div class='table'>
				<div class='tiny'></div>
				<div class='tiny'></div>
				<div class='tiny'></div>
				<div class='tiny'></div>
				<div class='tiny'></div>
				<div class='tiny'>". calculate_group_prono($userid) ."</div>
				<div class='tiny'></div>
				<div class='wide'></div>
			</div>		
			<h2>Punten Eliminatie fase:</h2>
			<div class='table'>
				<div class='tiny'></div>
				<div class='tiny'>". count_correct_knockout_results($userid) ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>6</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_knockout_results($userid)*6 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>resultaten knockoutsfase</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'>". count_correct_knockout_scores($userid) ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>8</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_knockout_scores($userid)*8 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>scores knockoutfase</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'>". count_correct_round_entries($userid,'quarter') ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>18</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_round_entries($userid,'quarter')*18 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>ploegen kwartfinales</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'>". count_correct_round_entries($userid,'semi') ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>28</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_round_entries($userid,'semi')*28 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>ploegen halvefinales</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'>". count_correct_round_entries($userid,'final') ."</div>
				<div class='tiny'>x</div>
				<div class='tiny'>48</div>
				<div class='tiny'> = </div>
				<div class='tiny'>". count_correct_round_entries($userid,'final')*48 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>ploegen finales</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'>". winner_correct($userid)*60 ."</div>
				<div class='tiny'> </div>
				<div class='wide'>Winnaar</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'>". max(0,100-goal_difference($userid)*6) ."</div>
				<div class='tiny'> </div>
				<div class='wide'>Aantal Goals</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'>". calculate_home_team_points($userid) ."</div>
				<div class='tiny'> </div>
				<div class='wide'>Rode duivels</div>
			</div>
			<div class='table'>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='wide'></div>
			</div>
			<div class='table'>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'>". $points_knockout ."</div>
				<div class='tiny'></div>
				<div class='wide'></div>
			</div>

			
			<h2>Totaal</h2>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'>". calculate_group_prono($userid) ."</div>
				<div class='tiny'> </div>
				<div class='wide'>Groepsfase</div>
			</div>
			<div class='table'>
				<div class='tiny'>+</div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'> </div>
				<div class='tiny'>". $points_knockout ."</div>
				<div class='tiny'> </div>
				<div class='wide'>Eliminatiefase</div>
			</div>
			<div class='table'>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='tiny'>_</div>
				<div class='wide'></div>
			</div>
			<div class='table'>
				<div class='tiny'></div>
				<div class='tiny'></div>
				<div class='tiny'></div>
				<div class='tiny'></div>
				<div class='tiny'></div>
				<div class='tiny'>". calculate_prono($userid) ."</div>
				<div class='tiny'></div>
				<div class='wide'></div>
			</div>
		</article>
	</body>
</html>";
					
?>