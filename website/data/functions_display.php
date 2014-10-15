<?php

// file contains prono display functions


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function display_knockout_match($match,$enabled,$row_prono){
	global $team_name;
	global $team_code;
	global $userid;
		
	// get teams
	$query = "SELECT * FROM wk_match WHERE id=$match";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row = mysql_fetch_array($result);
	
	// convert team numbers to names
	$team1_str = get_team_name($row['team1'],$row['id'],1);
	$team2_str = get_team_name($row['team2'],$row['id'],0);

	if($row_prono != 0){
		// get prono score
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
		$enabled_str = "readonly";
	}
	
	echo "
						<li>
							<div class='cell'>
								<div class='match'>
	

									<div class='knockoutteam'>
										$team1_str
									</div>
									<div class='knockoutcenter'>
										<div class='match_number'>Match $match</div>
										<div class='match_score'><input type='text' name='match".$row['id']."_score1' value='$score1_str' $enabled_str> - <input type='text' name='match".$row['id']."_score2' value='$score2_str' $enabled_str></div>";
	// penaltys
	if($row_prono==0 && $enabled==1){
		echo "
										<div class='match_score'><input type='text' name='match".$row['id']."_score1p' value='$score1p_str' $enabled_str> - <input type='text' name='match".$row['id']."_score2p' value='$score2p_str' $enabled_str></div>";
	}
	else{
		if($score1p>=0){
		echo "
										<div class='match_score'>($score1p_str - $score2p_str)</div>";
		}
	}
								
	echo "
									</div>
									<div class='knockoutteam'>
										$team2_str
									</div>
								</div>
							</div>
						</li>";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function display_matches($enabled){
	global $team_name;
	global $team_code;
	global $group_name;
	global $teamspergroup;
	global $userid;
	
	$enabled_str = "readonly";
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
function get_team_name($team,$match,$home){
	global $team_name;
	global $default_team1_str;
	global $default_team2_str;
	
	if($team>0){
		$team_name_str = $team_name[$team];
	}
	else{
		if($home){
			$team_name_str = $default_team1_str[$match-1];
		}
		else{
			$team_name_str = $default_team2_str[$match-1];
		}
	}
	
	return $team_name_str;
}
function get_team_code($team){
	global $team_code;
	
	if($team>0){
		$team_code_str = $team_code[$team];
		//team_code[(int)$row['team1']]
	}
	else{
		$team_code_str = "";
	}

	return $team_code_str;
}
function get_score_str($score){
	$score_str = "";
	if($score>=0){
		$score_str = $score;	
	}
	return $score_str;
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
