<?php
///////////////////////////////////////////////////////////////////////////////
// Knockoutstage invullen
///////////////////////////////////////////////////////////////////////////////
if(array_key_exists('knockoutstage',$_POST)){
	// in pronostiek invullen
	if($prono){
		for($i=49;$i<=64;$i++){
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
		
		//echo "<meta http-equiv='refresh' content='0; URL=index.php?page=$page'>";
	}
	// in resultaten invullen
	else{
		for($i=49;$i<=64;$i++){
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
			
			if($_POST['match'.$i.'_score1p']==''){
				$score1p = -1;
			}
			else{
				$score1p = $_POST['match'.$i.'_score1p'];
			}
			if($_POST['match'.$i.'_score2p']==''){
				$score2p = -1;
			}
			else{
				$score2p = $_POST['match'.$i.'_score2p'];
			}
			
			$query = "UPDATE wk_match SET score1=$score1, score2=$score2, score1p=$score1p, score2p=$score2p WHERE id=$i";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
		}
	}
}




///////////////////////////////////////////////////////////////////////////////
// Display knockoutstage
///////////////////////////////////////////////////////////////////////////////
// There are 4 groupstage versions all handled by this file
// prono:  used to fill in the guess of all users: $prono = 1, $enabled = [array with 1 or 0] , $admin = 0;
// disp:   used to show the guessed scores       : $prono = 1, $enabled = [all zero array]
// admin:  used to fill in the actual scores     : $prono = 0, $admin = 1;
// result: used to display the actual scores     : $prono = 0

$enabled = $round_enabled;
if($admin){
	$enabled = $enabled-$enabled+1;
}

echo "
					<h2>Eliminatie fase</h2>	
					<div class='ko'>
						<div class='ko_stage'>";

display_knockout_match('eight',49,$enabled[1],$prono);
display_knockout_match('eight',50,$enabled[1],$prono);
display_knockout_match('eight',53,$enabled[1],$prono);
display_knockout_match('eight',54,$enabled[1],$prono);

echo "
						</div>
						<div class='ko_stage'>";
																	
display_knockout_match('quarter',57,$enabled[2],$prono);
echo "
							<div class=ko_empty></div>";

display_knockout_match('quarter',58,$enabled[2],$prono);						
echo "
						</div>
						<div class='ko_stage'>";
					
display_knockout_match('semi',61,$enabled[3],$prono);
echo "
						</div>
						<div class='ko_stage'>";
echo "
							<div class=ko_empty></div>
							<div class=ko_empty></div>
							<div class=ko_empty></div>";			

display_knockout_match('final',64,$enabled[4],$prono);
echo "
							<div class=ko_empty></div>";

display_knockout_match('final',63,$enabled[4],$prono);

						
echo "
						</div>
						<div class='ko_stage'>";
					
display_knockout_match('semi',62,$enabled[3],$prono);

echo "
						</div>
						<div class='ko_stage'>";
													
display_knockout_match('quarter',59,$enabled[2],$prono);
echo "
							<div class=ko_empty></div>";
						
display_knockout_match('quarter',60,$enabled[2],$prono);


echo "
						</div>
						<div class='ko_stage'>";
					
display_knockout_match('eight',51,$enabled[1],$prono);
display_knockout_match('eight',52,$enabled[1],$prono);
display_knockout_match('eight',55,$enabled[1],$prono);
display_knockout_match('eight',56,$enabled[1],$prono);

echo "
						</div>
					</div>";

?>