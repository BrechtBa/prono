<?php		
// get team names and codes from database and put in array
$query = "SELECT * FROM wk_teams";
$result = mysql_query($query) or die('Error: ' . mysql_error());
while($row = mysql_fetch_array($result)) {
	$team_code[$row['id']] = $row['code'];
	$team_name[$row['id']] = $row['name'];
}

// groups
$query = "SELECT * FROM wk_groups";
$result = mysql_query($query) or die('Error: ' . mysql_error());
while($row = mysql_fetch_array($result)) {
	$group_name[$row['id']] = $row['name'];
}
	
// default team name strings	
for($i=1;$i<=count($group_name)*6;$i++){
	$default_team1_str[$i] = "";
	$default_team2_str[$i] = "";
}
$default_team1_str = array_merge($default_team1_str ,array("1A","1C","1B","1D","1E","1G","1F","1H"));
$default_team2_str = array_merge($default_team2_str ,array("2B","2D","2A","2C","2F","2H","2E","2G"));
$default_team1_str = array_merge($default_team1_str ,array("W49","W53","W51","W55"));
$default_team2_str = array_merge($default_team2_str ,array("W50","W54","W52","W56"));
$default_team1_str = array_merge($default_team1_str ,array("W57","W59"));
$default_team2_str = array_merge($default_team2_str ,array("W58","W60"));
$default_team1_str = array_merge($default_team1_str ,array("L61"));
$default_team2_str = array_merge($default_team2_str ,array("L62"));
$default_team1_str = array_merge($default_team1_str ,array("W61"));
$default_team2_str = array_merge($default_team2_str ,array("W62"));

// prono end phases
$phase_end_time = [strtotime("2014/06/12 20:59"),strtotime("2014/06/28 17:59"),strtotime("2014/07/04 17:59"),strtotime("2014/07/08 21:59"),strtotime("2014/07/12 21:59")];






?>