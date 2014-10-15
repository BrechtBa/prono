<?php

	if(array_key_exists('editteams',$_POST)){
		///////////////////////////////////////////////////////////////////////////////
		// Edit teams
		///////////////////////////////////////////////////////////////////////////////
		
		$query = "SELECT * FROM wk_teams";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		while($row = mysql_fetch_array($result)){
			$id = $row['id'];
			$name = $_POST['name'.$row['id']];
			$code = $_POST['code'.$row['id']];
			
			$query_update = "UPDATE wk_teams SET name='$name', code='$code' WHERE id=$id";
			$result_update = mysql_query($query_update) or die('Error: ' . mysql_error());
			
		}
		echo "<meta http-equiv='refresh' content='0; URL=index.php?page=$page&subpage=$subpage'>";
	}
	///////////////////////////////////////////////////////////////////////////////			
	echo "		
			<article>
				<a name='teams'></a>
				<h1>Ploegen aanpassen</h1>					
				<form class='prono' name='editteams' action='index.php?page=$page&subpage=$subpage' method='post'>
					<div class='table table_heading'>
						<div class='small'>Team Nr</div>
						<div class='small'>Group Nr</div>
						<div class='wide'>Team name</div>
						<div class='wide'>Team_code</div>
					</div>";
		
	$query = "SELECT * FROM wk_teams";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	while($row = mysql_fetch_array($result)) {
		
		echo "
		
					<div class='table'>
						<div class='small'>".$row['id']."</div>
						<div class='small'>".$group_name[$row['grp']].(($row['id']-1)%$teamspergroup+1)."</div>
						<div class='wide'><input name='name".$row['id']."' value='".$row['name']."'></div>
						<div class='wide'><input name='code".$row['id']."' value='".$row['code']."'></div>
					</div>";
	}
	echo "
					<div class='submit'><input type='submit' value='Verzenden' name='editteams'></div>
				</form>
			</article>";



?>