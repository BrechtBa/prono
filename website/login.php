<?php

	if(array_key_exists('register',$_POST)){
		///////////////////////////////////////////////////////////////////////////////
		// Register
		///////////////////////////////////////////////////////////////////////////////
		$username = $_POST['username'];
		$pass1 = md5($_POST['password1']);
		$pass2 = md5($_POST['password2']);
		
		// check if username is not empty
		if($username == ''){
			echo "Kies een naam.";
			echo "<meta http-equiv='refresh' content='5; URL=index.php?page=pronostiek'>";
		}
		else{
			// check if username doesnt allready exist
			$query = "SELECT * FROM wk_users WHERE username='$username'";
			$result = mysql_query($query) or die('Error: ' . mysql_error());
			if($row = mysql_fetch_array($result)){
				echo "Naam bestaat al. Kies een andere naam.";
				echo "<meta http-equiv='refresh' content='5; URL=index.php?page=pronostiek'>";
			}
			else{
				// check if pass1 == ''
				if($pass1 == ''){
					echo "Je wachtwoord moet minimaal 1 teken hebben.";
					echo "<meta http-equiv='refresh' content='5; URL=index.php?page=pronostiek'>";
				}
				else{
					// check if pass1 == pass2
					if($pass1==$pass2){
						// add to database 
						$query = "INSERT INTO wk_users (username,password) VALUES ('$username','$pass1')";
						$result = mysql_query($query) or die('Error: ' . mysql_error());
						
						$query = "SELECT * FROM wk_users WHERE username='$username'";
						$result = mysql_query($query) or die('Error: ' . mysql_error());
						$row = mysql_fetch_array($result);
				
						$_SESSION['login'] = 1;
						$_SESSION['userid'] = $row['id'];
						
						echo "
							<article>
								<h1>Registratie geslaagd</h1>
							</article>
							<meta http-equiv='refresh' content='0; URL=index.php?page=pronostiek'>";
					}
					else{
						echo "Je wachtwoorden waren niet gelijk";
						echo "<meta http-equiv='refresh' content='5; URL=index.php?page=pronostiek'>";
					}
				}
			}	
		 }
	}
	elseif(array_key_exists('login',$_POST)){
		///////////////////////////////////////////////////////////////////////////////
		// Login
		///////////////////////////////////////////////////////////////////////////////
		$username = $_POST['username'];
		$pass = md5($_POST['password']);
		// check if username exists
		$query = "SELECT * FROM wk_users WHERE username='$username'";
		$result = mysql_query($query) or die('Error: ' . mysql_error());
		if($row = mysql_fetch_array($result)){
			if($row['password'] == $pass){
				$_SESSION['login'] = 1;
				$_SESSION['userid'] = $row['id'];
					
				if($row['paid'] != 1 && time()>$phase1_end){
					echo "<article>
							<h1>Je moet nog betalen!</h1>
							<h1> Gelieve dit zo snel mogelijk in orde te maken!</h1>
						  </article>";
					echo "<meta http-equiv='refresh' content='10; URL=index.php?page=pronostiek'>";
				}
				else{
					echo "<meta http-equiv='refresh' content='0; URL=index.php?page=pronostiek'>";
				}
			}
			else{
				echo "Verkeer paswoord";
				echo "<meta http-equiv='refresh' content='5; URL=index.php?page=pronostiek'>";
			}
		}
		else{
			echo "Naam bestaat niet, registreer eerst";
			echo "<meta http-equiv='refresh' content='5; URL=index.php?page=pronostiek'>";
		}
		
	}
	else{
		// display login form
		echo "
				<article>
					<h1>Login</h1>
					<form class='login' name='login' action='index.php?page=pronostiek' method='post'>
						<div>Naam: <input type='text' name='username'></div>
						<div>Paswoord: <input type='password' name='password'></div>
						<div><input type='submit' value='Login' name='login'></div>
					</form>	
					<h1>Registreer</h1>
					<form class='login' name='login' action='index.php?page=pronostiek' method='post'>
						<div>Naam: <input type='text' name='username'></div>
						<div>Paswoord: <input type='password' name='password1'></div>
						<div>Herhaal paswoord: <input type='password' name='password2'></div>
						<div><input type='submit' value='Registreer' name='register'></div>
					</form>
				</article>";
	}


?>