<?php
///////////////////////////////////////////////////////////////////////////////
// knockout teams invullen
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
// knockout teams weergeven
///////////////////////////////////////////////////////////////////////////////
if($enabled){
	$enabled_str = "";
}
else{
	$enabled_str = "disabled";
}

echo "
		<form class='prono' name='knockout_teams' action='index.php?page=$page' method='post'>
			<div class=ko1>
				Ploegen in de Kwartfinales:<br>";
					
print_team_selection("quarter_team1",$enabled);
print_team_selection("quarter_team2",$enabled);
print_team_selection("quarter_team3",$enabled);
print_team_selection("quarter_team4",$enabled);
print_team_selection("quarter_team5",$enabled);
print_team_selection("quarter_team6",$enabled);
print_team_selection("quarter_team7",$enabled);
print_team_selection("quarter_team8",$enabled);

echo "     
			</div>
			<div class=ko1>
				Ploegen in de Halve finales:<br>";
					
print_team_selection("semi_team1",$enabled);
print_team_selection("semi_team2",$enabled);
print_team_selection("semi_team3",$enabled);
print_team_selection("semi_team4",$enabled);
			
echo "     
			</div>
			<div class=ko1>
				Ploegen in de Finale:<br>";
					
print_team_selection("final_team1",$enabled);
print_team_selection("final_team2",$enabled);

echo "     
			</div>
			<div class=ko1>
				Wereldkampioen:<br>";
					
print_team_selection("winner",$enabled);

echo "     
			</div>";

		
$query  = "SELECT * FROM wk_users WHERE id='$userid'";
$result = mysql_query($query) or die('Error: ' . mysql_error());
$row = mysql_fetch_array($result);
///////////////////////////////////////////////////////////////////////////////
// total goals weergeven
///////////////////////////////////////////////////////////////////////////////	
$number_str = '';
if($row['total_goals']>=0){
	$number_str = $row['total_goals'];
}

echo "
			<div class=ko1>
				Totaal aantal goals:<br>
				<input name='number' value='$number_str' $enabled_str>
			</div>";
			
///////////////////////////////////////////////////////////////////////////////
// home team ranking weergeven
///////////////////////////////////////////////////////////////////////////////				
echo "
			<div class=ko1>
				Hoe ver geraken de Rode Duivels:<br>";
					
echo_select_list('ranking',$enabled,array("","Groepsfase","8e finale"," Kwartfinale","Halve finale","Finale","Wereldkampioen"),array(-1,17,9,5,3,2,1),$row['home_team_ranking']);
echo "
			</div>";

			
			
if($prono || $enabled){
	echo "
			<div class='submit'><input type='submit' value='Verzenden' name='knockout_teams' $enabled_str></div>";
}
echo "	
		</form>";
?>