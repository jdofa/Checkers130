<?php

$servername = "localhost";
$username = "root";
$password = "";
$error = FALSE;

// Create connection to server
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    $error = TRUE;
}

// Create Database
$sql = "CREATE DATABASE IF NOT EXISTS checkers";
if ($conn->query($sql) === FALSE) {
    echo "Error Creating Database: " . $conn->error;
    $error = TRUE;
} 
$conn->close();

// Connect to Database
$dbname = "checkers";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    $error = TRUE;
} 

// Create User Table
$sql = "CREATE TABLE IF NOT EXISTS Users (Username VARCHAR(100), Password VARCHAR(100))";
if ($conn->query($sql) === FALSE) {
    echo "Error Creating Users Table: " . $conn->error;
    $error = TRUE;
}

// Create Local Leaderboard Table
$sql = "CREATE TABLE IF NOT EXISTS LocalBoard (Username VARCHAR(100), Password VARCHAR(100), LocalName VARCHAR(100), GamesPlayed INT(100), GamesWon INT(100), TimePlayed TIME)";
if ($conn->query($sql) === FALSE) {
    echo "Error Creating Local Leaderboard Table: " . $conn->error;
    $error = TRUE;
}

// Create Global Leaderboard Table
$sql = "CREATE TABLE IF NOT EXISTS GlobalBoard (Username VARCHAR(100), Password VARCHAR(100), GamesPlayed INT(100), GamesWon INT(100), TimePlayed TIME)";
if ($conn->query($sql) === FALSE) {
    echo "Error Creating Global Leaderboard Table: " . $conn->error;
    $error = TRUE;
}

// Delete all rows from User Table
$sql = "DELETE FROM Users";
if ($conn->query($sql) === FALSE) {
    echo "Error Deleting Table Users: " . $conn->error;
    $error = TRUE;
}

// Delete all rows from Local Leaderboard Table
$sql = "DELETE FROM LocalBoard";
if ($conn->query($sql) === FALSE) {
    echo "Error Deleting Table LocalBoard: " . $conn->error;
    $error = TRUE;
}

// Delete all rows from Global Leaderboard Table
$sql = "DELETE FROM GlobalBoard";
if ($conn->query($sql) === FALSE) {
    echo "Error Deleting Table GlobalBoard: " . $conn->error;
    $error = TRUE;
}

//Populate User Table
$sql = "INSERT INTO Users (Username, Password) VALUES ('dolfo', 'password1')";
if ($conn->query($sql) === FALSE) {
    echo "rror Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO Users (Username, Password) VALUES ('stanley', 'password2')";
if ($conn->query($sql) === FALSE) {
    echo "rror Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO Users (Username, Password) VALUES ('daniel', 'password3')";
if ($conn->query($sql) === FALSE) {
    echo "rror Inserting Record: " . $conn->error;
    $error = TRUE;
}

//Populate Local Leaderboard Table
// dolfo Game 1
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('dolfo', 'password1', 'Rodolfo', 1, 1, '00:07:14')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('dolfo', 'password1', 'Oflodor', 1, 0, '00:07:14')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
// dolfo Game 2
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('dolfo', 'password1', 'Rodolfo', 1, 1, '00:05:11')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('dolfo', 'password1', 'Oflodor', 1, 0, '00:05:11')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
// dolfo Game 3
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('dolfo', 'password1', 'Rodolfo', 1, 1, '00:10:41')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('dolfo', 'password1', 'Oflodor', 1, 0, '00:10:41')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}

// Stanley Game 1
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('stanley', 'password2', 'stan', 1, 0, '00:15:03')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('stanley', 'password2', 'dad', 1, 1, '00:15:03')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
// Stanley Game 2
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('stanley', 'password2', 'stan', 1, 0, '00:17:56')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('stanley', 'password2', 'dad', 1, 1, '00:17:56')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}

// Daniel Game 1
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 'dantheman', 1, 0, '00:30:13')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 'bobthebuilder', 1, 1, '00:30:13')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
// Daniel Game 2
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 'dantheman', 1, 1, '00:00:30')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 'bobthebuilder', 1, 0, '00:00:30')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
// Daniel Game 3
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 'dantheman', 1, 0, '00:7:21')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 'iliketurtles', 1, 1, '00:7:21')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
// Daniel Game 4
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 'dantheman', 1, 1, '00:9:22')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO LocalBoard (Username, Password, LocalName, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 'iliketurtles', 1, 0, '00:9:22')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}

//Populate Global Leaderboard Table
$sql = "INSERT INTO GlobalBoard (Username, Password, GamesPlayed, GamesWon, TimePlayed) VALUES ('dolfo', 'password1', 3, 3, '00:23:06')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO GlobalBoard (Username, Password, GamesPlayed, GamesWon, TimePlayed) VALUES ('stanley', 'password2', 2, 0, '00:32:59')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}
$sql = "INSERT INTO GlobalBoard (Username, Password, GamesPlayed, GamesWon, TimePlayed) VALUES ('daniel', 'password3', 4, 2, '00:47:26')";
if ($conn->query($sql) === FALSE) {
    echo "Error Inserting Record: " . $conn->error;
    $error = TRUE;
}

//Close connection to database
$conn->close();

// If no errors, redirect back to index.html
if ($error == FALSE){
    header("Location: ../index.html");
}
?>