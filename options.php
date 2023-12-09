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
        <title>Options</title>
        <link rel="stylesheet" href="css/options.css">
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
            <a href="index.php">Home</a>
        </nav>
        <section>
            <h1>Options</h1>
            <form method="post">
            <div class="form-section">
                <label for="boardSize">Board Size:</label>
                <select id="boardSize" name="boardSize">
                    <option value="8" selected>8x8</option>
                    <option value="10">10x10</option>
                </select>
            </div>
            <div class="form-section">
                <label for="boardTheme">Board Theme:</label>
                <select id="boardTheme" name="boardTheme">
                    <option value="brown">Dark Brown / Light Brown</option>
                    <option value="blue">Dark Blue / Light Blue</option>
                    <option value="red">Dark Red / Light Red</option>
                    <option value="green">Dark Green / Light Green</option>
                </select>
            </div>
            <div class="form-section">
                <label for="player1Name">Player 1 Name:</label>
                <input type="text" id="player1Name" name="player1Name" placeholder="Enter Player 1 Name" required>
            </div>
            <div class="form-section">
                <label for="player1Color">Player 1 Color:</label>
                <select id="player1Color" name="player1Color">
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                </select>
            </div>
            <div class="form-section">
                <label for="player2Name">Player 2 Name:</label>
                <input type="text" id="player2Name" name="player2Name" placeholder="Enter Player 2 Name" required>
            </div>
            <div class="form-section">
                <label for="player2Color">Player 2 Color:</label>
                <select id="player2Color" name="player2Color">
                    <option value="black">Black</option>
                    <option value="orange">Orange</option>
                    <option value="magenta">Magenta</option>
                    <option value="purple">Purple</option>
                </select>
            </div>
            <div class="form-section">
                <label for="gameMode">Game Mode:</label>
                <select id="gameMode" name="gameMode">
                    <option value="human">Multiplayer</option>
                    <option value="bot">Single Player</option>
                </select>
            </div>
            <div class="form-section">
                <input formaction="php/setoptions.php" type="submit" value="Start Game">
            </div>
            </form>
        </section>
    </body>
</html>