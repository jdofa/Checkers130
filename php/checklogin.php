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
$sql = "SELECT * FROM Users WHERE Username = '$username' AND Password = '$password'";
$result = $conn -> query($sql);
if ($result -> num_rows == 0) { //No match found
    //First check if username exists
    $sql = "SELECT * FROM Users WHERE Username = '$username'";
    $result = $conn -> query($sql);
    if ($result -> num_rows == 0) { //Username does not exist
        $_SESSION['wronguser'] = true;
        $_SESSION['wrongpswd'] = false;
    }
    else{ //If it does, then password must be wrong
        $_SESSION['wronguser'] = false;
        $_SESSION['wrongpswd'] = true;
    }
    $_SESSION['loggedin'] = false;
    header("Location: ../login.php");
}
else {
    $_SESSION['loggedin'] = true;
    $_SESSION['username'] = $username;
    unset($_SESSION['wronguser']);
    unset($_SESSION['wrongpswd']);
    header("Location: ../index.php");
}
?>