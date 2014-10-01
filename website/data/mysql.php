<?php

$db_host = 'localhost';
$db_username = 'lapanza_user';
$db_password = 'suz500';
$db_database = 'db_lapanza';

$db_connection = mysql_pconnect("$location","$db_username","$db_password");
if (!$db_connection) die ("Could not connect MySQL");

mysql_select_db($db_database,$db_connection) or die ("Could not open database");

?>