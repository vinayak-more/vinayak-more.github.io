let origBoard;
let huPlayer = 'X'
let aiPlayer = 'O'
const INFINITY = 20;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
    document.getElementById("endGame").style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        cells[i].style.removeProperty("background-color");
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] === 'number') {
        turn(square.target.id, huPlayer);
        if (!checkTie(origBoard)) turn(bestSquare(origBoard), aiPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameResult = checkWinner(origBoard, player);
    if (gameResult) gameOver(gameResult);
}

function checkWinner(board, player) {
    let plays = [];
    board.forEach((element, index) => {
        if (element === player) plays.push(index);
    });
    let gameResult = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(e => plays.indexOf(e) > -1)) {
            gameResult = { index: index, player: player };
            break;
        }
    }
    return gameResult;
}

function gameOver(gameResult) {
    for (let id of winCombos[gameResult.index]) {
        document.getElementById(id).style.backgroundColor =
            gameResult.player === huPlayer ? 'blue' : 'red';
    }

    for (let cell of cells) {
        cell.removeEventListener('click', turnClick, false);
    }

    if (gameResult.player === huPlayer) {
        declareWinner("You Won!! &#128512;");
    } else {
        declareWinner("You lose &#128532;");
    }
}

function emptySquares(board) {
    return board.filter(element => typeof element === 'number');
}


function checkTie(board) {
    if (emptySquares(board).length === 0) {
        for (let cell of cells) {
            cell.style.backgroundColor = 'green';
        }
        declareWinner("Its a Tie!! &#128528;");
        return true;
    }
    return false;
}

function declareWinner(player) {
    document.getElementById("endGame").style.display = 'block';
    document.getElementById("endText").innerHTML = player;
}


function bestSquare(origBoard) {
    callCounter = 0;
    const index = minimax(origBoard, aiPlayer, -INFINITY, +INFINITY).index;
    console.log(callCounter);
    return index;
}
let callCounter = 0;
function minimax(board, player, alpha, beta) {
    callCounter++;
    let availSquares = emptySquares(board);

    if (checkWinner(board, huPlayer)) {
        return { score: -10, index: -1 };
    } else if (checkWinner(board, aiPlayer)) {
        return { score: +10, index: -1 };
    } else if (availSquares.length === 0) {
        return { score: 0, index: -1 };
    }


    let bestScore = null;
    let bestMove = null;
    if (player == huPlayer) {
        //minimize
        bestScore = +INFINITY;
        for (let square of availSquares) {
            let move = {};
            move.index = square;
            board[square] = player;
            let tempScore;
            tempScore = minimax(board, aiPlayer, alpha, beta);
            board[square] = square;
            move.score = tempScore.score;
            if (move.score < bestMove) {
                bestScore = move.score
                bestMove = move.index;
                beta = bestMove;
            }
            if(beta < alpha) break;
        }
    } else {
        //maximize
        bestScore = -INFINITY;
        for (let square of availSquares) {
            let move = {};
            move.index = square;
            board[square] = player;
            let tempScore;
            tempScore = minimax(board, huPlayer, alpha, beta);
            board[square] = square;
            move.score = tempScore.score;
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move.index;
                alpha = bestMove;
            }
            if(alpha > beta) break;
        }
    }

    return { score: bestScore, index: bestMove };
}