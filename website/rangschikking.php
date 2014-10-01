<?php

// punten berekenen en rangschikking bepalen
$query = "SELECT * FROM wk_users";
$result = mysql_query($query) or die('Error: ' . mysql_error());
$i = -1;
while($row = mysql_fetch_array($result)) {
	$i++;
	$ind[$i] = $i;
	$ids[$i] = $row['id'];
	$username[$i] = $row['username'];
	
	$points[$i] = calculate_prono($row['id']);
	$grouppoints[$i] = calculate_group_prono($row['id']);
}

// sort
if( time()<$phase2_end ){
	$points_temp = $grouppoints;
}
else{
	$points_temp = $points;
}
array_multisort($points_temp,$ind);

// display who has not paid yet
if( time()>$phase1_end ){
	echo "<article>
			<h1>De volgende gebruikers moeten nog betalen:</h1>";
			
		$query = "SELECT * FROM wk_users WHERE paid<>1";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		while($row = mysql_fetch_array($result)){		
			echo "<h3>".$row['username']."</h3>";
		}
}
	
	
echo "
		<article>
			<h1>Rangschikking</h1>
			
			<div class='table table_heading'>
				<div class='tiny'></div>
				<div class='wide'></div>
				<div class='small'>Pts</div>
				<div class='small'>Pts grp</div>";
if($userid ==1){
	echo "
				<div class='small'></div>";
}
echo "
			</div>";
			
for($i=count($ind)-1;$i>=0;$i--){

	$temp_userid   = $ids[$ind[$i]];
	$temp_username = $username[$ind[$i]];
	$temp_points = $points[$ind[$i]];
	$temp_grouppoints = $grouppoints[$ind[$i]];
	
	$j = count($ind)-$i;
	echo "
			<div class='table'>
				<div class='tiny'>$j</div>
				<div class='wide'>$temp_username</div>
				<div class='small'>$temp_points</div>
				<div class='small'>$temp_grouppoints</div>";
	if($userid ==1){
		echo "
				<div class='small'><a href='points_details.php?userid=". $temp_userid ."' target='_blank'>Details</a></div>";
	}
	echo "
			</div>";
}

echo "
		</article>";
?>