<?php

	$_SESSION['login'] = 0;
	session_destroy();
	
	echo "<meta http-equiv='refresh' content='0; URL=index.php'>";

?>