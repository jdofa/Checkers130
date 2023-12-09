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

// Get username and password from login form
$currUser = $_POST['username'];
$currPswd = $_POST['password'];

// Check if username and password match
$sql = "SELECT * FROM Users WHERE Username = '$currUser' AND Password = '$currPswd'";
$result = $conn -> query($sql);
if ($result -> num_rows == 0) { //No match found
    //First check if username exists
    $sql = "SELECT * FROM Users WHERE Username = '$currUser'";
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
    $_SESSION['username'] = $currUser;
    $_SESSION['password'] = $currPswd;
    unset($_SESSION['wronguser']);
    unset($_SESSION['wrongpswd']);
    header("Location: ../index.php");
}
?>