<?php

///////////////////////////////////////////////////////////////////////////////
// Groupstage invullen
///////////////////////////////////////////////////////////////////////////////
if(array_key_exists('groupstage',$_POST)){
	// in pronostiek invullen
	if($prono){
		for($i=1;$i<=48;$i++){
			if($_POST['match'.$i.'_score1']==''){
				$score1 = -1;
			}
			else{
				$score1 = $_POST['match'.$i.'_score1'];
			}
			if($_POST['match'.$i.'_score2']==''){
				$score2 = -1;
			}
			else{
				$score2 = $_POST['match'.$i.'_score2'];
			}
			$query = "UPDATE wk_users SET match".$i."_score1=$score1, match".$i."_score2=$score2 WHERE id=$userid";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
			
		}
		for($i=1;$i<=8;$i++){
			$winner = $_POST['group'.$i.'_winner'];
			$second = $_POST['group'.$i.'_second'];
			$query = $query.", group".$i."_winner='".$winner."', group".$i."_second='".$second."'";
			$query = "UPDATE wk_users SET group".$i."_winner=$winner, group".$i."_second=$second WHERE id=$userid";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
		//echo "<meta http-equiv='refresh' content='0; URL=index.php?page=$page'>";
	}
	// in resultaten invullen
	else{
		for($i=1;$i<=48;$i++){
			if($_POST['match'.$i.'_score1']==''){
				$score1 = -1;
			}
			else{
				$score1 = $_POST['match'.$i.'_score1'];
			}
			if($_POST['match'.$i.'_score2']==''){
				$score2 = -1;
			}
			else{
				$score2 = $_POST['match'.$i.'_score2'];
			}
			$query = "UPDATE wk_match SET score1=$score1, score2=$score2 WHERE id=$i";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
		for($i=1;$i<=8;$i++){
			$winner = $_POST['group'.$i.'_winner'];
			$second = $_POST['group'.$i.'_second'];
			$query = $query.", group".$i."_winner='".$winner."', group".$i."_second='".$second."'";
			$query = "UPDATE wk_groups SET winner=$winner, second=$second WHERE id=$i";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
	}
}


///////////////////////////////////////////////////////////////////////////////
// Groupstage weergeven
///////////////////////////////////////////////////////////////////////////////
if($enabled){
	$enabled_str = "";
}
else{
	$enabled_str = "disabled";
}
if($prono){
	echo "
		<p>In te vullen voor ".date('d M Y, H:i',$phase1_end)."</p>";
}
echo "
		<h2>Groepsfase</h2>
		<form class='prono' name='groupstage' action='index.php?page=$page' method='post'>";

for($group=1;$group<=$groups;$i++){
	echo "
			<div class='group'>
				<h3>Groep $group_name[$i]</h3>";
				
				display_group_matches($group,$enabled,$userid);
				display_group_winners($group,$enabled,$userid);

	echo "
			</div>";		
}

if($prono || $enabled){
	echo "
			<div class='submit'><input type='submit' value='Verzenden' name='groupstage' $enabled_str></div>";
}
echo "
		</form>";
		
		


?>