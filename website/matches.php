<?php
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
		echo "<meta http-equiv='refresh' content='0; URL=index.php?page=$page&subpage=$subpage'>";
	}

	///////////////////////////////////////////////////////////////////////////////				
	echo "	
			<article>
				<a name='matches'></a>
				<h1>Wedstijden aanpassen</h1>
				<form class='prono' name='editmatch' action='index.php?page=$page&subpage=$subpage' method='post'>
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
				</form>
			</article>";		
?>