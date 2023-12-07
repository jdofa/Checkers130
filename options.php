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
            <img class="site-logo" src="img/bulldog.png" alt="Fresno State Logo">
        </header>
        <nav>
            <a href="index.php">Home</a>
        </nav>
        <section>
            <h1>Options</h1>
            <form>
            <div class="form-section">
                <label for="boardSize">Board Size:</label>
                <select id="boardSize">
                    <option value="8" selected>8x8</option>
                    <option value="10">10x10</option>
                </select>
            </div>
            <div class="form-section">
                <label for="player1Name">Player 1 Name:</label>
                <input type="text" id="player1Name" name="player1Name" placeholder="Enter Player 1 Name">
            </div>
            <div class="form-section">
                <label for="player1Color">Player 1 Color:</label>
                <select id="player1Color">
                    <option value="red">Red</option>
                    <option value="black">Black</option>
                </select>
            </div>
            <div class="form-section">
                <label for="player2Name">Player 2 Name:</label>
                <input type="text" id="player2Name" name="player2Name" placeholder="Enter Player 2 Name">
            </div>
            <div class="form-section">
                <label for="player2Color">Player 2 Color:</label>
                <select id="player2Color">
                    <option value="black">Black</option>
                    <option value="red">Red</option>
                </select>
            </div>
            <div class="form-section">
                <input type="submit" value="Start Game">
            </div>

            <a href="game.html">Start</a>
            </form>
        </section>
    </body>
</html>