<?php
session_start();
$servername = $_SESSION['servername'];
$username = $_SESSION['dbusername'];
$password = $_SESSION['dbpassword'];
$dbname = "checkers";
$error = FALSE;

// Connect to Database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

// Sort by Most Games Won
$sql = "ALTER TABLE GlobalBoard ORDER BY GamesWon DESC";
if ($conn->query($sql) === FALSE) {
    echo "Error Sorting Table: " . $conn->error;
}

// If no errors, redirect to leaderboard.php
if ($error == FALSE){
    header("Location: ../leaderboard.php");
}
?>