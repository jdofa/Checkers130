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

// Get username and password from login form
$username = $_POST['username'];
$password = $_POST['password'];

// Check if username and password match
$sql = "SELECT * FROM Users WHERE Username = '$username'";
$result = $conn -> query($sql);
if ($result -> num_rows == 0) {
    //create user
    $sql = "INSERT INTO Users (Username, Password) VALUES ('$username', '$password')";
    if ($conn->query($sql) === FALSE) {
        echo "Error Creating User: " . $conn->error;
        $error = TRUE;
    }
    $_SESSION['loggedin'] = true;
    $_SESSION['username'] = $username;
    header("Location: ../index.php");
}
else {
    //user exists
    $_SESSION['loggedin'] = false;
    header("Location: ../login.php");
}
?>