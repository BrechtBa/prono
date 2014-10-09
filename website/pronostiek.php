<?php

if(!$_SESSION['login']){

	include('login.php');
	
}
else{

	// Create handlers that define sub page behaviour
	$prono = 1;
	
	// Create date strings if required
	$finaldate_part1 = "";
	$finaldate_part2 = "";
	
	$round_enabled = array_fill (0 , count($phase_end_time) , 0 );
	if( time()<$phase_end_time[0] ){
		$round_enabled[0] = 1;
		$finaldate_part1 = "In te vullen voor ".date('d M Y, H:i', $phase_end_time[0]);
	}
	for($i=1;$i<count($phase_end_time);$i++){
		if( time()>$phase_end_time[$i-1] && time()<$phase_end_time[$i] ){
			$round_enabled[$i]   = 1;
			$finaldate_part2 = "In te vullen voor ".date('d M Y, H:i', $phase_end_time[$i]);
		}
	}
	
	///////////////////////////////////////////////////////////////////////////////
	// Part 1
	///////////////////////////////////////////////////////////////////////////////
	echo "
			<article>
				<form class='prono' name='part1' action='index.php?page=$page' method='post'>
					<h1>Pronostiek Deel 1</h1>
					<div class='finaldate'>$finaldate_part1</div>";
					
	include('data/groupstage.php');				
	
	include('data/progress.php');		
	
	echo "
					<div class='submit'><input type='submit' value='Verzenden' name='part1' $enabled_str></div>
				</form>
			</article>";
			
/*
	echo "
					<div class=ko1>
						<h1>Ploegen in de Kwartfinales:</h1>";
						display_team_selection("quarter_team1",$enabled);
						display_team_selection("quarter_team2",$enabled);
						display_team_selection("quarter_team3",$enabled);
						display_team_selection("quarter_team4",$enabled);
						display_team_selection("quarter_team5",$enabled);
						display_team_selection("quarter_team6",$enabled);
						display_team_selection("quarter_team7",$enabled);
						display_team_selection("quarter_team8",$enabled);
	echo "     
					</div>
					<div class=ko1>
						<h1>Ploegen in de Halve finales:</h1>";					
						display_team_selection("semi_team1",$enabled);
						display_team_selection("semi_team2",$enabled);
						display_team_selection("semi_team3",$enabled);
						display_team_selection("semi_team4",$enabled);	
	echo "     
					</div>
					<div class=ko1>
						<h1>Ploegen in de Finale:</h1>";
						display_team_selection("final_team1",$enabled);
						display_team_selection("final_team2",$enabled);
	echo "     
					</div>
					<div class=ko1>
						<h1>Wereldkampioen:</h1>";
						display_team_selection("winner",$enabled);
	echo "     
					</div>";
	

*/		
			
	///////////////////////////////////////////////////////////////////////////////
	// Part 2
	///////////////////////////////////////////////////////////////////////////////
	echo "			
			<article>
				<form class='prono' name='part2' action='index.php?page=$page' method='post'>
					<h1>Pronostiek Deel 2</h1>
					<div class='finaldate'>$finaldate_part2</div>";
					
	include('data/knockoutstage.php');
	
	
		echo "
					<div class='submit'><input type='submit' value='Verzenden' name='part2' $enabled_str></div>
				</form>
			</article>";
			
	///////////////////////////////////////////////////////////////////////////////
	// Print
	///////////////////////////////////////////////////////////////////////////////	
	echo "
			<article>
				<form class='prono' name='print_pronostiek' action='print_pronostiek.php?userid=$userid' target='_blank' method='post'>
					<div class='submit'><input type='submit' value='Print pronostiek'></div>
				</form>
			</article>";
			
	
	
	/*
	
	// check which part is enabled
	$enabled_str = "disabled";
	$fillindate = "";
	if($userid>0){
		for($i=1;$i<count($phase_end_time);$i++){
		
			if( time()>$phase_end_time[$i-1] && time()<$phase_end_time[$i] ){
				$round_enabled[$i]   = 1;
				$fillindate = $phase_end_time[$i];
				$enabled_str = "";
			}
		
		}
	}
	else{
		for($i=1;$i<count($phase_end_time);$i++){
			$round_enabled[$i]   = 1;
			$enabled_str = "";
		}
	}
	// Display

				

	echo "		
					<div class='ko'>		
						<div class='ko_stage'>";
							display_knockout_match('eight',49,$round_enabled[1],$userid);
							display_knockout_match('eight',50,$round_enabled[1],$userid);
							display_knockout_match('eight',53,$round_enabled[1],$userid);
							display_knockout_match('eight',54,$round_enabled[1],$userid);

		echo "
						</div>
						<div class='ko_stage'>";							
							display_knockout_match('quarter',57,$round_enabled[2],$userid);
	echo "
							<div class=ko_empty></div>";
							display_knockout_match('quarter',58,$round_enabled[2],$userid);						
	echo "
						</div>
						<div class='ko_stage'>";
							display_knockout_match('semi',61,$round_enabled[3],$userid);
	echo "
						</div>
						<div class='ko_stage'>";
	echo "
							<div class=ko_empty></div>
							<div class=ko_empty></div>
							<div class=ko_empty></div>";			
							display_knockout_match('final',64,$round_enabled[4],$userid);
	echo "
							<div class=ko_empty></div>";
							display_knockout_match('final',63,$round_enabled[4],$userid);

						
	echo "
						</div>
						<div class='ko_stage'>";
							display_knockout_match('semi',62,$round_enabled[3],$userid);

	echo "
						</div>
						<div class='ko_stage'>";							
							display_knockout_match('quarter',59,$round_enabled[2],$userid);
	echo "
							<div class=ko_empty></div>";
							display_knockout_match('quarter',60,$round_enabled[2],$userid);


	echo "
						</div>
						<div class='ko_stage'>";
							display_knockout_match('eight',51,$round_enabled[1],$userid);
							display_knockout_match('eight',52,$round_enabled[1],$userid);
							display_knockout_match('eight',55,$round_enabled[1],$userid);
							display_knockout_match('eight',56,$round_enabled[1],$userid);

	echo "
						</div>
					</div>";
					
	echo "
					<div class='submit'><input type='submit' value='Verzenden' name='part2' $enabled_str></div>
				</form>
			</article>";
	echo "
			<article>
				<form class='prono' name='print_pronostiek' action='print_pronostiek.php?userid=$userid' target='_blank' method='post'>
					<div class='submit'><input type='submit' value='Print pronostiek'></div>
				</form>
			</article>";
	*/				
}
?>