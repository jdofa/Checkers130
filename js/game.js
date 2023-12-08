document.getElementById('createGameButton').addEventListener('click', createBoard);

let selectedPiece = null;
let currentPlayer = 'red';
let boardSize = 8; // Default board size
let board = []; // 2D array to represent the board state
let startTime;
let elapsedTime = 0;
let timerInterval;
let isGameOver = false;
const PLAYER_COLOR = 'red';
const BOT_COLOR = 'black';


//This function is responsible for creating the game board based on user inputs, 
//such as board size and player colors. It initializes the game state, sets up the board's visual 
//representation, and prepares for the game to start.
function createBoard() {
    // Retrieve and validate the board size
    boardSize = parseInt(document.getElementById('boardSize').value);
    if (isNaN(boardSize) || boardSize % 2 !== 0 || boardSize < 8 || boardSize > 10) {
        alert("Invalid board size. Please enter an even number between 8 and 10.");
        return;
    }

    // Retrieve player colors and opponent type
    const player1Color = document.getElementById('player1Color').value;
    const player2Color = document.getElementById('player2Color').value;
    const opponentType = document.getElementById('opponentType').value;

    currentPlayer = opponentType === 'bot' ? 'bot' : 'red';

    const checkerboard = document.getElementById('checkerboard');
    checkerboard.innerHTML = '';
    checkerboard.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;
    checkerboard.style.gridTemplateRows = `repeat(${boardSize}, 50px)`;

    board = [];

    for (let row = 0; row < boardSize; row++) {
        const rowData = [];
        for (let col = 0; col < boardSize; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');

            // Updated piece placement logic
            const pieceColor = shouldPlacePiece(row, col, boardSize) ? 
                               (row < boardSize / 2 - 1 ? player1Color : 
                               (row > boardSize / 2 ? player2Color : null)) : null;
            rowData.push(pieceColor);

            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', () => handleSquareClick(row, col));

            if (pieceColor) {
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add(`${pieceColor}-piece`);
                square.appendChild(piece);
            }
            checkerboard.appendChild(square);
        }
        board.push(rowData);
    }

    // Reset the game status and piece counts
    resetTimer();
    updatePieceCount();

    // Initialize game status without declaring a winner
    updateGameStatus(false); // The 'false' parameter prevents winner checking

    // Delay the bot's first move if the bot starts
    if (currentPlayer === 'bot') {
        setTimeout(makeBotMove, 1000); // Delay for better UX
    }
}


//A utility function that checks if a piece on the board at a given position is a king piece.
function isKingPiece(row, col) {
    const piece = board[row][col];
    return piece ? piece.king : false;
}


//Determines if a piece should be placed on a specific square of the board based on its position and board size.
function shouldPlacePiece(row, col, boardSize) {
    return (row + col) % 2 !== 0 && (row < 3 || row >= boardSize - 3);
}


//Handles the logic when a square on the board is clicked. It allows players to select, move, and make moves with their pieces.
function handleSquareClick(row, col) {
    // Check if the game is over
    if (isGameOver) {
        console.log("Game is over. No more moves allowed.");
        return; // Exit the function if the game is over
    }

    console.log(`Square clicked: row ${row}, col ${col}, current player: ${currentPlayer}`);
    const pieceColor = board[row][col];

    // Clear previous selections and highlighted moves
    clearSelection();
    clearHighlightedMoves();

    if (selectedPiece === null && pieceColor === currentPlayer) {
        console.log("Piece selected");
        selectedPiece = { row, col };

        // Add selection class to the clicked square
        const clickedSquare = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (clickedSquare) {
            clickedSquare.classList.add('selected-square');
        }

        // Calculate and highlight possible moves
        calculatePossibleMoves(row, col);
    } else if (selectedPiece) {
        if (selectedPiece.row === row && selectedPiece.col === col) {
            console.log("Piece deselected");
            selectedPiece = null;
        } else if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
            console.log("Moving piece");
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            selectedPiece = null; // Clear selected piece after move
            clearHighlightedMoves(); // Clear highlighted moves after a move
            // After moving, check for a winner
            updateGameStatus(); // This will check for a winner and update the game status
        } else {
            console.log("Invalid move");
            selectedPiece = null; // Clear selected piece if move is invalid
        }
    }
}


//Clears the selected square on the board.
function clearSelection() {
    const previouslySelected = document.querySelector('.selected-square');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected-square');
    }
}


//Clears the highlighted possible moves on the board.
function clearHighlightedMoves() {
    document.querySelectorAll('.square').forEach(square => {
        square.style.backgroundColor = ''; // Reset the background color
    });
}


//Checks if a player can capture an opponent's piece on the board.
function isCaptureAvailable(player) {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === player) {
                // Check all possible capture moves for this piece
                if (canCaptureFrom(row, col)) {
                    return true;
                }
            }
        }
    }
    return false;
}


//Determines if a piece at a specific position can make a capture move.
function canCaptureFrom(row, col) {
    const player = board[row][col];
    const opponent = player === 'red' ? 'black' : 'red';
    const directions = getPlayerDirections(player, row, col);

    for (let dir of directions) {
        const midRow = row + dir.dr;
        const midCol = col + dir.dc;
        const newRow = row + 2 * dir.dr;
        const newCol = col + 2 * dir.dc;

        if (isInsideBoard(newRow, newCol) && 
            board[midRow][midCol] === opponent && 
            board[newRow][newCol] === null) {
            return true;
        }
    }
    return false;
}


//Checks if a capture move from one position to another is valid.
function isValidCaptureMove(fromRow, fromCol, toRow, toCol) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;

    return board[toRow][toCol] === null && 
           board[midRow][midCol] !== null && 
           board[midRow][midCol] !== currentPlayer;
}


//Checks if a move involves capturing an opponent's piece.
function isCaptureMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;

    return rowDiff === 2 && colDiff === 2 && 
           board[midRow][midCol] !== null && 
           board[midRow][midCol] !== currentPlayer;
}


//Checks if a move from one position to another is valid.
function isValidMove(fromRow, fromCol, toRow, toCol) {
    console.log(`Checking valid move from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);

    // Check if the move is within the board boundaries
    if (!isInsideBoard(toRow, toCol)) {
        console.log("Move is outside board boundaries.");
        return false;
    }

    // Get the moving piece's information
    const movingPiece = board[fromRow][fromCol];
    const isKing = movingPiece && movingPiece.king;

    // Calculate the differences in rows and columns to determine the type of move
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Check if it's a regular move (one square diagonally)
    const isRegularMove = Math.abs(rowDiff) === 1 && colDiff === 1;

    if (isRegularMove) {
        // Check if the destination square is empty
        if (board[toRow][toCol] !== null) {
            console.log("Destination square is not empty.");
            return false;
        }

        // Check the direction of the move for non-king pieces
        if (!isKing && ((currentPlayer === 'red' && rowDiff !== 1) || (currentPlayer === 'black' && rowDiff !== -1))) {
            console.log("Invalid direction for regular move.");
            return false;
        }

        console.log("Valid regular move.");
        return true;
    }

    // Check if it's a capture move (two squares diagonally)
    const isCaptureMove = Math.abs(rowDiff) === 2 && colDiff === 2;

    if (isCaptureMove) {
        // Calculate middle square for capture move
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;

        // Check if the middle square has an opponent's piece and destination square is empty
        const isOpponentPiece = board[midRow][midCol] !== null && board[midRow][midCol] !== currentPlayer;
        if (board[toRow][toCol] === null && isOpponentPiece) {
            console.log("Valid capture move.");
            return true;
        } else {
            console.log("Invalid capture move.");
            return false;
        }
    }

    // If neither a valid regular move nor a valid capture move, then it's not valid
    console.log("Move is not valid.");
    return false;
}


//Determines if a given row and column are within the boundaries of the board.
function isInsideBoard(row, col) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}


// Resets the game state to the initial setup, including player turns, the timer, and the board.
function resetGame() {
    selectedPiece = null;
    currentPlayer = 'red';
    resetTimer(); // Reset the timer
    updatePieceCount(); // Update the piece count
    createBoard(); // Re-create the board
}


// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    document.getElementById("timeElapsed").innerText = "00:00";
    startTimer(); // Start the timer
}


//Moves a game piece from one position to another on the board.
function movePiece(fromRow, fromCol, toRow, toCol) {
    console.log(`Moving piece from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);
    let movedPiece = board[fromRow][fromCol];

    if (!movedPiece) {
        console.error('Error: No piece found at starting square');
        return;
    }

    // Update the board array to reflect the piece's new position
    board[toRow][toCol] = movedPiece;
    board[fromRow][fromCol] = null;

    // Clear the selection
    const previouslySelected = document.querySelector('.selected-square');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected-square');
    }

    // Handle capture
    if (Math.abs(fromRow - toRow) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        if (board[midRow][midCol]) {
            board[midRow][midCol] = null; // Remove the captured piece from the board array
            removePieceFromBoard(midRow, midCol); // Remove the captured piece visually
        }
    }

    updatePieceOnBoard(fromRow, fromCol, toRow, toCol); // Update the visual representation of the board

    // Check for kinging
    if (!movedPiece.king && ((movedPiece.color === 'red' && toRow === boardSize - 1) || (movedPiece.color === 'black' && toRow === 0))) {
        movedPiece.king = true;
        kingPiece(toRow, toCol); // King the piece if it reaches the opposite end of the board
    }

    // Switch to the other player after the move
    togglePlayer(); 

    // Update the piece count after the move
    updatePieceCount(); 

    // Clear highlighted moves after a move
    clearHighlightedMoves(); 
}


//Removes a piece visually from the board at the specified position.
function removePieceFromBoard(row, col) {
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (square) {
        const piece = square.querySelector('.piece');
        if (piece) square.removeChild(piece);
    }
}


//Updates the visual representation of a piece on the board when it is moved.
function updatePieceOnBoard(fromRow, fromCol, toRow, toCol) {
    const squareFrom = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const squareTo = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);

    if (!squareFrom || !squareTo) {
        console.error('Error: Square not found in DOM');
        return;
    }

    const piece = squareFrom.querySelector('.piece');
    if (piece) {
        squareTo.appendChild(piece);
    } else {
        console.error('Error: Piece not found in DOM');
    }
}


//Promotes a piece to a king if it reaches the opposite end of the board.
function kingPiece(row, col) {
    // Update the UI
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const piece = square.querySelector('.piece');
    piece.classList.add('king');

    // Update the internal game state
    // Assuming each cell in the board array contains an object with a 'king' property
    board[row][col].king = true;
}


//Updates the hover effect on squares based on the current player's turn.
function updateHoverEffect() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        square.classList.remove('player-red', 'player-black');
        if (currentPlayer === 'red') {
            square.classList.add('player-red');
        } else if (currentPlayer === 'black') {
            square.classList.add('player-black');
        }
    });
}


//Updates the game status, checking for a winner or the current player's turn.
function updateGameStatus() {
    const winner = checkForWinner();
    console.log("[Game Status] Checking for winner:", winner);
    const statusDiv = document.getElementById('gameStatus');

    if (winner) {
        console.log(`[Game Status] Winner found: ${winner}`);
        statusDiv.innerHTML = `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins the game!`;
        isGameOver = true;
    } else {
        console.log("[Game Status] Game ongoing. Current player:", currentPlayer);
        statusDiv.innerHTML = `Current Player: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;
    }
}


//Calculates and highlights possible moves for a selected piece.
function calculatePossibleMoves(row, col) {
    const possibleMoves = [];
    const blockedMoves = [];

    // Check all four diagonal directions
    checkMoveDirection(possibleMoves, blockedMoves, row, col, 1, 1);  // down-right
    checkMoveDirection(possibleMoves, blockedMoves, row, col, 1, -1); // down-left
    checkMoveDirection(possibleMoves, blockedMoves, row, col, -1, 1); // up-right
    checkMoveDirection(possibleMoves, blockedMoves, row, col, -1, -1); // up-left

    highlightMoves(possibleMoves, 'green');
    highlightMoves(blockedMoves, 'red');
}


//Checks and adds possible moves in a specific direction based on the current player's piece.
function checkMoveDirection(possibleMoves, blockedMoves, row, col, rowIncrement, colIncrement) {
    const newRow = row + rowIncrement;
    const newCol = col + colIncrement;

    if (isInsideBoard(newRow, newCol)) {
        if (board[newRow][newCol] === null && ((currentPlayer === 'red' && rowIncrement === 1) || (currentPlayer === 'black' && rowIncrement === -1))) {
            possibleMoves.push({ row: newRow, col: newCol });
        } else {
            blockedMoves.push({ row: newRow, col: newCol });
        }
    }
}


//Highlights squares on the board to indicate possible moves.
function highlightMoves(moves, color) {
    moves.forEach(move => {
        const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        if (square) {
            square.style.backgroundColor = color;
        }
    });
}


//Clears the highlighted move indicators on the board.
function clearHighlightedMoves() {
    document.querySelectorAll('.square').forEach(square => {
        square.style.backgroundColor = ''; // Reset the background color
    });
}


//Initializes and starts the game timer.
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        document.getElementById("timeElapsed").innerText = timeToString(elapsedTime);
    }, 1000);
}


//Converts a time duration to a formatted string (MM:SS).
function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}`;
}


//Updates the count of pieces for each player on the board.
function updatePieceCount() {
    let redPieces = 0;
    let blackPieces = 0;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 'red') redPieces++;
            if (board[row][col] === 'black') blackPieces++;
        }
    }

    document.getElementById("redPiecesCount").innerText = redPieces;
    document.getElementById("blackPiecesCount").innerText = blackPieces;
}


//Checks if there is a winner in the game based on the number of remaining pieces and their ability to move.
function checkForWinner() {
    let redPieces = 0;
    let blackPieces = 0;
    let redCanMove = false;
    let blackCanMove = false;

    // Count the remaining pieces for each player and check if they can move
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 'red') {
                redPieces++;
                if (canMakeMove(row, col, 'red') || canCaptureFrom(row, col)) {
                    redCanMove = true;
                }
            }
            if (board[row][col] === 'black') {
                blackPieces++;
                if (canMakeMove(row, col, 'black') || canCaptureFrom(row, col)) {
                    blackCanMove = true;
                }
            }
        }
    }

    // Check for win conditions
    if (blackPieces === 0 || !blackCanMove) {
        isGameOver = true; // Set the game over flag
        alert('Red wins!');
        return 'red';
    } else if (redPieces === 0 || !redCanMove) {
        isGameOver = true; // Set the game over flag
        alert('Black wins!');
        return 'black';
    }

    return null; // No winner yet
}


// Checks if a player can make a regular move from a given position.
function canMakeMove(row, col, player) {
    const directions = getPlayerDirections(player, row, col);
    
    for (let dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        if (isInsideBoard(newRow, newCol) && board[newRow][newCol] === null) {
            return true;
        }
    }
    return false;
}


//Determines the valid move directions for a player's piece.
function getPlayerDirections(player, row, col) {
    const isKing = isKingPiece(row, col); // Replace with your logic to check if the piece is a king
    console.log(`[Get Player Directions] Checking directions for ${player} at (${row}, ${col}) - Is King: ${isKing}`);
    let directions = [];

    if (player === 'red' || isKing) {
        directions.push({ dr: 1, dc: -1 }, { dr: 1, dc: 1 }); // Down-left and down-right for red or king
    }
    if (player === 'black' || isKing) {
        directions.push({ dr: -1, dc: -1 }, { dr: -1, dc: 1 }); // Up-left and up-right for black or king
    }

    console.log(`[Get Player Directions] Directions for ${player}:`, directions);
    return directions;
}


///Creating a bot to play

let isBotMoveMade = false;

// Initiates the bot's move, including selecting the best move using the minimax algorithm.
function makeBotMove() {
    console.log("makeBotMove called, currentPlayer:", currentPlayer);

    if (currentPlayer !== 'bot' || isBotMoveMade) {
        return; // Exit if it's not the bot's turn or a move has already been made
    }

    let legalMoves = findAllLegalMoves(BOT_COLOR);
    console.log("[Bot Move] Legal moves found:", legalMoves);

    if (legalMoves.length === 0) {
        console.log("[Bot Move] Bot has no moves. Player wins!");
        isGameOver = true;
        updateGameStatus();
        return;
    }

    let bestMove = selectBestMove(legalMoves);
    console.log("[Bot Move] Selected move:", bestMove);

    setTimeout(() => {
        movePiece(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
        isBotMoveMade = true; // Mark that the bot has made its move
        togglePlayer(); // Switch to the other player
        updateGameStatus();
    }, 500);
}


// Toggles between players and handles bot moves.
function togglePlayer() {
    if (gameMode === 'bot') {
        if (currentPlayer === 'bot') {
            // After bot's turn, switch to red
            currentPlayer = 'red';
            isBotMoveMade = false; // Reset bot move flag
        } else {
            // If it's red's turn, switch to bot and check if a move is to be made
            currentPlayer = 'bot';
            if (!isBotMoveMade) {
                setTimeout(makeBotMove, 500);
            }
        }
    } else if (gameMode === 'human') {
        // In human mode, just switch between red and black
        currentPlayer = (currentPlayer === 'red') ? 'black' : 'red';
    }

    console.log(`Player toggled: ${currentPlayer}`);
    updateGameStatus();
}



//Implements the minimax algorithm for selecting the best move for the bot.
function minimax(board, depth, maximizingPlayer) {
    if (depth === 0 || isGameOver) {
        return evaluateBoard(board);
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        let bestMove;
        let moves = findAllLegalMoves(BOT_COLOR);
        for (let move of moves) {
            let newBoard = simulateMove(board, move);
            let eval = minimax(newBoard, depth - 1, false);
            if (eval > maxEval) {
                maxEval = eval;
                bestMove = move;
            }
        }
        if (depth === MAX_DEPTH) return bestMove;
        return maxEval;
    } else {
        let minEval = Infinity;
        let moves = findAllLegalMoves(OPPONENT_COLOR);
        for (let move of moves) {
            let newBoard = simulateMove(board, move);
            let eval = minimax(newBoard, depth - 1, true);
            minEval = Math.min(minEval, eval);
        }
        return minEval;
    }
}


// Simulates a move on a board to evaluate potential outcomes.
function simulateMove(board, move) {
    let newBoard = JSON.parse(JSON.stringify(board)); // Deep copy of board

    // Move the piece in newBoard
    newBoard[move.toRow][move.toCol] = newBoard[move.fromRow][move.fromCol];
    newBoard[move.fromRow][move.fromCol] = null;

    // Handle capture
    if (Math.abs(move.fromRow - move.toRow) === 2) {
        const midRow = (move.fromRow + move.toRow) / 2;
        const midCol = (move.fromCol + move.toCol) / 2;
        newBoard[midRow][midCol] = null; // Capture the opponent's piece
    }

    // Check for kinging (if the piece reaches the opposite end of the board)
    const piece = newBoard[move.toRow][move.toCol];
    if (piece && !piece.king) {
        if ((piece.color === 'red' && move.toRow === board.length - 1) || 
            (piece.color === 'black' && move.toRow === 0)) {
            piece.king = true; // Promote the piece to a king
        }
    }

    return newBoard;
}


//Evaluates the current state of the board and returns a score.
function evaluateBoard(board) {
    let score = 0;
    // Example scoring logic: +1 for each bot piece, -1 for each opponent piece
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === BOT_COLOR) score += 1;
            else if (board[row][col] === OPPONENT_COLOR) score -= 1;
        }
    }
    return score;
}


//Selects the best move from a list of legal moves for the bot.
function selectBestMove(legalMoves) {
    // Example logic for selecting one move - can be modified for more complex strategy
    return legalMoves[0]; // For now, simply return the first move in the list
}


//Finds all legal moves for a given player on the board.
function findAllLegalMoves(player) {
    let moves = [];
    console.log(`[Find Legal Moves] Finding moves for ${player}`);

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === player) {
                let regularMoves = findRegularMoves(row, col, player);
                moves = moves.concat(regularMoves);

                let captureMoves = findCaptureMoves(row, col, player);
                moves = moves.concat(captureMoves);
            }
        }
    }

    console.log(`[Find Legal Moves] Total moves found for ${player}:`, moves);
    return moves;
}


function findRegularMoves(row, col, player) {
    let regularMoves = [];
    const directions = getPlayerDirections(player, row, col);

    for (let dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        if (isInsideBoard(newRow, newCol) && board[newRow][newCol] === null) {
            regularMoves.push({ fromRow: row, fromCol: col, toRow: newRow, toCol: newCol });
        }
    }

    return regularMoves;
}

function findCaptureMoves(row, col, player) {
    let captureMoves = [];
    const directions = getPlayerDirections(player, row, col);

    for (let dir of directions) {
        const midRow = row + dir.dr;
        const midCol = col + dir.dc;
        const newRow = row + 2 * dir.dr;
        const newCol = col + 2 * dir.dc;

        if (isInsideBoard(newRow, newCol) && 
            board[midRow][midCol] !== null && 
            board[midRow][midCol] !== player && 
            board[newRow][newCol] === null) {
            captureMoves.push({ fromRow: row, fromCol: col, toRow: newRow, toCol: newCol });
        }
    }

    return captureMoves;
}

let gameMode = 'human'; // Default to 'human' mode


document.getElementById('opponentType').addEventListener('change', function() {
    gameMode = this.value; // Correctly set the game mode
    let opponentType = this.value;
    gameMode = opponentType; // Set game mode to either 'bot' or 'human'

    // Reset the game state to initial conditions
    resetGame();

    // Set the currentPlayer based on the selected opponent type
    currentPlayer = (opponentType === 'bot') ? 'bot' : 'red';

    // Reinitialize the board with the new settings
    createBoard();
});



function resetGame() {
    // Reset the game state variables
    selectedPiece = null;
    elapsedTime = 0;
    isGameOver = false;
    
    // Clear any existing timer
    clearInterval(timerInterval);

    // Reset the game board visual elements
    const checkerboard = document.getElementById('checkerboard');
    if (checkerboard) {
        checkerboard.innerHTML = '';
    }

    // Reset game status display
    const statusDiv = document.getElementById('gameStatus');
    if (statusDiv) {
        statusDiv.innerHTML = 'Game reset. Starting new game...';
    }

    // Reset piece counts or any other counters
    // Recreate the board with the current settings
    createBoard();
}