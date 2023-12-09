<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
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
$username = $_SESSION['username'];
$password = $_SESSION['password'];

// Time Played From Form
$timePlayed = $_POST['time'];
$timePlayed = "00:" . $timePlayed; 

// Add Local Player 1 To LocalBoard - Winner
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('$username', '$password', '$player1', 1, 1, '$timePlayed')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}

// Add Local Player 2 To LocalBoard - Loser
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('$username', '$password', '$player2', 1, 0, '$timePlayed')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}

// Alter GlobalBoard - GamesWon + 1, GamesPlayed + 1, TimePlayed + time played in game
$sql = "SELECT * FROM GlobalBoard WHERE Username = '$username' AND Password = '$password'";
$result = $conn -> query($sql);
$record = mysqli_fetch_array($result);
$gamesPlayed = intval($record[2]) + 1;
$gamesWon = intval($record[3]) + 1;

$totalTimePlayed = strval($record[4]);

$localTimeArr = explode(":", $timePlayed);
$totalTimeArr = explode(":", $totalTimePlayed);

$seconds = intval($localTimeArr[1]) + intval($totalTimeArr[1]);
$minutes = intval($localTimeArr[0]) + intval($totalTimeArr[0]);

if($seconds > 59){
    $minutes += 1;
    $seconds -= 60;
}

$sql = "UPDATE GlobalBoard SET GamesPlayed = '$gamesPlayed', GamesWon = '$gamesWon', TimePlayed = '$newTotalTime' WHERE Username = '$username' AND Password = '$password'";
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