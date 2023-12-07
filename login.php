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
        <form method="post" action="php/checklogin.php">
            <div class="form-section">
                <label>Username:</label>
                <input type="text" name="username" placeholder="Enter Username">
            </div>
            <div class="form-section">
                <label>Password:</label>
                <input type="password" name="password" placeholder="Enter Password">
            </div>
            <div class="form-section">
                <input type="submit" value="Log In">
            </div>
        </form>
    </body>
</html>