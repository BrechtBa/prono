<?php

if(!$_SESSION['login']){

	include('login.php');
}
else{
	///////////////////////////////////////////////////////////////////////////////
	// Pronostiek weergeven
	///////////////////////////////////////////////////////////////////////////////
	
	$enabled = 0;
	$enabled_str = "disabled";
	if( time()<$phase1_end ){
		$enabled = 1;
		$enabled_str = "";
	}
	
	// Deel 1 ////////////////////////////////////////////////////////////////////
	echo "
			<article>
				<form class='prono' name='part1' action='index.php?page=$page' method='post'>
					<h1>Pronostiek Deel 1</h1>
					<p>In te vullen voor ".date('d M Y, H:i',$phase1_end)."</p>
					<h2>Groepsfase</h2>";

	for($group=1;$group<=$groups;$group++){
		echo "
					<div class='group'>
						<h3>Groep $group_name[$group]</h3>";
						display_group_matches($group,$enabled,$userid);
						display_group_winners($group,$enabled,$userid);

		echo "
					</div>";		
	}
	echo "
					<div class=ko1>
						Ploegen in de Kwartfinales:<br>";
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
						Ploegen in de Halve finales:<br>";					
						display_team_selection("semi_team1",$enabled);
						display_team_selection("semi_team2",$enabled);
						display_team_selection("semi_team3",$enabled);
						display_team_selection("semi_team4",$enabled);
				
	echo "     
					</div>
					<div class=ko1>
						Ploegen in de Finale:<br>";
						display_team_selection("final_team1",$enabled);
						display_team_selection("final_team2",$enabled);

	echo "     
					</div>
					<div class=ko1>
						Wereldkampioen:<br>";
						display_team_selection("winner",$enabled);

	echo "     
					</div>";
	
	echo "
					<div class='submit'><input type='submit' value='Verzenden' name='part1' $enabled_str></div>
				</form>
			</article>";
	// Deel 2 ////////////////////////////////////////////////////////////////////
	
	// check which part is enabled
	$enabled_str = "disabled";
	if($userid>0){
		if( time()>$phase1_end && time()<$phase2_end ){
			$eight_enabled   = 1;
			$fillindate = date('d M Y, H:i',$phase2_end);
			$enabled_str = "";
		}
		else{
			$eight_enabled = 0;
		}
		if( time()>$phase2_end && time()<$phase3_end ){
			$quarter_enabled = 1;
			$fillindate = date('d M Y, H:i',$phase3_end);
			$enabled_str = "";
		}
		else{
			$quarter_enabled = 0;
		}
		if( time()>$phase3_end && time()<$phase4_end ){
			$semi_enabled    = 1;
			$fillindate = date('d M Y, H:i',$phase4_end);
			$enabled_str = "";
		}
		else{
			$semi_enabled = 0;
		}
		if( time()>$phase4_end && time()<$phase5_end ){
			$final_enabled   = 1;
			$fillindate = date('d M Y, H:i',$phase5_end);
			$enabled_str = "";
		}
		else{
			$final_enabled = 0;
		}
	}
	else{
		$eight_enabled   = 1;
		$quarter_enabled = 1;
		$semi_enabled    = 1;
		$final_enabled   = 1;
		
		$enabled_str = "";
	}
	// Display
	echo "			
			<article>
				<form class='prono' name='part2' action='index.php?page=$page' method='post'>
					<h1>Pronostiek Deel 2</h1>";
				

	echo "		
					<div class='ko'>		
						<div class='ko_stage'>";
							display_knockout_match('eight',49,$eight_enabled,$userid);
							display_knockout_match('eight',50,$eight_enabled,$userid);
							display_knockout_match('eight',53,$eight_enabled,$userid);
							display_knockout_match('eight',54,$eight_enabled,$userid);

		echo "
						</div>
						<div class='ko_stage'>";							
							display_knockout_match('quarter',57,$quarter_enabled,$userid);
	echo "
							<div class=ko_empty></div>";
							display_knockout_match('quarter',58,$quarter_enabled,$userid);						
	echo "
						</div>
						<div class='ko_stage'>";
							display_knockout_match('semi',61,$semi_enabled,$userid);
	echo "
						</div>
						<div class='ko_stage'>";
	echo "
							<div class=ko_empty></div>
							<div class=ko_empty></div>
							<div class=ko_empty></div>";			
							display_knockout_match('final',64,$final_enabled,$userid);
	echo "
							<div class=ko_empty></div>";
							display_knockout_match('final',63,$final_enabled,$userid);

						
	echo "
						</div>
						<div class='ko_stage'>";
							display_knockout_match('semi',62,$semi_enabled,$userid);

	echo "
						</div>
						<div class='ko_stage'>";							
							display_knockout_match('quarter',59,$quarter_enabled,$userid);
	echo "
							<div class=ko_empty></div>";
							display_knockout_match('quarter',60,$quarter_enabled,$userid);


	echo "
						</div>
						<div class='ko_stage'>";
							display_knockout_match('eight',51,$eight_enabled,$userid);
							display_knockout_match('eight',52,$eight_enabled,$userid);
							display_knockout_match('eight',55,$eight_enabled,$userid);
							display_knockout_match('eight',56,$eight_enabled,$userid);

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
					
}
?>