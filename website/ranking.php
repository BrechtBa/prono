<?php

// punten berekenen en rangschikking bepalen
$query = "SELECT * FROM wk_users";
$result = mysql_query($query) or die('Error: ' . mysql_error());
$i = -1;
while($row = mysql_fetch_array($result)) {
	$i++;
	$ind[$i] = $i;
	$username[$i] = $row['username'];	
	$points[$i] = calculate_prono($row['id']);
	$grouppoints[$i] = calculate_group_prono($row['id']);
}
$points_temp = $points;
array_multisort($points_temp,$ind);


echo "
		<article>
			<h1>Rangschikking</h1>
			
			<div class='table table_heading'>
				<div class='small'></div>
				<div class='wide'></div>
				<div class='small'>Punten</div>
				<div class='wide'>Punten groepsfase</div>
			</div>";
			
for($i=count($ind)-1;$i>=0;$i--){

	$temp_username = $username[$ind[$i]];
	$temp_points = $points[$ind[$i]];
	$temp_grouppoints = $grouppoints[$ind[$i]];
	
	$j = count($ind)-$i;
	echo "
			<div class='table'>
				<div class='small'>$j</div>
				<div class='wide'>$temp_username</div>
				<div class='small'>$temp_points</div>
				<div class='wide'>$temp_grouppoints</div>
			</div>";
}

echo "
		</article>";
?>