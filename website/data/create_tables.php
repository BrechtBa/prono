<?php
include('mysql.php');

if($_SESSION['userid']==1){
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// teams
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	mysql_query("DROP TABLE wk_teams") or die('Error: ' . mysql_error());
	$query = "CREATE TABLE wk_teams(id TINYINT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(128),code VARCHAR(128),grp TINYINT)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	//2014 data
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Brazili&euml;','BRA',1)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Kroati&euml;','CRO',1)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Mexico','MEX',1)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Kameroen','CMR',1)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Spanje','ESP',2)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Nederland','NED',2)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Chili','CHI',2)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Australi&euml;','AUS',2)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Colombia','COL',3)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Griekenland','GRE',3)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Ivoorkust','CIV',3)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Japan','JPN',3)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Uruguay','URU',4)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Costa Rica','CRC',4)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Engeland','ENG',4)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Itali&euml;','ITA',4)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Zwitserland','SUI',5)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Ecuador','ECU',5)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Frankrijk','FRA',5)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Honduras','HON',5)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Argentini&euml;','ARG',6)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Bosni&euml;','BIH',6)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Iran','IRN',6)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Nigeria','NGA',6)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
						
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Duitsland','GER',7)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Portugal','POR',7)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Ghana','GHA',7)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('USA','USA',7)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Belgi&euml;','BEL',8)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Algerije','ALG',8)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Rusland','RUS',8)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	$query = "INSERT INTO wk_teams (name,code,grp) VALUES ('Zuid-Korea','KOR',8)";
	$result = mysql_query($query) or die('Error: ' . mysql_error());				

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// groups
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	mysql_query("DROP TABLE wk_groups") or die('Error: ' . mysql_error());
	$query = "CREATE TABLE wk_groups(id TINYINT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(128),winner TINYINT DEFAULT '-1',second TINYINT DEFAULT '-1')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "REPLACE INTO wk_groups (id,name) VALUES (1,'A')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "REPLACE INTO wk_groups (id,name) VALUES (2,'B')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "REPLACE INTO wk_groups (id,name) VALUES (3,'C')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "REPLACE INTO wk_groups (id,name) VALUES (4,'D')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "REPLACE INTO wk_groups (id,name) VALUES (5,'E')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "REPLACE INTO wk_groups (id,name) VALUES (6,'F')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "REPLACE INTO wk_groups (id,name) VALUES (7,'G')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	$query = "REPLACE INTO wk_groups (id,name) VALUES (8,'H')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());



	$teams = 32;
	$teamspergroup = 4;
	$groups = 8;

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// matches
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	mysql_query("DROP TABLE wk_match") or die('Error: ' . mysql_error());
	$query = "CREATE TABLE wk_match(id TINYINT AUTO_INCREMENT PRIMARY KEY,stage VARCHAR(128),date DATETIME DEFAULT '0000-00-00 00:00:00',team1 TINYINT DEFAULT '-1',team2 TINYINT DEFAULT '-1',score1 TINYINT DEFAULT '-1',score2 TINYINT DEFAULT '-1',score1p TINYINT DEFAULT '-1',score2p TINYINT DEFAULT '-1')";
	$result = mysql_query($query) or die('Error: ' . mysql_error());

	// match definitions
	// group stage
	$match = 0;

	//1st matchday
	for($i=1;$i<=$groups;$i++){
		$match++;
		$query = "REPLACE INTO wk_match (id,stage,team1,team2) VALUES (". $match .",". $i .",". (($i-1)*$teamspergroup + 1) .",". (($i-1)*$teamspergroup + 2) .")";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		$match++;
		$query = "REPLACE INTO wk_match (id,stage,team1,team2) VALUES (". $match .",". $i .",". (($i-1)*$teamspergroup + 3) .",". (($i-1)*$teamspergroup + 4) .")";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
	}
	//2nd matchday
	for($i=1;$i<=$groups;$i++){
		$match++;
		$query = "REPLACE INTO wk_match (id,stage,team1,team2) VALUES (". $match .",". $i .",". (($i-1)*$teamspergroup + 1) .",". (($i-1)*$teamspergroup + 3) .")";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		$match++;
		$query = "REPLACE INTO wk_match (id,stage,team1,team2) VALUES (". $match .",". $i .",". (($i-1)*$teamspergroup + 4) .",". (($i-1)*$teamspergroup + 2) .")";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
	}
	//3rd matchday
	for($i=1;$i<=$groups;$i++){
		$match++;
		$query = "REPLACE INTO wk_match (id,stage,team1,team2) VALUES (". $match .",". $i .",". (($i-1)*$teamspergroup + 4) .",". (($i-1)*$teamspergroup + 1) .")";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		$match++;
		$query = "REPLACE INTO wk_match (id,stage,team1,team2) VALUES (". $match .",". $i .",". (($i-1)*$teamspergroup + 2) .",". (($i-1)*$teamspergroup + 3) .")";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
	}
		
	//knockout stage
	for($i=1;$i<=$groups;$i++){
		$match++;
		$query = "REPLACE INTO wk_match(id,stage) VALUES (". $match .",'eight')";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
	}
	$default_team1_str = array_merge($default_team1_str ,array("1A","1C","1B","1D","1E","1G","1F","1H"));
	$default_team2_str = array_merge($default_team2_str ,array("2B","2D","2A","2C","2F","2H","2E","2G"));

	for($i=1;$i<=$groups/2;$i++){
		$match++;
		$query = "REPLACE INTO wk_match(id,stage) VALUES (". $match.",'quarter')";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		
	}
	$default_team1_str = array_merge($default_team1_str ,array("W49","W53","W51","W55"));
	$default_team2_str = array_merge($default_team2_str ,array("W50","W54","W52","W56"));


	for($i=1;$i<=$groups/4;$i++){
		$match++;
		$query = "REPLACE INTO wk_match(id,stage) VALUES (". $match .",'semi')";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		
	}

	for($i=1;$i<=$groups/8;$i++){
		$match++;
		$query = "REPLACE INTO wk_match(id,stage) VALUES (". $match .",'third')";
		$result = mysql_query($query) or die('Error: ' . mysql_error());

		$match++;
		$query = "REPLACE INTO wk_match(id,stage) VALUES (". $match .",'final')";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// users
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//mysql_query("DROP TABLE wk_users") or die('Error: ' . mysql_error());
	$query = "CREATE TABLE wk_users(id INT AUTO_INCREMENT PRIMARY KEY,username VARCHAR(128),password VARCHAR(128),paid TINYINT";

	for($i=1;$i<=64;$i++){
		$query = $query.",match".$i."_score1 TINYINT DEFAULT '-1', match".$i."_score2 TINYINT DEFAULT '-1'";
	}
	for($i=1;$i<=8;$i++){
		$query = $query.",group".$i."_winner TINYINT DEFAULT '-1', group".$i."_second TINYINT DEFAULT '-1'";
	}

	for($i=1;$i<=8;$i++){
		$query = $query.",quarter_team".$i." TINYINT DEFAULT '-1'";
	}
	for($i=1;$i<=4;$i++){
		$query = $query.",semi_team".$i." TINYINT DEFAULT '-1'";
	}
	for($i=1;$i<=2;$i++){
		$query = $query.",final_team".$i." TINYINT DEFAULT '-1'";
	}
	for($i=1;$i<=1;$i++){
		$query = $query.",winner TINYINT DEFAULT '-1'";
	}
	
	$query = $query.",total_goals INT DEFAULT '-1'";
	
	$query = $query.",home_team_ranking TINYINT DEFAULT '-1'";

	$query = $query.")";
	//$result = mysql_query($query) or die('Error: ' . mysql_error());
}
?>