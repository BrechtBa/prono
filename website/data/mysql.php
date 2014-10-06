<?php

$db_host = 'localhost';
$db_username = 'pronouser';
$db_password = 'pronopass';
$db_database = 'pronodatabase';

$db_connection = mysql_pconnect("$location","$db_username","$db_password");
if (!$db_connection) die ("Could not connect MySQL");

mysql_select_db($db_database,$db_connection) or die ("Could not open database");

?>