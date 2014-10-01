<?php

// file contains World Cup display functions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function display_group_matches($group,$enabled,$userid){
	
	$enabled_str = "disabled";
	if($enabled){
		$enabled_str = "";
	}
	
	$query = "SELECT * FROM wk_match WHERE stage=$group";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	while($row = mysql_fetch_array($result)) {
		
		if($userid>0){
			// the prono of a user is displayed
			$query_prono  = "SELECT * FROM wk_users WHERE id='$userid'";
			$result_prono = mysql_query($query_prono) or die('Error: ' . mysql_error());
			$row_prono = mysql_fetch_array($result_prono);

			$score1 = $row_prono['match'.$row['id'].'_score1'];
			$score2 = $row_prono['match'.$row['id'].'_score2'];
		}
		else{
			$score1 = $row['score1'];
			$score2 = $row['score2'];
		}
		// create score strings
		$score1_str = get_score_str($score1);
		$score2_str = get_score_str($score2);

		// get team names
		$team1 = $row['team1'];
		$team2 = $row['team1'];
		
		$team1_name = get_team_name($row['team1'],$row['id'],1);
		$team1_code = get_team_code($row['team1']);
		
		$team2_name = get_team_name($row['team2'],$row['id'],2);
		$team2_code = get_team_code($row['team2']);
		
		// match weergeven
		echo "
				<div>
					<div class='group_team_left'>$team1_name</div>
					<div class='group_center'>
						<img src='figures/flags/$team1_code.png'>
						<input type='text' name='match".$row[id]."_score1' value='$score1_str' $enabled_str> - <input type='text' name='match".$row[id]."_score2' value='$score2_str' $enabled_str>
						<img src='figures/flags/$team2_code.png'>
					</div>
					<div class='group_team_right'>$team2_name</div>
				</div>"; 
	}
}	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function display_group_winners($group,$enabled,$userid){
	
	$enabled_str = "disabled";
	if($enabled){
		$enabled_str = "";
	}
	
	if($userid>0){
		// the prono of a user is displayed
		$query  = "SELECT * FROM wk_users WHERE id='$userid'";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		$row = mysql_fetch_array($result);
		
		$groupwinner = $row['group'.$group.'_winner']; 
		$groupsecond = $row['group'.$group.'_second'];
	}
	else{
	
		$query  = "SELECT * FROM wk_groups WHERE id='$group'";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		$row = mysql_fetch_array($result);
		
		$groupwinner = $row['winner']; 
		$groupsecond = $row['second'];		

	}
	
	$query  = "SELECT * FROM wk_teams WHERE grp=$group";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$i = 0;
	while($row = mysql_fetch_array($result)){
		$i++;
		$team_id_range[$i] = $row['id'];
		$team_name_range[$i] = $row['name']; 
	}
	
	echo "
				<div class='groupwinner'>
					Groepswinnaar:";
	
	echo_select_list("group".$group."_winner",$enabled,array_merge((array)"",$team_name_range),array_merge((array)-1,$team_id_range),$groupwinner);				

	echo "
				</div>
				<div class='groupwinner'>
					Groepstweede:";

	echo_select_list("group".$group."_second",$enabled,array_merge((array)"",$team_name_range),array_merge((array)-1,$team_id_range),$groupsecond);

	echo "
				</div>";
}	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function display_knockout_match($round,$match,$enabled,$userid){
		
	// get teams
	$query = "SELECT * FROM wk_match WHERE id=$match";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row = mysql_fetch_array($result);
	
	// convert team numbers to names
	$team1_name = get_team_name($row['team1'],$row['id'],1);
	$team2_name = get_team_name($row['team2'],$row['id'],2);

	if($userid>0){
		// get prono score
		$query_prono  = "SELECT * FROM wk_users WHERE id='$userid'";
		$result_prono = mysql_query($query_prono) or die('Error: ' . mysql_error());
		$row_prono = mysql_fetch_array($result_prono);
		
		$score1 = $row_prono['match'.$row['id'].'_score1'];
		$score2 = $row_prono['match'.$row['id'].'_score2'];
		$score1p = -1;
		$score2p = -1;
	}
	else{
		// get real score
		$score1 = $row['score1'];
		$score2 = $row['score2'];
		
		$score1p = $row['score1p'];
		$score2p = $row['score2p'];
	}
	// create score strings
	$score1_str = get_score_str($score1);
	$score2_str = get_score_str($score2);
	
	$score1p_str = get_score_str($score1p);
	$score2p_str = get_score_str($score2p);
	
	if($enabled){
		$enabled_str = "";
	}
	else{
		$enabled_str = "disabled";
	}
	
	echo "
						<div>
							<div class='ko_team'>
								$team1_name
							</div>
							<div class='ko_center $round'>
								<div class='match_number'>Match $match</div>
								<div class='match_score'>
									<input type='text' name='match".$row[id]."_score1' value='$score1_str' $enabled_str> - <input type='text' name='match".$row[id]."_score2' value='$score2_str' $enabled_str>
								</div>";
	// penaltys
	if($userid<=0 && $enabled){
		echo "
								<div class='match_score'>
									<input type='text' name='match".$row[id]."_score1p' value='$score1p_str' $enabled_str> - <input type='text' name='match".$row[id]."_score2p' value='$score2p_str' $enabled_str>
								</div>";
	}
	else{
		if($score1p>=0){
		echo "
								<div class='match_score'>($score1p_str - $score2p_str)</div>";
		}
	}
								
	echo "
							</div>
							<div class='ko_team'>
								$team2_name
							</div>
						</div>";
}











////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function display_team_selection($round,$enabled){
	global $team_name;
	global $userid;
		
	// pronostiek result is given
	$query  = "SELECT * FROM wk_users WHERE id='$userid'";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row = mysql_fetch_array($result);
	
	
	echo_select_list($round,$enabled,array_merge((array)"",$team_name),array_merge((array)-1,range(1,count($team_name))),$row[$round]);
	
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function print_matches($enabled){
	global $team_name;
	global $team_code;
	global $group_name;
	global $teamspergroup;
	global $userid;
	
	$enabled_str = "disabled";
	if($enabled){
		$enabled_str = "";
	}
	
	echo "
		<div class=table_heading>
			<div class='small'>Match number</div>
			<div class='small'>Round</div>
			<div class='small'>Date</div>
			<div class='wide'>Team 1</div>
			<div class='wide'>Team 2</div>
		</div>";
	
	$query = "SELECT * FROM wk_match'";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	
	while($row = mysql_fetch_array($result)) {
		
		if($prono){
			$query_prono  = "SELECT * FROM wk_users WHERE id='$userid'";
			$result_prono = mysql_query($query_prono) or die('Error: ' . mysql_error());
			$row_prono = mysql_fetch_array($result_prono);
			
			$score1 = $row_prono['match'.$row['id'].'_score1'];
			$score2 = $row_prono['match'.$row['id'].'_score2'];

		}
		else{
			$score1 = $row['score1'];
			$score2 = $row['score2'];
		}
		// create  score strings
		$score1_str = "";
		$score2_str = "";
		if($score1>=0){
			$score1_str = $score1;
		}
		if($score2>=0){
			$score2_str = $score2;
		}
		
		// convert team numbers to names
		$team1_str = get_team_str($row['team1'],$row['id'],1);
		$team2_str = get_team_str($row['team2'],$row['id'],0);
		
		$date_str = date( 'Y-m-d H:i:s', strtotime($row['date']) );
		// match weergeven
		echo "
				<div>
					<div class='small'>".$row['id']."</div>
					<div class='small'>".$row['round']."</div>
					<div class='small'>$date_str</div>
					<div class='wide'>$team1_str</div>
					<div class='wide'>$team2_str</div>
				</div>";
	}
}	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function get_score_str($score){
	$score_str = "";
	if($score>=0){
		$score_str = $score;	
	}
	return $score_str;
}
function get_team_name($team,$match,$home){
	global $default_team1_str;
	global $default_team2_str;
	
	if($team>0){
		$query_team = "SELECT * FROM wk_teams WHERE id='$team'";
		$result_team = mysql_query($query_team) or die('Error: ' . mysql_error());
		$row_team = mysql_fetch_array($result_team);
		$team_name = $row_team['name'];
		$team_code = $row_team['code'];
	}
	else{
		if($home==1){
			$team_name = $default_team1_str[$match-1];
		}
		else{
			$team_name = $default_team2_str[$match-1];
		}
	}
	return $team_name;
}
function get_team_code($team){
	global $default_team1_str;
	global $default_team2_str;
	
	if($team>0){
		$query_team = "SELECT * FROM wk_teams WHERE id='$team'";
		$result_team = mysql_query($query_team) or die('Error: ' . mysql_error());
		$row_team = mysql_fetch_array($result_team);
		$team_code = $row_team['code'];
	}
	else{
		$team_code = "";
	}
	return $team_code;
}



function echo_select_list($name,$enabled,$options,$values,$selected){
	
	$enabled_str = "disabled";
	if($enabled){
		$enabled_str = "";
	}
	echo "
				<select name='$name' $enabled_str>";
					
	for($i=0;$i<count($options);$i++){
		$selected_str = "";
		if($values[$i]==$selected){
			$selected_str = "selected='selected'";
		}
		echo "							
					<option value='".$values[$i]."' $selected_str>".$options[$i]."</option>";
	}
	echo "
				</select>";
}
?>