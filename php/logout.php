<?php
session_start();
$_SESSION['loggedin'] = false;
$helper = array_keys($_SESSION);
foreach ($helper as $key){
    unset($_SESSION[$key]);
}
$_SESSION['databaseCreated'] = true;
header("Location: ../index.php");
?>