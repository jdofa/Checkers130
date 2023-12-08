<?php
session_start();
if (!isset($_SESSION['loggedin'])){
    $_SESSION['loggedin'] = false;
}

?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Home</title>
        <link rel="stylesheet" href="css/index.css">
        <script src="js/index.js"></script>
    </head>
    <body>
        <header>
            <img class="site-logo" src="img/fresnostate.png" alt="Fresno State Logo">
            <h1>CSCI 130: Checkers Project</h1>
            <?php 
                if (isset($_SESSION['username'])){
                    $name = $_SESSION['username'];
                    echo "<h1 id='username'>Welcome $name!</h1>";
                }
            ?>
            <img class="site-logo" src="img/bulldog.png" alt="Fresno State Logo">
        </header>
        <nav>
            <?php
                //Logged In
                if ($_SESSION['loggedin'] == true && isset($_SESSION['loggedin'])) {
                    echo '<a class="menu-button" href="options.php">Start Game</a>';
                    echo '<a class="menu-button" href="php/logout.php">Logout</a>';
                    echo '<a class="menu-button" href="leaderboard.php">Global Leaderboard</a>';
                    echo '<a class="menu-button" href="localleaderboard.php">Local Leaderboard</a>';
                } 
                //Logged Out
                else{
                    echo '<a class="menu-button" href="login.php">Login</a>';
                    echo '<a class="menu-button" href="signup.php">Sign Up</a>';
                    echo '<a class="menu-button" href="leaderboard.php">Global Leaderboard</a>';
                }
            ?>
            <a class="menu-button" href="help.html">Help</a>
            <a class="menu-button" href="contact.html">Contact Us</a>
            <?php //Hide Database Creation Button if pressed
                if (!isset($_SESSION['databaseCreated'])){
                    echo '<form method="post" action="php/createdb.php">';
                    echo '<input class="menu-button" type="submit" value="Create Database">';
                    echo '</form>';
                }
            ?>
        </nav>
    </body>
</html>