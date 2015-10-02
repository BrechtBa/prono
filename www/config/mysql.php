<?php

include('config.php');

if (!mysql_connect(HOST,USER,PASSWORD)) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db(DATABASE);

?>