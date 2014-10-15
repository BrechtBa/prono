<?php
///////////////////////////////////////////////////////////////////////////////
// progress invullen
///////////////////////////////////////////////////////////////////////////////
if(array_key_exists('knockout_teams',$_POST)){
	// in pronostiek invullen
	if($prono){

		for($i=1;$i<=8;$i++){
			$team = $_POST['quarter_team'.$i];
			$query = "UPDATE wk_users SET quarter_team".$i."=$team WHERE id=$userid";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
		for($i=1;$i<=4;$i++){
			$team = $_POST['semi_team'.$i];
			$query = "UPDATE wk_users SET semi_team".$i."=$team WHERE id=$userid";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
		for($i=1;$i<=2;$i++){
			$team = $_POST['final_team'.$i];
			$query = "UPDATE wk_users SET final_team".$i."=$team WHERE id=$userid";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
		for($i=1;$i<=1;$i++){
			$team = $_POST['winner'];
			$query = "UPDATE wk_users SET winner=$team WHERE id=$userid";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
		
		///
		if($_POST['number']==''){
			$goals = -1;
		}
		else{
			$goals = $_POST['number'];
		}
		$query = "UPDATE wk_users SET total_goals=$goals WHERE id=$userid";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		
		///
		if($_POST['ranking']==''){
			$ranking = -1;
		}
		else{
			$ranking = $_POST['ranking'];
		}
		$query = "UPDATE wk_users SET home_team_ranking=$ranking WHERE id=$userid";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		//echo "<meta http-equiv='refresh' content='0; URL=index.php?page=$page'>";
	}
}



///////////////////////////////////////////////////////////////////////////////
// Display Progress
///////////////////////////////////////////////////////////////////////////////
// There are 2 progress versions all handled by this file
// prono:  used to fill in the guess of all users: $enabled = 1
// disp:   used to show the user guesses         : $enabled = 0

$enabled = $round_enabled[0];
$enabled_str = "";

if($enabled){
	// prono
}
else{
	// disp
	$enabled_str = "readonly";
}

// get user data
$query  = "SELECT * FROM wk_users WHERE id='$userid'";
$result = mysql_query($query) or die('Error: ' . mysql_error());
$row = mysql_fetch_array($result);
	
// which teams make it to the knockout stages
echo "
					<div class=ko1>
						<h1>Ploegen in de Kwartfinales:</h1>";	
						echo_select_list("quarter_team1",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["quarter_team1"]);
						echo_select_list("quarter_team2",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["quarter_team2"]);
						echo_select_list("quarter_team3",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["quarter_team3"]);
						echo_select_list("quarter_team4",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["quarter_team4"]);
						echo_select_list("quarter_team5",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["quarter_team5"]);
						echo_select_list("quarter_team6",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["quarter_team5"]);
						echo_select_list("quarter_team7",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["quarter_team6"]);
						echo_select_list("quarter_team8",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["quarter_team7"]);
						
echo "     
					</div>
					<div class=ko1>
						<h1>Ploegen in de Halve finales:</h1>";	
						echo_select_list("semi_team1",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["semi_team1"]);
						echo_select_list("semi_team2",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["semi_team2"]);
						echo_select_list("semi_team3",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["semi_team3"]);
						echo_select_list("semi_team4",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["semi_team4"]);

echo "     
					</div>
					<div class=ko1>
						<h1>Ploegen in de Finale:</h1>";
						echo_select_list("final_team1",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["final_team1"]);
						echo_select_list("final_team2",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["final_team2"]);
						
echo "     
					</div>
					<div class=ko1>
						<h1>Wereldkampioen:</h1>";
						echo_select_list("winner",$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row["winner"]);
						
echo "     
					</div>";
					
					
// what will be the total number of goals
$number_str = '';
if($row['total_goals']>=0){
	$number_str = $row['total_goals'];
}

echo "
					<div class=ko1>
						Totaal aantal goals:<br>
						<input name='number' value='$number_str' $enabled_str>
					</div>";
			

// in which round is the home team sent home				
echo "
			<div class=ko1>
				Hoe ver geraken de Rode Duivels:<br>";
					
echo_select_list('ranking',$enabled,array("","Groepsfase","8e finale"," Kwartfinale","Halve finale","Finale","Wereldkampioen"),array(-1,17,9,5,3,2,1),$row['home_team_ranking']);
echo "
			</div>";

			
					
?>