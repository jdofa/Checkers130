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
    $error = TRUE;
}

// Grab Session Variables
$player1 = $_SESSION['player1Name'];
$player2 = $_SESSION['player2Name'];
$currUser = $_SESSION['username'];
$currPswd = $_SESSION['password'];

// Time Played From Form
$timePlayed = $_POST['time'];
$timePlayed = "00:" . $timePlayed;

// Add Local Player 1 To LocalBoard - Loser
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('$currUser', '$currPswd', '$player1', 1, 0, '$timePlayed')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}

// Add Local Player 2 To LocalBoard - Winner
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('$currUser', '$currPswd', '$player2', 1, 1, '$timePlayed')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}

// Recent Game Time + Past Time Played = Current Total Time Played
$recent = $timePlayed;
$sql = "SELECT TimePlayed FROM GlobalBoard WHERE Username = '$currUser' AND Password = '$currPswd'";
$result = $conn -> query($sql);
$value = mysqli_fetch_array($result);
$past = $value[0]; 

// arr[0] = hours, arr[1] = minutes, arr[2] = seconds
$recentArray = explode(":", $recent);
$pastArray = explode(":", $past);

$hours = $recentArray[0] + $pastArray[0];
$minutes = $recentArray[1] + $pastArray[1];
$seconds = $recentArray[2] + $pastArray[2];

// If seconds > 60, add 1 to minutes and subtract 60 from seconds
if($seconds > 59){
    $minutes += 1;
    $seconds -= 60;
}

// If minutes > 60, add 1 to hours and subtract 60 from minutes
if($minutes > 59){
    $hours += 1;
    $minutes -= 60;
}

// Ensure Time Format is Correct
if($hours < 10){
    $hours = "0" . $hours;
}

if($minutes < 10){
    $minutes = "0" . $minutes;
}

if($seconds < 10){
    $seconds = "0" . $seconds;
}

$total = $hours . ":" . $minutes . ":" . $seconds;

// Update Global - Games Played + 1, Update Time Played
$sql = " UPDATE GlobalBoard SET GamesPlayed = GamesPlayed + 1, TimePlayed = '$total' WHERE Username ='$currUser' AND Password = '$currPswd'";
if ($conn->query($sql) === FALSE) {
    echo "Error Updating Record: " . $conn->error;
    $error = TRUE;
}

//Close connection to database
$conn->close();

if($error == FALSE){
    header("Location: ../localleaderboard.php");
}
?>