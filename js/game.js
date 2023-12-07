document.getElementById('createGameButton').addEventListener('click', createBoard);

let selectedPiece = null;
let currentPlayer = 'red';
let boardSize = 8; // Default board size
let board = []; // 2D array to represent the board state

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
}


function shouldPlacePiece(row, col, boardSize) {
    return (row + col) % 2 !== 0 && (row < 3 || row >= boardSize - 3);
}

function handleSquareClick(row, col) {
    console.log(`Square clicked: row ${row}, col ${col}, current player: ${currentPlayer}`);
    const pieceColor = board[row][col];

    if (selectedPiece === null && pieceColor === currentPlayer) {
        // Select piece if it belongs to the current player
        selectedPiece = { row, col };
    } else if (selectedPiece && !(selectedPiece.row === row && selectedPiece.col === col)) {
        // Attempt a move if a different square is clicked
        if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
        } else {
            console.log("Invalid move");
        }
        selectedPiece = null; // Clear selected piece after move attempt
    }
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

    // Regular move conditions: move diagonally to an adjacent empty square
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    const isRegularMove = Math.abs(rowDiff) === 1 && colDiff === 1;
    const isCaptureMove = Math.abs(rowDiff) === 2 && colDiff === 2;

    if (isRegularMove) {
        if (board[toRow][toCol] !== null) {
            console.log("Destination square is not empty.");
            return false;
        }

        // Check the direction of the move for non-king pieces
        if ((currentPlayer === 'red' && rowDiff !== -1) || (currentPlayer === 'black' && rowDiff !== 1)) {
            console.log("Invalid direction for regular move.");
            return false;
        }

        console.log("Valid regular move.");
        return true;
    }

    // Capture move conditions: jump over an opponent's piece into an empty square
    if (isCaptureMove) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        const isOpponentPiece = board[midRow][midCol] !== null && board[midRow][midCol] !== currentPlayer;

        if (board[toRow][toCol] === null && isOpponentPiece) {
            console.log("Valid capture move.");
            return true;
        } else {
            console.log("Invalid capture move.");
            return false;
        }
    }

    console.log("Move is not valid.");
    return false;
}





function isInsideBoard(row, col) {
    return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
}


function resetGame() {
    selectedPiece = null;
    currentPlayer = 'red';
    createBoard();
    updateGameStatus();
}



function movePiece(fromRow, fromCol, toRow, toCol) {
    console.log(`Moving piece from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);
    const pieceColor = board[fromRow][fromCol];

    // Update the board array to reflect the piece's new position
    board[toRow][toCol] = pieceColor;
    board[fromRow][fromCol] = null;

    // Handle capture
    if (Math.abs(fromRow - toRow) === 2) {
        const midRow = (fromRow + toRow) / 2;
        const midCol = (fromCol + toCol) / 2;
        board[midRow][midCol] = null; // Remove the captured piece from the board array
        removePieceFromBoard(midRow, midCol); // Remove the captured piece visually
    }

    updatePieceOnBoard(fromRow, fromCol, toRow, toCol); // Update the visual representation of the board

    // Check for kinging
    if ((pieceColor === 'red' && toRow === 0) || (pieceColor === 'black' && toRow === boardSize - 1)) {
        kingPiece(toRow, toCol); // King the piece if it reaches the opposite end of the board
    }

    togglePlayer(); // Switch to the other player after the move
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

    console.log(`Updating piece on board from (${fromRow}, ${fromCol}) to (${toRow}, ${toCol})`);

    if (!squareFrom || !squareTo) {
        console.error('Error: Square not found in DOM');
        return;
    }

    const piece = squareFrom.querySelector('.piece');
    if (!piece) {
        console.error('Error: Piece not found in DOM');
        return;
    }

    squareTo.appendChild(piece);
}


function kingPiece(row, col) {
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const piece = square.querySelector('.piece');
    piece.classList.add('king');
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    console.log(`Player toggled: ${currentPlayer}`);
    updateGameStatus();
}

function updateGameStatus() {
    const statusDiv = document.getElementById('gameStatus');
    statusDiv.innerHTML = `Current Player: ${currentPlayer}`;
}


