<?php

///////////////////////////////////////////////////////////////////////////////
// Groupstage invullen
///////////////////////////////////////////////////////////////////////////////
if(array_key_exists('groupstage',$_POST)){
	// in pronostiek invullen
	if($prono){
		for($i=1;$i<=48;$i++){
			if($_POST['match'.$i.'_score1']==''){
				$score1 = -1;
			}
			else{
				$score1 = $_POST['match'.$i.'_score1'];
			}
			if($_POST['match'.$i.'_score2']==''){
				$score2 = -1;
			}
			else{
				$score2 = $_POST['match'.$i.'_score2'];
			}
			$query = "UPDATE wk_users SET match".$i."_score1=$score1, match".$i."_score2=$score2 WHERE id=$userid";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
			
		}
		for($i=1;$i<=8;$i++){
			$winner = $_POST['group'.$i.'_winner'];
			$second = $_POST['group'.$i.'_second'];
			$query = $query.", group".$i."_winner='".$winner."', group".$i."_second='".$second."'";
			$query = "UPDATE wk_users SET group".$i."_winner=$winner, group".$i."_second=$second WHERE id=$userid";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
		//echo "<meta http-equiv='refresh' content='0; URL=index.php?page=$page'>";
	}
	// in resultaten invullen
	else{
		for($i=1;$i<=48;$i++){
			if($_POST['match'.$i.'_score1']==''){
				$score1 = -1;
			}
			else{
				$score1 = $_POST['match'.$i.'_score1'];
			}
			if($_POST['match'.$i.'_score2']==''){
				$score2 = -1;
			}
			else{
				$score2 = $_POST['match'.$i.'_score2'];
			}
			$query = "UPDATE wk_match SET score1=$score1, score2=$score2 WHERE id=$i";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
		for($i=1;$i<=8;$i++){
			$winner = $_POST['group'.$i.'_winner'];
			$second = $_POST['group'.$i.'_second'];
			$query = $query.", group".$i."_winner='".$winner."', group".$i."_second='".$second."'";
			$query = "UPDATE wk_groups SET winner=$winner, second=$second WHERE id=$i";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
	}
}


///////////////////////////////////////////////////////////////////////////////
// Display Groupstage
///////////////////////////////////////////////////////////////////////////////
// There are 4 groupstage versions all handled by this file
// prono:  used to fill in the guess of all users: $prono = 1, $enabled = 1 , $admin = 0;
// disp:   used to show the guessed scores       : $prono = 1, $enabled = 0
// admin:  used to fill in the actual scores     : $prono = 0, $admin = 1;
// result: used to display the actual scores     : $prono = 0

$enabled = $round_enabled[0];
$enabled_str = "";

if($prono){
	// get scores the user submitted
	$query_prono  = "SELECT * FROM wk_users WHERE id='$userid'";
	$result_prono = mysql_query($query_prono) or die('Error: ' . mysql_error());
	$row_prono = mysql_fetch_array($result_prono);
}
if($admin){
	$enabled = 1;
}
if(!$enabled){
	$enabled_str = "readonly";
}



// echo the content
echo "
					<h2>Groepsfase</h2>";
		
// echo all groups
$query_group  = "SELECT * FROM wk_groups";
$result_group = mysql_query($query_group) or die('Error: ' . mysql_error());

while($row_group = mysql_fetch_array($result_group)){
	$groupid = $row_group['id'];

	echo "
					<div class='group'>
						<h3>Groep $group_name[$groupid]</h3>";
				
///////////////////////////////////////////////////////////////////////////////				
// echo all matches in the group 
///////////////////////////////////////////////////////////////////////////////
	$query_match = "SELECT * FROM wk_match WHERE stage=$groupid";
	$result_match = mysql_query($query_match) or die('Error: ' . mysql_error());
	while($row_match = mysql_fetch_array($result_match)){
		$matchid = $row_match['id'];
		
		if($prono){
			$score1 = $row_prono['match'.$row_match['id'].'_score1'];
			$score2 = $row_prono['match'.$row_match['id'].'_score2'];
		}
		else{
			$score1 = $row_match['score1'];
			$score2 = $row_match['score2'];
		}
		
		// create score strings
		$score1_str = get_score_str($score1);
		$score2_str = get_score_str($score2);

		// convert team numbers to names
		$team1_name_str = get_team_name($row_match['team1'],$row_match['id'],1);
		$team2_name_str = get_team_name($row_match['team2'],$row_match['id'],0);
		
		// convert team numbers to team code
		$team1_code_str = get_team_code($row_match['team1']);
		$team2_code_str = get_team_code($row_match['team2']);
		
		if($prono || $admin){
			// display score inside input field
			$input_score1_str = "<input type='text' name='match".$matchid."_score1' value='$score1_str' $enabled_str>";
			$input_score2_str = "<input type='text' name='match".$matchid."_score2' value='$score2_str' $enabled_str>";
		}
		else{
			// display score as text
			//$input_score1_str = "<div>$score1_str</div>";
			//$input_score2_str = "<div>$score2_str</div>";
			$input_score1_str = "<input type='text' name='match".$matchid."_score1' value='$score1_str' $enabled_str>";
			$input_score2_str = "<input type='text' name='match".$matchid."_score2' value='$score2_str' $enabled_str>";
		}
		
		// display match
		echo "
						<div>
							<div class='group_team_left'>
								$team1_name_str
							</div>
							<div class='group_center'>
								<img src='figures/flags/$team1_code_str.png'>
								$input_score1_str - $input_score2_str
								<img src='figures/flags/$team2_code_str.png'>
							</div>
							<div class='group_team_right'>
								$team2_name_str
							</div>
						</div>"; 		
	}
	
///////////////////////////////////////////////////////////////////////////////	
// echo group winners 
///////////////////////////////////////////////////////////////////////////////	
	if($prono){
		$groupwinner = $row_prono['group'.$groupid.'_winner']; 
		$groupsecond = $row_prono['group'.$groupid.'_second'];
	}
	else{
		$groupwinner = $row_group['winner']; 
		$groupsecond = $row_group['second'];
	}
	
	// create an array with all teams in a group
	$query_teams  = "SELECT * FROM wk_teams WHERE grp=$groupid";
	$result_teams  = mysql_query($query_teams ) or die('Error: ' . mysql_error());
	$i = 0;
	while($row_teams = mysql_fetch_array($result_teams)){
		$i++;
		$team_id_range[$i] = $row_teams['id'];
		$team_name_range[$i] = $row_teams['name']; 
	}
	
	// echo groupwinner and groupsecond
	echo "
						<div class='groupwinner'>
							Groepswinnaar:";
	if($prono || $admin){
		echo_select_list("group".$groupid."_winner",$enabled,array_merge((array)"",$team_name_range),array_merge((array)-1,$team_id_range),$groupwinner);				
	}
	else{
		echo_select_list("group".$groupid."_winner",$enabled,array_merge((array)"",$team_name_range),array_merge((array)-1,$team_id_range),$groupwinner);	
		//echo "
		//					<div>$groupwinner</div>";
	}
	echo "
						</div>
						<div class='groupwinner'>
							Groepstweede:";
	if($prono || $admin){
		echo_select_list("group".$groupid."_second",$enabled,array_merge((array)"",$team_name_range),array_merge((array)-1,$team_id_range),$groupsecond);
	}
	else{
		echo_select_list("group".$groupid."_second",$enabled,array_merge((array)"",$team_name_range),array_merge((array)-1,$team_id_range),$groupsecond);
		//echo "
		//					<div>$groupsecond</div>";
	}
	
	echo "
						</div>
					</div>";
}

?>