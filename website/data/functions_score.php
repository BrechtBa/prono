<?php

// file contains World Cup score functions

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculate_group_points($team){
	$points = 0;
	$goal_difference = 0;
	$goal_scored = 0;
	$matches_played = 0;
	
	// find all group matches where team1 is $team
	$query = "SELECT * FROM wk_match WHERE team1=$team AND id<49";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	
	while($row = mysql_fetch_array($result)) {
		if($row['score1']>-1){
			$matches_played++;
		}
		if($row['score1']>$row['score2']){
			$points = $points+3;
		}
		elseif($row['score1']==$row['score2']){
			$points = $points+1;
		}
		$goal_difference = $goal_difference + $row['score1'] - $row['score2'];
		$goal_scored = $goal_scored + $row['score1'];
	}
	
	// find all group matches where team2 is $team
	$query = "SELECT * FROM wk_match WHERE team2=$team AND id<48";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	
	while($row = mysql_fetch_array($result)) {
		if($row['score2']>-1){
			$matches_played++;
		}
		if($row['score2']>$row['score1']){
			$points = $points+3;
		}
		elseif($row['score2']==$row['score1']){
			$points = $points+1;
		}
		$goal_difference = $goal_difference + $row['score2'] - $row['score1'];
		$goal_scored = $goal_scored + $row['score2'];
	}
	if($matches_played>0){
		$points_float = $points + $goal_difference/1e2 + $goal_scored/1e4;
	}
	else{
		$points_float = -1;
	}
	return $points_float;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculate_group_order($group){
	global $teamspergroup;

	// calculate float points for each team in the group
	// if all elements in $points_float are 0 there are no matches played and no preliminary order can be set
	$order_possible = 0;
	
	for($i=0;$i<$teamspergroup;$i++){
		$team[$i] = $group*$teamspergroup + $i;
		$points_float[$i] = calculate_group_points($team[$i]);
		if($points_float[$i] > -1){
			$order_possible = 1;
		}
	}

	
	if($order_possible){
		// sort float points
		array_multisort($points_float, $team);
		
		// check for exauquos
		for($i=0;$i<count($points_float);$i++){
			for($j=$i+1;$j<count($points_float);$j++){
				if($points_float[$i] == $points_float[$j]){
					// check if the group match between $team[$i] and $team[$j] has a winner
					$query = "SELECT * FROM wk_match WHERE (team1=$team[$i] AND team2=$team[$j]) AND id<49";
					$result = mysql_query($query) or die('Error: ' . mysql_error());
					$row = mysql_fetch_array($result);
					if($row['score1']>$row['score2']){
						$points_float[$i] = $points_float[$i] + 1/1e6;
					}
					elseif($row['score1']<$row['score2']){
						$points_float[$j] = $points_float[$j] + 1/1e6;
					}
					// check if the group match between $team[$i] and $team[$j] has a winner
					$query = "SELECT * FROM wk_match WHERE (team2=$team[$i] AND team1=$team[$j]) AND id<49";
					$result = mysql_query($query) or die('Error: ' . mysql_error());
					$row = mysql_fetch_array($result);
					if($row['score1']>$row['score2']){
						$points_float[$j] = $points_float[$j] + 1/1e6;
					}
					elseif($row['score1']<$row['score2']){
						$points_float[$i] = $points_float[$i] + 1/1e6;
					}
				
				}
			}
		}
		
		// ressort float points
		array_multisort($points_float, $team);
		$team = array_reverse($team);
		
		return $team;
		
	}
	else{
		return 0;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculate_group_winner($group){
	$team = calculate_group_order($group);
	if($team){
		return $team[0];
	}
	else{
		return -1;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function calculate_group_second($group){
	$team = calculate_group_order($group);
	if($team){
		return $team[1];
	}
	else{
		return -1;
	}
}

?>