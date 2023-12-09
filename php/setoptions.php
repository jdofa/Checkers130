<?php
session_start();

// Game Options From Form
$_SESSION['boardSize'] = $_POST['boardSize'];
$_SESSION['boardTheme'] = $_POST['boardTheme'];
$_SESSION['player1Name'] = $_POST['player1Name'];
$_SESSION['player1Color'] = $_POST['player1Color'];
$_SESSION['player2Name'] = $_POST['player2Name'];
$_SESSION['player2Color'] = $_POST['player2Color'];
$_SESSION['gameMode'] = $_POST['gameMode'];
if ($_SESSION['gameMode'] == "bot") {
    $_SESSION['player2Name'] = "Bot " . $_SESSION['player2Name'];
}
if($_SESSION['boardTheme'] == "brown"){
    $_SESSION['boardColor1'] = "#b58863";
    $_SESSION['boardColor2'] = "#f0d9b5";
}
else if($_SESSION['boardTheme'] == "blue"){
    $_SESSION['boardColor1'] = "#2c3e50";
    $_SESSION['boardColor2'] = "#ecf0f1";
}
else if($_SESSION['boardTheme'] == "red"){
    $_SESSION['boardColor1'] = "#c0392b";
    $_SESSION['boardColor2'] = "#f5b7b1";
}
else if($_SESSION['boardTheme'] == "green"){
    $_SESSION['boardColor1'] = "#27ae60";
    $_SESSION['boardColor2'] = "#d5f5e3";
}
header("Location: ../game.php");
?>