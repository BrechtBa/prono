<?php

// file contains prono points counting functions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculate_group_prono($id){

	$points = count_correct_group_results($id)*3 + count_correct_group_scores($id)*4 + count_correct_group_passers($id)*2 + count_correct_group_winners($id)*4;
	
	return $points;
}
function calculate_prono($id){

	$goup_points = calculate_group_prono($id);
	
	$points_home_team = 0;
	$home_team_ranking = home_team_ranking($id);

	if($home_team_ranking==1){
		$points_home_team = 5;
	}
	elseif($home_team_ranking==2){
		$points_home_team = 10;
	}
	elseif($home_team_ranking==3){
		$points_home_team = 30;
	}
	elseif($home_team_ranking==4){
		$points_home_team = 50;
	}
	elseif($home_team_ranking==5){
		$points_home_team = 125;
	}
	elseif($home_team_ranking==6){
		$points_home_team = 200;
	}
	
	$points = $goup_points + count_correct_knockout_results($id)*6 + count_correct_knockout_scores($id)*12
	        + count_correct_round_entries($id,'quarter')*18 + count_correct_round_entries($id,'semi')*28 + count_correct_round_entries($id,'final')*48 + winner_correct($id)*60
			+ max(0,100-goal_difference($id)*6) + $points_home_team;

	return $points;
}





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function count_correct_group_scores($id){
	$number = 0;
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);
	
	// find all group matches where the score is correct
	$query = "SELECT * FROM wk_match WHERE id<49";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	
	while($row_match = mysql_fetch_array($result)) {
	
		if($row_match['score1'] >-1 && $row_user['match'.$row_match['id'].'_score1']>-1 && $row_user['match'.$row_match['id'].'_score2']>-1){
			if( ($row_user['match'.$row_match['id'].'_score1'] == $row_match['score1']) && ($row_user['match'.$row_match['id'].'_score2'] == $row_match['score2'])  ){
				$number++;
			}
		}
	}
	return $number;
}
function count_correct_knockout_scores($id){
	$number = 0;
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);
	
	// find all group matches where the score is correct
	$query = "SELECT * FROM wk_match WHERE id>48";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	
	while($row_match = mysql_fetch_array($result)) {
	
		if($row_match['score1'] >-1 && $row_user['match'.$row_match['id'].'_score1']>-1 && $row_user['match'.$row_match['id'].'_score2']>-1){
			if( ($row_user['match'.$row_match['id'].'_score1'] == $row_match['score1']) && ($row_user['match'.$row_match['id'].'_score2'] == $row_match['score2'])  ){
				$number++;
			}
		}
	}
	return $number;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function count_correct_group_results($id){
	$number = 0;
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);
	
	// find all group matches where the result correct
	$query = "SELECT * FROM wk_match WHERE id<49";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	
	while($row_match = mysql_fetch_array($result)) {
	
		if($row_match['score1'] >-1 && $row_user['match'.$row_match['id'].'_score1']>-1 && $row_user['match'.$row_match['id'].'_score2']>-1){
			if(  ($row_user['match'.$row_match['id'].'_score1']>$row_user['match'.$row_match['id'].'_score2']) && ($row_match['score1']>$row_match['score2'])  ){
				$number++;
			}
			elseif(  ($row_user['match'.$row_match['id'].'_score1']<$row_user['match'.$row_match['id'].'_score2']) && ($row_match['score1']<$row_match['score2'])  ){
				$number++;
			}
			elseif(  ($row_user['match'.$row_match['id'].'_score1']==$row_user['match'.$row_match['id'].'_score2']) && ($row_match['score1']==$row_match['score2'])  ){
				$number++;
			}
		}
	}
	return $number;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function count_correct_knockout_results($id){
	$number = 0;
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);
	
	// find all group matches where the result correct
	$query = "SELECT * FROM wk_match WHERE id>48";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	
	while($row_match = mysql_fetch_array($result)) {
	
		if($row_match['score1'] >-1 && $row_user['match'.$row_match['id'].'_score1']>-1 && $row_user['match'.$row_match['id'].'_score2']>-1){
			if(  ($row_user['match'.$row_match['id'].'_score1']>$row_user['match'.$row_match['id'].'_score2']) && ($row_match['score1']>$row_match['score2'])  ){
				$number++;
			}
			elseif(  ($row_user['match'.$row_match['id'].'_score1']<$row_user['match'.$row_match['id'].'_score2']) && ($row_match['score1']<$row_match['score2'])  ){
				$number++;
			}
			elseif(  ($row_user['match'.$row_match['id'].'_score1']==$row_user['match'.$row_match['id'].'_score2']) && ($row_match['score1']==$row_match['score2'])  ){
				$number++;
			}
		}
	}
	return $number;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function count_correct_group_passers($id){
	global $group_name;
	$number = 0;
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);

	$query = "SELECT * FROM wk_groups";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	while($row = mysql_fetch_array($result)){
	
		$winner = $row['winner'];
		$second = $row['second'];
		
		if($winner >-1 && $row_user['group'.$row['id'] .'_winner']>-1){
			if( $row_user['group'. $row['id'] .'_winner'] == $winner || $row_user['group'. $row['id'] .'_winner'] == $second ){
				$number++;
			}
		}
		if($winner >-1 && $row_user['group'. $row['id'] .'_second']>-1){
			if( $row_user['group'. $row['id'] .'_second'] == $second || $row_user['group'. $row['id'] .'_second'] == $winner ){
				$number++;
			}
		}
	}
	
	return $number;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function count_correct_group_winners($id){
	global $group_name;
	$number = 0;
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);

	// find all groups where the groupwinner is correct
	$query = "SELECT * FROM wk_groups";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	while($row = mysql_fetch_array($result)){
	
		$winner = $row['winner'];
		$second = $row['second'];
		
		if($winner >-1 && $row_user['group'. $row['id'] .'_winner']>-1){
			if( $row_user['group'. $row['id'] .'_winner'] == $winner ){
				$number++;
			}
		}
	}
	
	return $number;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function count_correct_round_entries($id,$round){
	$number = 0;
	
	// check if team in is in the prono
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);
		
	// find all matches in a round
	$query = "SELECT * FROM wk_match WHERE stage='$round'";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$num_matches = mysql_num_rows($result);
	while($row_match = mysql_fetch_array($result)) {
		$team1_found = 0;
		$team2_found = 0;
		
		for($i=1;$i<=2*$num_matches;$i++){
			if($row_user[$round.'_team'.$i]==$row_match['team1'] && $row_user[$round.'_team'.$i]>0 && $row_match['team1']>0){
				$team1_found = 1;
			}
			if($row_user[$round.'_team'.$i]==$row_match['team2'] && $row_user[$round.'_team'.$i]>0  && $row_match['team2']>0){
				$team2_found = 1;
			}
		}
		
		if($team1_found){
			$number++;
		}
		if($team2_found){
			$number++;
		}
	}

	return $number;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function winner_correct($id){
	$number = 0;
	
	// check if team in is in the prono
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);
		
	// find all matches in a round
	$query = "SELECT * FROM wk_match WHERE stage='final'";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_match = mysql_fetch_array($result);
	
	$winner = -1;
	if($row_match['score1']>$row_match['score2']){
		$winner = $row_match['team1'];
	}
	elseif($row_match['score2']>$row_match['score1']){
		$winner = $row_match['team2'];
	}
	elseif($row_match['score1p']>$row_match['score2p']){
		$winner = $row_match['team1'];
	}
	elseif($row_match['score2p']>$row_match['score1p']){
		$winner = $row_match['team2'];
	}
	
	
	if($row_user['winner']==$winner && $winner >0){
		$number = 1;
	}	
	
	return $number;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function goal_difference($id){
		
	// 
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);
	
	if($row_user['total_goals']<0){
		$total_goals = 10000;
	}
	else{
		$total_goals = $row_user['total_goals'];
	}
	
	// count the total number of goals
	$query = "SELECT * FROM wk_match";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	
	$actual_goals = 0;
	$match_played = 0;
	while($row = mysql_fetch_array($result)){
		if($row['score1']>=0){
			$actual_goals = $actual_goals + $row['score1'];
			$match_played = 1;
		}
		if($row['score2']>=0){
			$actual_goals = $actual_goals + $row['score2'];
			$match_played = 1;
		}
	}
	
	if($match_played==0){
		$actual_goals = -10000;
	}
	
	return abs($actual_goals-$total_goals);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function home_team_ranking($id){
	$home_team = 29;
	
	// 
	$query = "SELECT * FROM wk_users WHERE id=$id";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$row_user = mysql_fetch_array($result);
	
	// check the rank of the home team
	$query = "SELECT * FROM wk_match WHERE (team1=$home_team OR team2=$home_team)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$latest_match = 0;
	while($row = mysql_fetch_array($result)){
		$latest_match = $row['id'];
	}
	
	$answer = 0;
	if($latest_match<49){
		if($row_user['home_team_ranking']==17){
			$answer = 1;
		}
	}
	elseif($latest_match<57){
		if($row_user['home_team_ranking']==9){
			$answer = 2;
		}
	}
	elseif($latest_match<61){
		if($row_user['home_team_ranking']==5){
			$answer = 3;
		}
	}
	elseif($latest_match<63){
		if($row_user['home_team_ranking']==3){
			$answer = 4;
		}
	}
	elseif($latest_match==64){
	
		$query = "SELECT * FROM wk_match WHERE id=64";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		$row = mysql_fetch_array($result);
		
		if($row['team1']==$home_team && $row['score1'] + $row['score1p'] < $row['score2'] + $row['score2p']){
			if($row_user['home_team_ranking']==2){
				$answer = 5;
			}
		}
		elseif($row['team2']==$home_team && $row['score1'] + $row['score1p'] > $row['score2'] + $row['score2p']){
			if($row_user['home_team_ranking']==2){
				$answer = 5;
			}
		}
		else{
			if($row_user['home_team_ranking']==1){
				$answer = 6;
			}
		}
	}

	
	return $answer;
}
?>