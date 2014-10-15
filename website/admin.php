<?php

if(!$_SESSION['login'] || !($_SESSION['userid']==1)){
}
else{
	$userid = $_SESSION['userid'];
	$admin = 1;
	
	if(array_key_exists('subpage',$_GET)){
		$subpage = $_GET['subpage'];
	}
	else{
		$subpage = 'resultaten';
	}
	
	// display admin menu
	echo "
		<nav>
			<li><a href='index.php?page=admin&subpage=results'>RESULTATEN</a></li>
			<li><a href='index.php?page=admin&subpage=users'>USERS</a></li>
			<li><a href='index.php?page=admin&subpage=matches'>WEDSTRIJDEN</a></li>
			<li><a href='index.php?page=admin&subpage=teams'>TEAMS</a></li>
		</nav>
	";
		
	// include subpage
	include("$subpage.php");
		
}
?>