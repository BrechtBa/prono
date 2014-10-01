<?php

if(!$_SESSION['login']){

	include('login.php');
}
else{
	///////////////////////////////////////////////////////////////////////////////
	// Pronostiek weergeven
	///////////////////////////////////////////////////////////////////////////////
	echo "
			<article>
				<h1>Pronostiek Deel 1</h1>";
	
	$prono = 1;
	$enabled = 0;
	if( time()<$phase1_end ){
		$enabled = 1;
	}
	
	
	include('groupstage.php');

	include('knockout_teams.php');
	
	echo "			
				<h1>Pronostiek Deel 2</h1>";
				
	$enabled = 1;			
	include('knockoutstage.php');
				
	echo "
				<form class='prono' name='print_pronostiek' action='print_pronostiek.php?userid=$userid' target='_blank' method='post'>
					<div class='submit'><input type='submit' value='Print pronostiek'></div>
				</form>
			</article>";
					
}
?>