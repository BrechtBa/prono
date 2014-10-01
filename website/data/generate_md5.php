<?php


// display  form
echo "
		<article>
			<h1>Genereer paswoord</h1>
			<form class='login' name='login' action='generate_md5.php' method='post'>
				<div>Paswoord: <input type='text' name='password'></div>
				<div><input type='submit' value='Genereer' name='genereer'></div>
			</form>
		</article>";

if(array_key_exists('genereer',$_POST)){
	$pass1 = md5($_POST['password']);
		
	echo "
		<article>
			<p>$pass1</p>
		</article>";
		
}
?>