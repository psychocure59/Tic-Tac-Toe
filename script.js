const boxes = document.querySelectorAll(".box");
const msg = document.querySelector(".msg");
const msgContainer = document.querySelector(".msg-container");
const newGame = document.querySelector(".new");
const reset = document.querySelector(".reset");
const main = document.querySelector("main");

const bgMusic = document.getElementById("bgMusic");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let board = Array(9).fill("");
let gameOver = false;
let humanTurn = true; // true = human can click

const HUMAN = "O";
const AI = "X";

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Start music after first click (browser rule)
document.body.addEventListener("click", () => { bgMusic.play(); }, { once:true });

// PLAYER MOVE
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if(!humanTurn || board[index] != "" || gameOver) return;

        makeMove(index, HUMAN);

        if(!gameOver){
            humanTurn = false; // block clicks while bot moves
            setTimeout(() => {
                const bestMove = minimax(board, AI).index;
                makeMove(bestMove, AI);
                humanTurn = true; // allow human again
            }, 400);
        }
    });
});

// MAKE MOVE
function makeMove(index, player){
    board[index] = player;
    boxes[index].innerText = player;
    boxes[index].disabled = true;

    if(checkWinner(board, player)){
        endGame(`${player} Wins 🎉`, true);
    } else if(board.every(cell => cell !== "")){
        endGame("It's a Draw!", false);
    }
}

// END GAME
function endGame(text, isWin){
    msg.innerText = text;
    msgContainer.classList.remove("hide");
    main.classList.add("hide");
    gameOver = true;
    humanTurn = false;

    bgMusic.pause();
    bgMusic.currentTime = 0;

    if(isWin) winSound.play();
    else drawSound.play();
}

// CHECK WINNER
function checkWinner(b, player){
    return winPatterns.some(p => p.every(i => b[i] === player));
}

// MINIMAX (HARD AI)
function minimax(newBoard, player){
    const empty = newBoard.map((v,i) => v === "" ? i : null).filter(v => v !== null);
    if(checkWinner(newBoard, HUMAN)) return { score: -10 };
    if(checkWinner(newBoard, AI)) return { score: 10 };
    if(empty.length === 0) return { score: 0 };

    let moves = [];
    for(let i of empty){
        let move = { index: i };
        newBoard[i] = player;
        move.score = minimax(newBoard, player === AI ? HUMAN : AI).score;
        newBoard[i] = "";
        moves.push(move);
    }

    return player === AI
        ? moves.reduce((a,b) => a.score > b.score ? a : b)
        : moves.reduce((a,b) => a.score < b.score ? a : b);
}

// RESET GAME
function resetGame(){
    board = Array(9).fill("");
    gameOver = false;
    humanTurn = true;

    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
    });

    msgContainer.classList.add("hide");
    main.classList.remove("hide");
    bgMusic.play();
}

newGame.addEventListener("click", resetGame);
reset.addEventListener("click", resetGame);
