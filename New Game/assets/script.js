document.getElementById('startButton').addEventListener('click', createBoard);

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
    const pieceColor = board[row][col];

    if (selectedPiece === null) {
        // Select piece if it belongs to the current player
        if (pieceColor === currentPlayer) {
            selectedPiece = { row, col };
        }
    } else {
        // Move piece if the move is valid
        if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
            movePiece(selectedPiece.row, selectedPiece.col, row, col);
            selectedPiece = null;
        } else {
            console.log("Invalid move");
        }
    }
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const pieceColor = board[fromRow][fromCol];
    board[fromRow][fromCol] = null;
    board[toRow][toCol] = pieceColor;

    const squareFrom = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const squareTo = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    const piece = squareFrom.querySelector('.piece');
    squareTo.appendChild(piece);

    // Check for captures
    const capturedPiece = getCapturedPiece(fromRow, fromCol, toRow, toCol);
    if (capturedPiece) {
        const [capturedRow, capturedCol] = capturedPiece;
        board[capturedRow][capturedCol] = null;
        document.querySelector(`[data-row="${capturedRow}"][data-col="${capturedCol}"]`).removeChild(document.querySelector(`[data-row="${capturedRow}"][data-col="${capturedCol}"] .piece`));
    }

    // Check for win condition (for demo purposes, just check if a piece reaches the opposite end)
    if (pieceColor === 'red' && toRow === 0) {
        endGame('red');
    } else if (pieceColor === 'black' && toRow === boardSize - 1) {
        endGame('black');
    }

    togglePlayer();
}

function getCapturedPiece(fromRow, fromCol, toRow, toCol) {
    // Check if there's a piece to capture during the move
    const capturedRow = (fromRow + toRow) / 2;
    const capturedCol = (fromCol + toCol) / 2;

    if (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 2 && board[capturedRow][capturedCol] !== null) {
        return [capturedRow, capturedCol];
    }
    return null;
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    updateGameStatus();
}

function updateGameStatus() {
    const statusDiv = document.getElementById('gameStatus');
    statusDiv.innerHTML = `Current Player: ${currentPlayer}`;
}

function endGame(winner) {
    const statusDiv = document.getElementById('gameStatus');
    statusDiv.innerHTML = `Winner: ${winner}`;
    // Disable further clicks to end the game
    document.getElementById('checkerboard').removeEventListener('click', handleSquareClick);
}




// Define the maximum depth for the minimax algorithm (controls the AI's level of thinking)
const MAX_DEPTH = 4;

function aiPlayerMove() {
    const bestMove = minimax(board, MAX_DEPTH, currentPlayer, -Infinity, Infinity, true);
    
    if (bestMove) {
        const [fromRow, fromCol, toRow, toCol] = bestMove;
        // Simulate a click on the selected squares to move the piece
        handleSquareClick(fromRow, fromCol);
        handleSquareClick(toRow, toCol);
    } else {
        // AI cannot make any moves, game over
        endGame(currentPlayer === 'red' ? 'black' : 'red');
    }
}

function minimax(board, depth, player, alpha, beta, maximizingPlayer) {
    if (depth === 0 || isGameOver(board)) {
        // Evaluate the board and return its value
        return evaluateBoard(board, player);
    }

    const validMoves = getAllValidMoves(board, player);

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        let bestMove = null;
        for (const move of validMoves) {
            const [fromRow, fromCol, toRow, toCol] = move;
            const boardCopy = cloneBoard(board);
            makeMove(boardCopy, fromRow, fromCol, toRow, toCol);
            const eval = minimax(boardCopy, depth - 1, player, alpha, beta, false);
            if (eval > maxEval) {
                maxEval = eval;
                bestMove = move;
            }
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) {
                break;
            }
        }
        return bestMove;
    } else {
        let minEval = Infinity;
        for (const move of validMoves) {
            const [fromRow, fromCol, toRow, toCol] = move;
            const boardCopy = cloneBoard(board);
            makeMove(boardCopy, fromRow, fromCol, toRow, toCol);
            const eval = minimax(boardCopy, depth - 1, player, alpha, beta, true);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }
}

function getAllValidMoves(board, player) {
    const validMoves = [];

    // Iterate through the board to find valid moves
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === player) {
                // Check for valid moves for the player's pieces
                const moves = getValidMovesForPiece(board, row, col, player);
                validMoves.push(...moves);
            }
        }
    }

    return validMoves;
}


function getValidMovesForPiece(board, row, col, player) {
    const validMoves = [];

    // Check diagonal moves for regular pieces
    if (player === 'red' || isKing(board, row, col)) {
        // Check top-left move
        if (isValidMove(board, row, col, row - 1, col - 1)) {
            validMoves.push([row, col, row - 1, col - 1]);
        }
        // Check top-right move
        if (isValidMove(board, row, col, row - 1, col + 1)) {
            validMoves.push([row, col, row - 1, col + 1]);
        }
    }

    // Check diagonal moves for king pieces
    if (player === 'black' || isKing(board, row, col)) {
        // Check bottom-left move
        if (isValidMove(board, row, col, row + 1, col - 1)) {
            validMoves.push([row, col, row + 1, col - 1]);
        }
        // Check bottom-right move
        if (isValidMove(board, row, col, row + 1, col + 1)) {
            validMoves.push([row, col, row + 1, col + 1]);
        }
    }

    return validMoves;
}

function isValidMove(board, fromRow, fromCol, toRow, toCol) {
    const numRows = board.length;
    const numCols = board[0].length;

    // Check if the destination square is within the board boundaries
    if (toRow < 0 || toRow >= numRows || toCol < 0 || toCol >= numCols) {
        return false;
    }

    // Check if the destination square is empty
    if (board[toRow][toCol] !== null) {
        return false;
    }

    // Determine the direction of movement (forward or backward)
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);

    // Regular pieces can only move forward
    if (rowDiff === 1 && colDiff === 1) {
        return true;
    }

    // King pieces can move both forward and backward
    if (rowDiff === 1 && colDiff === 1) {
        return true;
    }

    return false;
}


function isGameOver(board) {
    const redValidMoves = getAllValidMoves(board, 'red');
    const blackValidMoves = getAllValidMoves(board, 'black');

    return redValidMoves.length === 0 || blackValidMoves.length === 0;
}


function evaluateBoard(board, player) {
    const numRedPieces = countPieces(board, 'red');
    const numBlackPieces = countPieces(board, 'black');

    if (player === 'red') {
        return numRedPieces - numBlackPieces;
    } else {
        return numBlackPieces - numRedPieces;
    }
}

function countPieces(board, player) {
    let count = 0;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === player) {
                count++;
            }
        }
    }
    return count;
}


function cloneBoard(board) {
    const clone = [];
    for (let row = 0; row < board.length; row++) {
        clone.push([...board[row]]);
    }
    return clone;
}


function makeMove(board, fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    board[fromRow][fromCol] = null;
    board[toRow][toCol] = piece;
}


