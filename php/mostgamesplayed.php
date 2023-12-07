<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "checkers";
$error = FALSE;

// Connect to Database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

// Sort by Most Games Played
$sql = "ALTER TABLE GlobalBoard ORDER BY GamesPlayed DESC";
if ($conn->query($sql) === FALSE) {
    echo "Error Sorting Table: " . $conn->error;
}

// If no errors, redirect to leaderboard.php
if ($error == FALSE){
    header("Location: ../leaderboard.php");
}
?>