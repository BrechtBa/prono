<?php
//<img src='figures/logo2.jpg'>
echo "
		<h1>
			
			3 Fasen WK 2014 PRONOSTIEK
		</h1>
		<nav>
			<ul>
				<li><a href='index.php?page=rules'>SPELREGELS</a></li>
				<li><a href='index.php?page=prono'>PRONOSTIEK</a></li>
				<li><a href='index.php?page=results'>RESULTATEN</a></li>";
if(!$_SESSION['login']){
	echo "
				<li class='noborder'><a href='index.php?page=ranking'>RANGSCHIKKING</a></li>";				
}
else{
	echo "
				<li><a href='index.php?page=ranking'>RANGSCHIKKING</a></li>";
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