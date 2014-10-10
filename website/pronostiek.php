<?php

	if(!$_SESSION['login']){
		include('login.php');
	}
	else{

		// Create handlers that define sub page behaviour
		$prono = 1;
		$admin = 0;
		
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
}
?>