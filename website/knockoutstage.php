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
// Knockoutstage weergeven
///////////////////////////////////////////////////////////////////////////////
$enabled_str = "disabled";
$fillindate = 0;

if($prono){
	if( time()>$phase1_end && time()<$phase2_end ){
		$eight_enabled   = 1*$enabled;
		$fillindate = date('d M Y, H:i',$phase2_end);
		$enabled_str = "";
	}
	else{
		$eight_enabled = 0;
	}
	if( time()>$phase2_end && time()<$phase3_end ){
		$quarter_enabled = 1*$enabled;
		$fillindate = date('d M Y, H:i',$phase3_end);
		$enabled_str = "";
	}
	else{
		$quarter_enabled = 0;
	}
	if( time()>$phase3_end && time()<$phase4_end ){
		$semi_enabled    = 1*$enabled;
		$fillindate = date('d M Y, H:i',$phase4_end);
		$enabled_str = "";
	}
	else{
		$semi_enabled = 0;
	}
	if( time()>$phase4_end && time()<$phase5_end ){
		$final_enabled   = 1*$enabled;
		$fillindate = date('d M Y, H:i',$phase5_end);
		$enabled_str = "";
	}
	else{
		$final_enabled = 0;
	}
}
else{
	$eight_enabled   = 1*$enabled;
	$quarter_enabled = 1*$enabled;
	$semi_enabled    = 1*$enabled;
	$final_enabled   = 1*$enabled;
	
	$enabled_str = "";
}


if($prono && $fillindate){
	echo "<p>In te vullen voor $fillindate</p>";
}
echo "
		<h2>Eliminatie fase</h2>
		<form class='prono' name='knockoutstage' action='index.php?page=$page' method='post'>";

echo "		
			<div class='ko'>";			
echo "
				<div class='ko_stage'>";

print_knockout_match('eight',49,$eight_enabled,$prono);
print_knockout_match('eight',50,$eight_enabled,$prono);
print_knockout_match('eight',53,$eight_enabled,$prono);
print_knockout_match('eight',54,$eight_enabled,$prono);

echo "
				</div>
				<div class='ko_stage'>";
														
print_knockout_match('quarter',57,$quarter_enabled,$prono);
echo "
					<div class=ko_empty></div>";

print_knockout_match('quarter',58,$quarter_enabled,$prono);						
echo "
				</div>
				<div class='ko_stage'>";
					
print_knockout_match('semi',61,$semi_enabled,$prono);
echo "
				</div>
				<div class='ko_stage'>";
echo "
					<div class=ko_empty></div>
					<div class=ko_empty></div>
					<div class=ko_empty></div>";			

print_knockout_match('final',64,$final_enabled,$prono);
echo "
					<div class=ko_empty></div>";

print_knockout_match('final',63,$final_enabled,$prono);

						
echo "
				</div>
				<div class='ko_stage'>";
					
print_knockout_match('semi',62,$semi_enabled,$prono);

echo "
				</div>
				<div class='ko_stage'>";
													
print_knockout_match('quarter',59,$quarter_enabled,$prono);
echo "
					<div class=ko_empty></div>";
						
print_knockout_match('quarter',60,$quarter_enabled,$prono);


echo "
				</div>
				<div class='ko_stage'>";
					
print_knockout_match('eight',51,$eight_enabled,$prono);
print_knockout_match('eight',52,$eight_enabled,$prono);
print_knockout_match('eight',55,$eight_enabled,$prono);
print_knockout_match('eight',56,$eight_enabled,$prono);

echo "
				</div>
			</div>";
if($prono || $enabled){
	echo "
			<div class='submit'><input type='submit' value='Verzenden' name='knockoutstage' $enabled_str></div>";
}
echo "
		</form>";
				
?>