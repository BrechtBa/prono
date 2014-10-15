<?php

// Create handlers that define sub page behaviour
$prono = 0;

echo "
			<article>
				<form class='prono' name='results' action='index.php?page=$page&subpage=$subpage' method='post'>
					<h1>Resultaten</h1>";

		include('data/groupstage.php');

		
		include('data/knockoutstage.php');
		
		if($admin){
			echo "
				<div class='submit'><input type='submit' value='Verzenden' name='results'></div>";
								
		}
echo "
				</form>
			</article>";
?>