document.getElementById('createGameButton').addEventListener('click', createBoard);

let selectedPiece = null;
let currentPlayer = 'red';
let boardSize = 8; // Default board size
let board = []; // 2D array to represent the board state
let startTime;
let elapsedTime = 0;
let timerInterval;



function createBoard() {
    boardSize = parseInt(document.getElementById('boardSize').value);
    const player1Color = document.getElementById('player1Color').value;
    const player2Color = document.getElementById('player2Color').value;
    const checkerboard = document.getElementById('checkerboard');
    checkerboard.innerHTML = '';
    checkerboard.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;
    checkerboard.style.gridTemplateRows = `repeat(${boardSize}, 50px)`;

    board = []; // Reset the board state

    for (let row = 0; row < boardSize; row++) {
        const rowData = [];
        for (let col = 0; col < boardSize; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');

            // Initialize the board state with null (no piece) or the player's color
            const pieceColor = shouldPlacePiece(row, col, boardSize) ? (row < 3 ? player1Color : player2Color) : null;
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

    updateGameStatus();
    resetTimer(); // Reset and start the timer
    updatePieceCount(); // Update the piece counts
}


function shouldPlacePiece(row, col, boardSize) {
    return (row + col) % 2 !== 0 && (row < 3 || row >= boardSize - 3);
}


function handleSquareClick(row, col) {
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

        // Calculate and highlight possible and blocked moves
        calculatePossibleMoves(row, col);
    } else if (selectedPiece) {
        if (selectedPiece.row === row && selectedPiece.col === col) {
            console.log("Piece deselected");
            selectedPiece = null;
        } else if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
            console.log("Moving piece");
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            selectedPiece = null; // Clear selected piece after move
        } else {
            console.log("Invalid move");
            selectedPiece = null; // Clear selected piece if move is invalid
        }
    }
}

function clearSelection() {
    const previouslySelected = document.querySelector('.selected-square');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected-square');
    }
}

function clearHighlightedMoves() {
    document.querySelectorAll('.square').forEach(square => {
        square.style.backgroundColor = ''; // Reset the background color
    });
}



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


function canCaptureFrom(row, col) {
    // Assuming regular pieces can only move forward (up for red, down for black)
    // Add additional checks for king pieces if implemented
    const directions = [
        { dr: -2, dc: -2 }, { dr: -2, dc: 2 },  // Directions for red or king
        { dr: 2, dc: -2 }, { dr: 2, dc: 2 }     // Directions for black or king
    ];

    for (let dir of directions) {
        const newRow = row + dir.dr;
        const newCol = col + dir.dc;
        if (isInsideBoard(newRow, newCol) && isValidCaptureMove(row, col, newRow, newCol)) {
            return true;
        }
    }

    return false;
}


function isValidCaptureMove(fromRow, fromCol, toRow, toCol) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;

    return board[toRow][toCol] === null && 
           board[midRow][midCol] !== null && 
           board[midRow][midCol] !== currentPlayer;
}


function isCaptureMove(fromRow, fromCol, toRow, toCol) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;

    return rowDiff === 2 && colDiff === 2 && 
           board[midRow][midCol] !== null && 
           board[midRow][midCol] !== currentPlayer;
}


function isValidMove(fromRow, fromCol, toRow, toCol) {
    console.log(`Checking valid move from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);

    // Check if the move is within the board boundaries
    if (!isInsideBoard(toRow, toCol)) {
        console.log("Move is outside board boundaries.");
        return false;
    }

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
        // Red moves down (increasing row number), black moves up (decreasing row number)
        if ((currentPlayer === 'red' && rowDiff !== 1) || (currentPlayer === 'black' && rowDiff !== -1)) {
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


function isInsideBoard(row, col) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}


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


function movePiece(fromRow, fromCol, toRow, toCol) {
    console.log(`Moving piece from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);
    const pieceColor = board[fromRow][fromCol];

    // Update the board array to reflect the piece's new position
    board[toRow][toCol] = pieceColor;
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
        if (board[midRow][midCol] !== null) {
            board[midRow][midCol] = null; // Remove the captured piece from the board array
            removePieceFromBoard(midRow, midCol); // Remove the captured piece visually
        }
    }

    updatePieceOnBoard(fromRow, fromCol, toRow, toCol); // Update the visual representation of the board

    // Check for kinging
    if ((pieceColor === 'red' && toRow === 0) || (pieceColor === 'black' && toRow === boardSize - 1)) {
        kingPiece(toRow, toCol); // King the piece if it reaches the opposite end of the board
    }

    togglePlayer(); // Switch to the other player after the move
    updatePieceCount(); // Update the piece count after the move
}



function removePieceFromBoard(row, col) {
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (square) {
        const piece = square.querySelector('.piece');
        if (piece) square.removeChild(piece);
    }
}


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


function kingPiece(row, col) 
{
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const piece = square.querySelector('.piece');
    piece.classList.add('king');
}


function togglePlayer() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    console.log(`Player toggled: ${currentPlayer}`);
    updateGameStatus();
    updateHoverEffect(); // Add this line to update the hover effect
}


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


function updateGameStatus() {
    const statusDiv = document.getElementById('gameStatus');
    statusDiv.innerHTML = `Current Player: ${currentPlayer}`;
}


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

function highlightMoves(moves, color) {
    moves.forEach(move => {
        const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        if (square) {
            square.style.backgroundColor = color;
        }
    });
}

function clearHighlightedMoves() {
    document.querySelectorAll('.square').forEach(square => {
        square.style.backgroundColor = ''; // Reset the background color
    });
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;
        document.getElementById("timeElapsed").innerText = timeToString(elapsedTime);
    }, 1000);
}


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



