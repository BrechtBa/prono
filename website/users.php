<?php

	if(array_key_exists('edituser',$_POST)){
		///////////////////////////////////////////////////////////////////////////////
		// Remove users
		///////////////////////////////////////////////////////////////////////////////
		
		$query = "SELECT * FROM wk_users";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		while($row = mysql_fetch_array($result)){
			$id = $row['id'];
			if($_POST['remove_user'.$id]){
				$query_remove = "DELETE FROM wk_users WHERE id=$id";
				$result_remove = mysql_query($query_remove) or die('Error: ' . mysql_error());
			}
		}
		echo "<meta http-equiv='refresh' content='0; URL=index.php?page=$page&subpage=$subpage'>";
	}

	
	///////////////////////////////////////////////////////////////////////////////			
	echo "		
			<article>
				<a name='users'></a>
				<h1>Gebruikers beheren</h1>
				<form class='prono' name='edituser' action='index.php?page=$page&subpage=$subpage' method='post'>
					<div class='table table_heading'>
						<div class='wide'>Naam</div>
						<div class='small'>Remove</div>
						<div class='small'></div>
					</div>";
					
	$query = "SELECT * FROM wk_users";
	$result = mysql_query($query) or die('Error: ' . mysql_error());
	// echo user 1 without remove button
	$row = mysql_fetch_array($result);
	echo "
					<div class='table'>
						<div class='wide'>".$row['username']."</div>
						<div class='small'></div>
						<div class='small'><a href='print_pronostiek.php?userid=".$row['id']."' target='_blank'>print</a></div>
					</div>";
					
	while($row = mysql_fetch_array($result)) {
		
		echo "
					<div class='table'>
						<div class='wide'>".$row['username']."</div>
						<div class='small'><input type='checkbox' name='remove_user".$row['id']."' value=1></div>
						<div class='small'><a href='print_pronostiek.php?userid=".$row['id']."' target='_blank'>print</a></div>
					</div>";
	}		
	echo "				
					<div class='submit'><input type='submit' value='Verzenden' name='edituser'></div>
				</form>
				<a href='print_pronostiek.php' target='_blank'>print all</a><br>
			</article>";

?>