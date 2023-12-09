<?php
session_start();
$_SESSION['loggedin'] = false;

$servername = $_SESSION['servername'];
$username = $_SESSION['dbusername'];
$password = $_SESSION['dbpassword'];

$helper = array_keys($_SESSION);
foreach ($helper as $key){
    unset($_SESSION[$key]);
}

//Save these after logging out
$_SESSION['servername'] = $servername;
$_SESSION['dbusername'] = $username;
$_SESSION['dbpassword'] = $password;
$_SESSION['databaseCreated'] = true;

header("Location: ../index.php");
?>