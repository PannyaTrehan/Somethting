const squares = document.querySelectorAll(".square");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

let board = Array.from({ length: 8}, () => Array(8).fill(''));
let currentPlayer = "White";
let running = false;
let isSecondClick = false;
let currentPiece = "";
let previousPieceRow = -1;
let previousPieceColumn = -1;
let removedWhite = [];
let removedBlack = [];
//create two arrays, each for the pieces that were taken from the other player  (white and black)

initialiseGame();

function initialiseGame() {
    squares.forEach (square => {
        square.addEventListener("click", clickManagement);
    });
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    setInitialBoard();
    running = true;
}

function setInitialBoard() {
    let pieces = [
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["R", "N", "B", "Q", "K", "B", "N", "R"]
    ];

    for (let row = 0; row < 2; row++) {
        for (let column = 0; column < 8; column++) {
            if (row === 0) {
                board[row][column] = (pieces[1][column] + "b");
                updateSquare(row, column, board[row][column]);
            } else {
                board[row][column] = (pieces[0][column] + "b");
                updateSquare(row, column, board[row][column]);
            }
        }
    }

    for (let row = 6; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            board[row][column] = (pieces[row - 6][column] + "w");
            updateSquare(row, column, board[row][column]);
        }
    }
}

function clickManagement() {
    if (!isSecondClick) {
        clearStarAndBracket();
        const squareIndex = this.getAttribute("squareIndex");
        previousPieceRow = Math.floor(squareIndex / 8);
        previousPieceColumn = squareIndex - (previousPieceRow * 8);
        if (board[previousPieceRow][previousPieceColumn].charAt(1) === currentPlayer.charAt(0).toLowerCase()) {
            squareClicked(squareIndex);

            isSecondClick = true;
        }
    } else {
        const squareIndex = this.getAttribute("squareIndex");

        const row = Math.floor(squareIndex / 8);
        const column = squareIndex - (row * 8);

        if (board[row][column].charAt(0) === "*" || board[row][column].charAt(0) === "(") {
            if (board[row][column].charAt(0) === "(") {
                if (board[row][column].includes("w")) {
                    removedWhite.push(board[row][column]);
                } else {
                    removedBlack.push(board[row][column]);
                }
            }
            board[row][column] = currentPiece;
            updateSquare(row, column, currentPiece);

            board[previousPieceRow][previousPieceColumn] = "";
            updateSquare(previousPieceRow, previousPieceColumn, "");
            
            currentPiece = "";
            
            changePlayer();
            clearStarAndBracket();
            previousPieceRow = -1;
            previousPieceColumn = -1;
            isSecondClick = false;

            if (isCheck()) {
                statusText.textContent = `${currentPlayer} is under check`;
            }
        } else if (board[row][column].charAt(1) != currentPlayer.charAt(0).toLowerCase() || board[row][column] === "") { //clicked on opponents piece
            isSecondClick = !isSecondClick;
            clearStarAndBracket();
        } else {
            clearStarAndBracket();
            squareClicked(squareIndex);
            previousPieceRow = Math.floor(squareIndex / 8);
            previousPieceColumn = squareIndex - (previousPieceRow * 8);
        }
    }
}

function clearStarAndBracket() {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            if (board[row][column] === "*") {
                board[row][column] = "";
                updateSquare(row, column, "");
            } else if (board[row][column].charAt(0) === "(" && board[row][column].length > 2) {
                board[row][column] = board[row][column].replace(/[()]/g, '');
                updateSquare(row, column, board[row][column]);
            }
        }
    }
}

function squareClicked(squareIndex) {
    let row = Math.floor(squareIndex / 8); //1
    let column = squareIndex - (row * 8); //13 - 8 = 5

    currentPiece = board[row][column];

    switch(board[row][column].charAt(0)) {
        case "P":
            pawn(row, column, currentPlayer);
            break;
        case "B":
            bishop(row, column, currentPlayer);
            break;
        case "N":
            knight(row, column, currentPlayer);
            break;
        case "R":
            rook(row, column, currentPlayer);
            break;
        case "Q":
            queen(row, column, currentPlayer);
            break;
        case "K":
            king(row, column, currentPlayer);
            break;
        default:
            currentPiece = "";
    }
}

function updateSquare(row, column, input) { //will not modify the board array

    const squareToUpdate = document.querySelector(`[squareIndex="${toIndex(row, column)}"]`);

    squareToUpdate.innerHTML = "";
    
    const imageElement = document.createElement("img");
    imageElement.src = getImagePath(input);

    if (input.includes("(")) {
        imageElement.classList.add("attacked");
    }

    squareToUpdate.appendChild(imageElement);
}

function getImagePath(piece) {
    if (piece.includes("*")) {
        return "Pieces/Blank/dot.png";
    } else if (piece.includes("Pb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/pawn.png";
        }
        return "Pieces/Black/pawn.png";
    } else if (piece.includes("Rb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/rook.png";
        }
        return "Pieces/Black/rook.png";
    } else if (piece.includes("Kb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/king.png";
        }
        return "Pieces/Black/king.png";
    } else if (piece.includes("Qb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/queen.png";
        }
        return "Pieces/Black/queen.png";
    } else if (piece.includes("Bb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/bishop.png";
        }
        return "Pieces/Black/bishop.png";
    } else if (piece.includes("Nb")) {
        if (piece.includes("(")) {
            return "Pieces/Black/Attacked/knight.png";
        }
        return "Pieces/Black/knight.png";
    } else if (piece.includes("Pw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/pawn.png";
        }
        return "Pieces/White/pawn.png";
    } else if (piece.includes("Rw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/rook.png";
        }
        return "Pieces/White/rook.png";
    } else if (piece.includes("Kw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/king.png";
        }
        return "Pieces/White/king.png";
    } else if (piece.includes("Qw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/queen.png";
        }
        return "Pieces/White/queen.png";
    } else if (piece.includes("Bw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/bishop.png";
        }
        return "Pieces/White/bishop.png";
    } else if (piece.includes("Nw")) {
        if (piece.includes("(")) {
            return "Pieces/White/Attacked/knight.png";
        }
        return "Pieces/White/knight.png";
    } else {
        return "";
    }
}

function changePlayer() {
    currentPlayer = (currentPlayer === "White") ? "Black" : "White";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function restartGame() {
    console.clear();
    currentPlayer = "White";
    board = Array.from({ length: 8}, () => Array(8).fill(''));
    statusText.textContent = `${currentPlayer}'s turn`;

    squares.forEach(square => {
        square.textContent = "";
        square.classList.remove("hovered-cell");
    });
    setInitialBoard();
    running = true;
}

function toIndex(row, column) {
    return row * 8 + column;
}

function placePossibleMove(possibleMoves) {
    for (let i = 0; i < possibleMoves.length; i++) {
        const row = possibleMoves[i][0];
        const column = possibleMoves[i][1];
        if (board[row][column] === "") {
            updateSquare(row, column, "*");
            board[row][column] = "*";
        } else {
            updateSquare(row, column, ("(" + board[row][column] + ")"));
            board[row][column] = "(" + board[row][column] + ")";
        }
    }
}

function isValidMove(row, column, player) {
    return row >= 0 && row < board.length && column >= 0 && column < board[0].length && board[row][column].charAt(1) != player.charAt(0).toLowerCase();    
}

function pawn(row, column, player, forCheck) {
    const whiteMovements = [
        [-1, 0], //one step forward
        [-2, 0], //two steps forward
        [-1, 1], //one step forward and one step to the right
        [-1, -1] //one step forward and one step to the left
    ]

    const blackMovements = [
        [1, 0], //one step forward
        [2, 0], //two steps forward
        [1, 1], //one step forward and one step to the right
        [1, -1] //one step forward and one step to the left
    ]

    let possibleMoves = []; //vector to store movements
    if (player === "White") {
        for (let i = 0; i < whiteMovements.length; i++) {
            const newRow = row + whiteMovements[i][0];
            const newColumn = column + whiteMovements[i][1];
    
            if (i === 0 && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn, player)) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i === 1 && board[newRow+1][newColumn] === "" && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn, player) && newRow === 4) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i > 1 && isValidMove(newRow, newColumn, player) && board[newRow][newColumn] != "") {
                possibleMoves.push([newRow, newColumn]);
            }
        }
    } else if (player === "Black") {
        for (let i = 0; i < blackMovements.length; i++) {
            const newRow = row + blackMovements[i][0];
            const newColumn = column + blackMovements[i][1];
    
            if (i === 0 && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn, player)) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i === 1 && board[newRow-1][newColumn] === "" && board[newRow][newColumn] === "" && isValidMove(newRow, newColumn, player) && newRow === 3) {
                possibleMoves.push([newRow, newColumn]);
            } else if (i > 1 && isValidMove(newRow, newColumn, player) && board[newRow][newColumn] != "") {
                possibleMoves.push([newRow, newColumn]);
            }
        }
    }

    if (forCheck) {
        return possibleMoves;
    }

    placePossibleMove(possibleMoves);
}

function bishop(row, column, player, forCheck) {
    let possibleMoves = [];
    //top right diagonal
    for (let i = 1; i < 8; i++) {
        if (isValidMove(row - i, column + i, player)) {
            possibleMoves.push([row - i, column + i]);
            if (checkOpponentPiece(row - i, column + i, player)) {
                break;
            }
        } else {
            break;
        }
    }
    //top left diagonal
    for (let i = 1; i < 8; i++) {
        if (isValidMove(row - i, column - i, player)) {
            possibleMoves.push([row - i, column - i]);
            if (checkOpponentPiece(row - i, column - i, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row + i, column + i, player)) {
            possibleMoves.push([row + i, column + i]);
            if (checkOpponentPiece(row + i, column + i, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row + i, column - i, player)) {
            possibleMoves.push([row + i, column - i]);
            if (checkOpponentPiece(row + i, column - i, player)) {
                break;
            }
        } else {
            break;
        }
    }

    if (forCheck) {
        return possibleMoves;
    }

    placePossibleMove(possibleMoves);

}

function knight(row, column, player, forCheck) {
    const movements = [
        [-2, 1],
        [-2, -1],
        [2, 1],
        [2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2]
    ];

    let possibleMoves = [];

    for (let i = 0; i < movements.length; i++) {
        if (isValidMove(row + movements[i][0], column + movements[i][1], player)) {
            possibleMoves.push([row + movements[i][0], column + movements[i][1]]);
        }
    }

    if (forCheck) {
        return possibleMoves;
    }

    placePossibleMove(possibleMoves);

}

function checkOpponentPiece(row, column, player) {
    if (player === "White") {
        if (board[row][column].includes("b")) {
            return true;
        }
    } else {
        if (board[row][column].includes("w")) {
            return true;
        }
    }

    return false;
}

function rook(row, column, player, forCheck) {
    let possibleMoves = [];
    
    for (let rowIncrease = row + 1; rowIncrease < 8; rowIncrease++) {
        if (isValidMove(rowIncrease, column, player)) {
            possibleMoves.push([rowIncrease, column]);
            if (checkOpponentPiece(rowIncrease, column, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let rowDecrease = row - 1; rowDecrease >= 0; rowDecrease--) {
        if (isValidMove(rowDecrease, column, player)) {
            possibleMoves.push([rowDecrease, column]);
            if (checkOpponentPiece(rowDecrease, column, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let columnIncrease = column + 1; columnIncrease < 8; columnIncrease++) {
        if (isValidMove(row, columnIncrease, player)) {
            possibleMoves.push([row, columnIncrease]);
            if (checkOpponentPiece(row, columnIncrease, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let columnDecrease = column - 1; columnDecrease >= 0; columnDecrease--) {
        if (isValidMove(row, columnDecrease, player)) {
            possibleMoves.push([row, columnDecrease]);
            if (checkOpponentPiece(row, columnDecrease, player)) {
                break;
            }
        } else {
            break;
        }
    }

    if (forCheck) {
        return possibleMoves;
    }

    placePossibleMove(possibleMoves);
}

function queen(row, column, player, forCheck) {
    let possibleMoves = [];

    for (let rowIncrease = row + 1; rowIncrease < 8; rowIncrease++) {
        if (isValidMove(rowIncrease, column, player)) {
            possibleMoves.push([rowIncrease, column]);
            if (checkOpponentPiece(rowIncrease, column, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let rowDecrease = row - 1; rowDecrease >= 0; rowDecrease--) {
        if (isValidMove(rowDecrease, column, player)) {
            possibleMoves.push([rowDecrease, column]);
            if (checkOpponentPiece(rowDecrease, column, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let columnIncrease = column + 1; columnIncrease < 8; columnIncrease++) {
        if (isValidMove(row, columnIncrease, player)) {
            possibleMoves.push([row, columnIncrease]);
            if (checkOpponentPiece(row, columnIncrease, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let columnDecrease = column - 1; columnDecrease >= 0; columnDecrease--) {
        if (isValidMove(row, columnDecrease, player)) {
            possibleMoves.push([row, columnDecrease]);
            if (checkOpponentPiece(row, columnDecrease, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row - i, column + i, player)) {
            possibleMoves.push([row - i, column + i]);
            if (checkOpponentPiece(row - i, column + i)) {
                break;
            }
        } else {
            break;
        }
    }
    //top left diagonal
    for (let i = 1; i < 8; i++) {
        if (isValidMove(row - i, column - i, player)) {
            possibleMoves.push([row - i, column - i]);
            if (checkOpponentPiece(row - i, column - i, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row + i, column + i, player)) {
            possibleMoves.push([row + i, column + i]);
            if (checkOpponentPiece(row + i, column + i, player)) {
                break;
            }
        } else {
            break;
        }
    }

    for (let i = 1; i < 8; i++) {
        if (isValidMove(row + i, column - i, player)) {
            possibleMoves.push([row + i, column - i]);
            if (checkOpponentPiece(row + i, column - i, player)) {
                break;
            }
        } else {
            break;
        }
    }

    if (forCheck) {
        return possibleMoves;
    }

    placePossibleMove(possibleMoves);

}

function king(row, column, player, forCheck) {
    let possibleMoves = [];

    const movements = [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
        [1, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
    ];

    for (let i = 0; i < movements.length; i++) {
        if (isValidMove(row + movements[i][0], column + movements[i][1], player)) {
            possibleMoves.push([row + movements[i][0], column + movements[i][1]]);
        }
    }

    if (forCheck) {
        return possibleMoves;
    }

    placePossibleMove(possibleMoves);
}

function isCheck(manualRow, manualColumn) { //not all there is to do is determine where the isCheck function needs to be implemented, then create a checkmate function see if there are any possible movements that can prevent checkmate which is not easy to do, but is a good challenge, the first real challenge
    let otherPlayer = "";
    if (currentPlayer === "White") {
        otherPlayer = "Black";
    } else {
        otherPlayer = "White";
    }

    let kingRow;
    let kingColumn;

    if (!(typeof manualRow === 'undefined')) {
        kingRow = manualRow;
        kingColumn = manualColumn;
    } else {
        for (let row = 0; row < 8; row++) {
            for (let column = 0; column < 8; column++) {
                if (board[row][column].includes("K") && board[row][column].includes(currentPlayer.charAt(0).toLowerCase())) {
                    kingRow = row;
                    kingColumn = column;
                }
            }
        }
    }

    let moves = [];

    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            if (board[row][column].includes("P") && (!board[row][column].includes(currentPlayer.charAt(0).toLowerCase()))) {
                moves.push(...pawn(row, column, otherPlayer, true));
            } else if (board[row][column].includes("B") && (!board[row][column].includes(currentPlayer.charAt(0).toLowerCase()))) {
                moves.push(...bishop(row, column, otherPlayer, true));
            } else if (board[row][column].includes("N") && (!board[row][column].includes(currentPlayer.charAt(0).toLowerCase()))) {
                moves.push(...knight(row, column, otherPlayer, true));
            } else if (board[row][column].includes("R") && (!board[row][column].includes(currentPlayer.charAt(0).toLowerCase()))) {
                moves.push(...rook(row, column, otherPlayer, true));
            } else if (board[row][column].includes("Q") && (!board[row][column].includes(currentPlayer.charAt(0).toLowerCase()))) {
                moves.push(...queen(row, column, otherPlayer, true));
            } else if (board[row][column].includes("K") && (!board[row][column].includes(currentPlayer.charAt(0).toLowerCase()))) {
                moves.push(...king(row, column, otherPlayer, true));
            } 
        }
    }

    for (let i = 0; i < moves.length; i++) {
        if (moves[i][0] === kingRow && moves[i][1] === kingColumn) {
            console.log("CHECK");
            return true;
        }
    }

    console.log("not check");
    return false;
}

function isPinned(pieceRow, pieceColumn) {
    let otherPlayer = (currentPlayer === "White") ? "Black" : "White";
    let kingRow, kingColumn;

    // Find the king's position
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            if (board[row][column].includes("K") && board[row][column].includes(currentPlayer.charAt(0).toLowerCase())) {
                kingRow = row;
                kingColumn = column;
            }
        }
    }

    // Check if the piece is on the same line as the king
    if (pieceRow === kingRow || pieceColumn === kingColumn || Math.abs(pieceRow - kingRow) === Math.abs(pieceColumn - kingColumn)) {
        // Check if there is an opponent's piece behind the pinned piece
        let rowIncrement = (pieceRow < kingRow) ? 1 : (pieceRow > kingRow) ? -1 : 0;
        let columnIncrement = (pieceColumn < kingColumn) ? 1 : (pieceColumn > kingColumn) ? -1 : 0;

        let currentRow = pieceRow + rowIncrement;
        let currentColumn = pieceColumn + columnIncrement;

        while (currentRow !== kingRow || currentColumn !== kingColumn) {
            if (board[currentRow][currentColumn].includes(otherPlayer.charAt(0).toLowerCase())) {
                // There is an opponent's piece behind the pinned piece
                return true;
            }
            currentRow += rowIncrement;
            currentColumn += columnIncrement;
        }
    }

    // No pinning
    return false;
}


//create an array that stores the pieces that have been removed/killed