<?php

// Create handlers that define sub page behaviour
$prono = 0;
$admin = 0;
$round_enabled = array_fill (0 , count($phase_end_time) , 0 );

echo "
			<article>
				<h1>Resultaten</h1>";

		include('data/groupstage.php');
echo "
			</article>
			<article>";	
		include('data/knockoutstage.php');
					
echo "
			</article>";
?>