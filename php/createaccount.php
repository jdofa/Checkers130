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

//Unset session variables and set them as we check if user exists, or if password does not match
if(isset($_SESSION['userExists'])){
    unset($_SESSION['userExists']);
}
if(isset($_SESSION['badMatch'])){
    unset($_SESSION['badMatch']);
}

// Get username and password from login form
$username = $_POST['username'];
$password = $_POST['password'];
$password2 = $_POST['password2'];


$sql = "SELECT * FROM Users WHERE Username = '$username'";
$result = $conn -> query($sql);
if ($result -> num_rows == 0) { 
    //Username is avaliable, now check if password matches
    if($password == $password2){
        //Everything is good, create user, redirect to index.php
        $sql = "INSERT INTO Users (Username, Password) VALUES ('$username', '$password')";
        if ($conn->query($sql) === FALSE) {
            echo "Error Creating User: " . $conn->error;
            $error = TRUE;
        }

        //Add user to GlobalBoard Table with default values of 0.
        $sql = "INSERT INTO GlobalBoard (Username, Password, GamesPlayed, GamesWon, TimePlayed) VALUES ('$username', '$password', 0, 0, '00:00:00')";
        if ($conn->query($sql) === FALSE) {
            echo "Error Inserting Record: " . $conn->error;
            $error = TRUE;
        }

        //set needed session variables
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;
        $_SESSION['password'] = $password;
        if($error == FALSE){
            header("Location: ../index.php");
        }
    }
    else{
        //Passwords do not match, set badMatch session variable
        $_SESSION['loggedin'] = false;
        $_SESSION['badMatch'] = true;
        if($error == FALSE){
            header("Location: ../signup.php");
        }
    }
}
else {
    //Username was taken, set userExists session variable
    $_SESSION['loggedin'] = false;
    $_SESSION['userExists'] = true;
    if($error == FALSE){
        header("Location: ../signup.php");
    }
}
?>