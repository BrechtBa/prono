<?php

if(!$_SESSION['login'] || !($_SESSION['userid']==1)){
}
else{
	$userid = $_SESSION['userid'];

	if(array_key_exists('load_groupstage',$_POST) || array_key_exists('load_knockoutstage',$_POST) || array_key_exists('load_groupwinners',$_POST)){
		///////////////////////////////////////////////////////////////////////////////
		// Load scores from openfootball db
		///////////////////////////////////////////////////////////////////////////////
		include('data/load_matches.php');
	}
	if(array_key_exists('editmatch',$_POST)){
		///////////////////////////////////////////////////////////////////////////////
		// Update Matches
		///////////////////////////////////////////////////////////////////////////////
	
		$query = "SELECT * FROM wk_match";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		while($row = mysql_fetch_array($result)) {
			$id = $row['id'];
			$team1 = $_POST['match'.$row['id'].'_team1'];
			$team2 = $_POST['match'.$row['id'].'_team2'];

			if($_POST['match'.$row['id'].'_date']!="dd-mm-yyyy HH:MM"){
				$date = date( 'Y-m-d H:i:s', strtotime($_POST['match'.$row['id'].'_date']) );
			}
			else{
				$date = "0000-00-00 00:00:00";
			}
			
			$query_update = "UPDATE wk_match SET team1='$team1', team2='$team2',date='$date' WHERE id=$id";
			$result_update = mysql_query($query_update) or die('Error: ' . mysql_error());
		}
	}
	if(array_key_exists('edituser',$_POST)){
		///////////////////////////////////////////////////////////////////////////////
		// Remove users
		///////////////////////////////////////////////////////////////////////////////
		
		$query = "SELECT * FROM wk_users";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		while($row = mysql_fetch_array($result)){
			$id = $row['id'];
			if($_POST['remove_user'.$id]){
				$query_remove = "DELETE FROM wk_users WHERE id=$id";
				$result_remove = mysql_query($query_remove) or die('Error: ' . mysql_error());
			}
		}
	}
	if(array_key_exists('editteams',$_POST)){
		///////////////////////////////////////////////////////////////////////////////
		// Edit teams
		///////////////////////////////////////////////////////////////////////////////
		
		$query = "SELECT * FROM wk_teams";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		while($row = mysql_fetch_array($result)){
			$id = $row['id'];
			$name = $_POST['name'.$row['id']];
			$code = $_POST['code'.$row['id']];
			
			$query_update = "UPDATE wk_teams SET name='$name', code='$code' WHERE id=$id";
			$result_update = mysql_query($query_update) or die('Error: ' . mysql_error());
			
		}
		echo "<meta http-equiv='refresh' content='0; URL=index.php?page=admin'>";
	}
	
	
	
	///////////////////////////////////////////////////////////////////////////////
	// Pagina weergeven
	///////////////////////////////////////////////////////////////////////////////
	echo "
			<article>
				<h1>Admin</h1>";

	///////////////////////////////////////////////////////////////////////////////			
	echo "
				<a name='results'></a>
				<h1>Resultaten aanpassen</h1>";
	$prono = 0;
	$enabled = 1;
	
	echo "
				<form class='prono' name='loaddata' action='index.php?page=admin' method='post'>
					<div class='submit'>
						<input type='submit' value='Groepsfase resultaten laden' name='load_groupstage'>
						<input type='submit' value='Groepswinnaars bepalen' name='load_groupwinners'>
						<input type='submit' value='Eliminatie fase resultaten laden' name='load_knockoutstage'>
					</div>
				</form>";
				
	include('groupstage.php');
	include('knockoutstage.php');
	
	
	///////////////////////////////////////////////////////////////////////////////				
	echo "	
				<a name='matches'></a>
				<h1>Wedstijden aanpassen</h1>
				<form class='prono' name='editmatch' action='index.php?page=admin' method='post'>
					<div class='table table_heading'>
						<div class='small'>Match nr</div>
						<div class='small'>Ronde</div>
						<div class='small'>Team 1</div>
						<div class='small'>Team 2</div>
						<div class='small'>Datum</div>
					</div>";
	
	$query = "SELECT * FROM wk_match";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	while($row = mysql_fetch_array($result)) {
		// possible entries for teams
		$date = $row['date'];
		if($date=="0000-00-00 00:00:00"){;
			$date = "dd-mm-yyyy HH:MM";
		}
		else{
			$date = date( 'd-m-Y H:i', strtotime($date) );
		}
		
		echo "
		
					<div class='table'>
						<div class='small'>".$row['id']."</div>
						<div class='small'>".$row['stage']."</div>
						<div class='small'>";	
		echo_select_list('match'.$row['id'].'_team1',1,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row['team1']);

		echo "			
						</div>
						<div class='small'>";
						
		echo_select_list('match'.$row['id'].'_team2',1,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row['team2']);
		echo "				
						</div>
						<div class='small'>
							<input type='datetime' name='match".$row['id']."_date' value='".$date."'>
						</div>
					</div>";
	}
	echo "
					<div class='submit'><input type='submit' value='Verzenden' name='editmatch'></div>
				</form>";		
				
	///////////////////////////////////////////////////////////////////////////////			
	echo "		
				<a name='users'></a>
				<h1>Gebruikers beheren</h1>
				<form class='prono' name='edituser' action='index.php?page=admin' method='post'>
					<div class='table table_heading'>
						<div class='wide'>Naam</div>
						<div class='small'>Remove</div>
						<div class='small'></div>
					</div>";
					
	$query = "SELECT * FROM wk_users";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	// echo user 1 without remove button
	$row = mysql_fetch_array($result);
	echo "
					<div class='table'>
						<div class='wide'>".$row['username']."</div>
						<div class='small'></div>
						<div class='small'><a href='print_pronostiek.php?userid=".$row['id']."' target='_blank'>print</a></div>
					</div>";
					
	while($row = mysql_fetch_array($result)) {
		
		echo "
					<div class='table'>
						<div class='wide'>".$row['username']."</div>
						<div class='small'><input type='checkbox' name='remove_user".$row['id']."' value=1></div>
						<div class='small'><a href='print_pronostiek.php?userid=".$row['id']."' target='_blank'>print</a></div>
					</div>";
	}		
	echo "				
					<div class='submit'><input type='submit' value='Verzenden' name='edituser'></div>
				</form>
				<a href='print_pronostiek_all.php' target='_blank'>print all</a><br>
				<a href='print_pronostiek1_all.php' target='_blank'>print deel 1</a><br>
				<a href='print_pronostiek2_all.php' target='_blank'>print deel 2</a><br>";

				
	///////////////////////////////////////////////////////////////////////////////			
	echo "			
				<a name='teams'></a>
				<h1>Ploegen aanpassen</h1>					
				<form class='prono' name='editteams' action='index.php?page=admin' method='post'>
					<div class='table table_heading'>
						<div class='small'>Team Nr</div>
						<div class='small'>Group Nr</div>
						<div class='wide'>Team name</div>
						<div class='wide'>Team_code</div>
					</div>";
		
	$query = "SELECT * FROM wk_teams";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	while($row = mysql_fetch_array($result)) {
		
		echo "
		
					<div class='table'>
						<div class='small'>".$row['id']."</div>
						<div class='small'>".$group_name[$row['grp']].(($row['id']-1)%$teamspergroup+1)."</div>
						<div class='wide'><input name='name".$row['id']."' value='".$row['name']."'></div>
						<div class='wide'><input name='code".$row['id']."' value='".$row['code']."'></div>
					</div>";
	}
	echo "
					<div class='submit'><input type='submit' value='Verzenden' name='editteams'></div>
				</form>";



	echo "
			</article>";			
}
?>