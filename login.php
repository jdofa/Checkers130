<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Login</title>
        <link rel="stylesheet" href="css/login.css">
    </head>
    <body>
        <header>
            <img class="site-logo" src="img/fresnostate.png" alt="Fresno State Logo">
            <h1>CSCI 130: Checkers Project</h1>
            <img class="site-logo" src="img/bulldog.png" alt="Fresno State Logo">
        </header>
        <nav>
            <a href="index.php">Home</a>
        </nav>
        <form method="post">
            <div class="form-section">
                <label>Username:</label>
                <input type="text" name="username" placeholder="Enter Username">
            </div>
            <div class="form-section">
                <label>Password:</label>
                <input type="password" name="password" placeholder="Enter Password">
            </div>
            <div class="form-section">
                <input formaction="php/checklogin.php" type="submit" value="Log In">
            </div>
            <?php
                if (isset($_SESSION['wronguser']) && $_SESSION['wronguser'] == true){
                    echo "<p>User does not exist.</p>";
                }
                if (isset($_SESSION['wrongpswd']) && $_SESSION['wrongpswd'] == true){
                    echo "<p>Incorrect password.</p>";
                }
            ?>
        </form>

    </body>
</html>