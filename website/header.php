<?php
//<img src='figures/logo2.jpg'>
echo "
		<h1>
			
			3 Fasen WK 2014 PORNOSTIEK
		</h1>
		<nav>
			<ul>
				<li><a href='index.php?page=home'>SPELREGELS</a></li>
				<li><a href='index.php?page=pronostiek'>PRONOSTIEK</a></li>
				<li><a href='index.php?page=resultaten'>RESULTATEN</a></li>";
if(!$_SESSION['login']){
	echo "
				<li class='noborder'><a href='index.php?page=rangschikking'>RANGSCHIKKING</a></li>";				
}
else{
	echo "
				<li><a href='index.php?page=rangschikking'>RANGSCHIKKING</a></li>";
	if($_SESSION['userid']==1){
		echo "
				<li><a href='index.php?page=admin'>ADMIN</a></li>";
	}
	echo "			
				<li class='noborder'><a href='index.php?page=logout'>UITLOGGEN</a></li>";
}
	
echo "
			</ul>
		</nav>
";


?>