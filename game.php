<?php
session_start();
$boardSize = $_SESSION['boardSize'];
$boardColor1 = $_SESSION['boardColor1'];
$boardColor2 = $_SESSION['boardColor2'];
$player1Name = $_SESSION['player1Name'];
$player1Color = $_SESSION['player1Color'];
$player2Name = $_SESSION['player2Name'];
$player2Color = $_SESSION['player2Color'];
$gameMode = $_SESSION['gameMode'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Checkers</title>
    <link rel="stylesheet" href="css/game.css">
    <style>
        .red-piece {
            <?php echo "background-color: $player1Color;" ?>
        }

        .black-piece {
            <?php echo "background-color: $player2Color;" ?>
        }
        .dark {
            <?php echo "background-color: $boardColor1;" ?>
        }

        .light {
            <?php echo "background-color: $boardColor2;" ?>
        }
    </style>
</head>
<body>
    <header>
    <h1>Checkers Game</h1>
    <nav>
        <a href="index.php">Quit</a>    
    </nav>
    </header>
    <div id="gameOptions">
        <select id="opponentType" hidden>
            <option value="<?php echo "$gameMode"; ?>" selected>Human</option>
        </select>
        <select id="boardSize" hidden>
            <option value="<?php echo "$boardSize"; ?>" selected>8x8</option>

        </select>
        <select id="player1Color" hidden>
            <option value="red">Red</option>
            <option value="black">Black</option>
        </select>
        <select id="player2Color" hidden>
            <option value="black">Black</option>
            <option value="red">Red</option>
        </select>
    </div>
    <div class="button-container">
        <button id="createGameButton" onclick="createBoard()">Start Game</button>
        <button id="resetButton" onclick="resetGame()">Reset Game</button>
    </div>
    <div class="game-info" id="gameInfo">
        <p>Time Elapsed: <span id="timeElapsed">0:00</span></p>
        <p style="color: <?php echo $player1Color; ?>;">Player 1 Pieces: <span id="player1PiecesCount">12</span></p>
        <p style="color: <?php echo $player2Color; ?>;">Player 2 Pieces: <span id="player2PiecesCount">12</span></p>
    </div>
    <div id="gameStatus" 
         data-player1-color="<?php echo htmlspecialchars($player1Color); ?>" 
         data-player2-color="<?php echo htmlspecialchars($player2Color); ?>">
        Starting the game...
    </div>
    <?php
    echo "<p class='gameName' style='color: $player1Color;'> Player 1: $player1Name </p>";
    ?>
    <div id="checkerboard" class="checkerboard"></div>
    <?php
    echo "<p class='gameName' style='margin-bottom: 100px;color: $player2Color;'> Player 2: $player2Name </p>";
    ?>
    <script src="js/game.js"></script>
</body>
</html>
