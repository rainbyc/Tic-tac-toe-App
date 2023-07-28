let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let currentPlayer = "X";
let moveHistory = [];
let currentMoveIndex = -1;

const boardElement = document.querySelector(".board");
const moveHistoryButtons = document.querySelectorAll(".move-btn");

const previousButton = document.querySelector(".move-btn:first-of-type");
const nextButton = document.querySelector(".move-btn:last-of-type");

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cell;

      if (cell === "") {
        cellElement.onclick = () => makeMove(rowIndex, colIndex);
      } else {
        cellElement.classList.add("filled");
      }

      if (cell === "X") {
        cellElement.style.fontFamily = "Segoe UI";
        cellElement.style.color = "#0be881";
      } else if (cell === "O") {
        cellElement.style.color = "#ff5e57";
        cellElement.style.fontFamily = "Segoe UI";
      }

      boardElement.appendChild(cellElement);
    });
  });

  const winningCells = getWinningCells();
  const isBoardFull = board.flat().every((cell) => cell !== "");
  if (winningCells) {
    winningCells.forEach(([row, col]) => {
      boardElement.children[row * 3 + col].classList.add("winning-cell");
    });
    const winner = board[winningCells[0][0]][winningCells[0][1]];
    setTimeout(() => {
      document.querySelector(".turn-indicator").textContent =
        winner + "  has won!";
      previousButton.style.display = "block";
      nextButton.style.display = "block";
    }, 100);
  } else if (isBoardFull) {
    setTimeout(() => {
      document.querySelector(".turn-indicator").textContent =
        "The game ended in a tie. There is no winner.";
      previousButton.style.display = "block";
      nextButton.style.display = "block";
    }, 100);
  }
}

function checkGameOver() {
  return getWinningCells() || board.flat().every((cell) => cell !== "");
}
function getWinningCells() {
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== "" &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return [
        [i, 0],
        [i, 1],
        [i, 2],
      ];
    }

    if (
      board[0][i] !== "" &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      return [
        [0, i],
        [1, i],
        [2, i],
      ];
    }
  }

  if (
    board[0][0] !== "" &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return [
      [0, 0],
      [1, 1],
      [2, 2],
    ];
  }

  if (
    board[0][2] !== "" &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return [
      [0, 2],
      [1, 1],
      [2, 0],
    ];
  }

  return null;
}

function makeMove(row, col) {
  if (!checkGameOver() && board[row][col] === "") {
    board[row][col] = currentPlayer;
    moveHistory.splice(currentMoveIndex + 1);
    moveHistory.push({ player: currentPlayer, row, col });
    currentMoveIndex = moveHistory.length - 1;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    renderBoard();
    updateMoveButtons();

    const turnIndicatorElement = document.querySelector(".turn-indicator");
    turnIndicatorElement.textContent = `Turn: ${currentPlayer}`;

    const winningCells = getWinningCells();
    if (winningCells) {
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => (cell.onclick = null));
    }
  }
}

function previousMove() {
  if (currentMoveIndex > 0) {
    currentMoveIndex--;
    const { player, row, col } = moveHistory[currentMoveIndex];
    board[row][col] = "";
    currentPlayer = player === "X" ? "O" : "X";
    renderBoard();
    updateMoveButtons();
  }
}

function nextMove() {
  if (currentMoveIndex < moveHistory.length - 1) {
    currentMoveIndex++;
    const { player, row, col } = moveHistory[currentMoveIndex];
    board[row][col] = player;
    currentPlayer = player === "X" ? "O" : "X";
    renderBoard();
    updateMoveButtons();
  }
}

function updateMoveButtons() {
  moveHistoryButtons[0].disabled = currentMoveIndex <= 0;
  moveHistoryButtons[1].disabled = currentMoveIndex >= moveHistory.length - 1;
}
function resetGame() {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  currentPlayer = "X";
  moveHistory = [];
  currentMoveIndex = -1;
  renderBoard();
  updateMoveButtons();
  previousButton.style.display = "none";
  nextButton.style.display = "none";
  document.querySelector(".turn-indicator").style.display = "block";
  document.querySelector(".turn-indicator").textContent = "X's turn";
}

function renderMoveHistory() {
  const moveHistoryElement = document.createElement("div");
  moveHistoryElement.classList.add("move-history");
  moveHistory.forEach((move, index) => {
    const historyItem = document.createElement("div");
    historyItem.classList.add("history-item");
    historyItem.textContent = `${move.player} played (${move.row}, ${move.col})`;
    historyItem.onclick = () => {
      currentMoveIndex = index;
      const { player, row, col } = moveHistory[currentMoveIndex];
      board = moveHistory.slice(0, currentMoveIndex + 1).reduce(
        (acc, move) => {
          acc[move.row][move.col] = move.player;
          return acc;
        },
        [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ]
      );
      currentPlayer = player === "X" ? "O" : "X";
      renderBoard();
      updateMoveButtons();
    };

    moveHistoryElement.appendChild(historyItem);
  });

  document.body.appendChild(moveHistoryElement);
}
previousButton.style.display = "none";
nextButton.style.display = "none";
renderBoard();
updateMoveButtons();
renderMoveHistory();

//popup script

document.querySelector("#close").addEventListener("click", function () {
  document.querySelector(".popup").style.display = "none";
  document.querySelector(".container").style.filter = "none";
});
