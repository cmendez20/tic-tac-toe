// Pick a single source of authority for game state.
// Code can be a very easy to understand flow:
// user interaction
// update data
// render data
// const cells = Array.from(document.querySelectorAll('.cell'));

const gameboard = (() => {
  // Methods to update and query the gameboard state

  let gameboard = Array(9).fill('');

  const placeMark = function (index, player) {
    const { mark } = player;
    gameboard[index] = mark;
  };

  const getBoard = () => gameboard;

  const resetBoard = () => {
    console.log(gameboard);
    gameboard = gameboard.map(val => '');
    console.log(gameboard);
    displayController.renderBoard();
  };

  // const printBoard = () => console.log(gameboard);

  return { gameboard, placeMark, getBoard, resetBoard };
})();

const gameController = (() => {
  // Methods for game logic
  // const gameMessage = document.querySelector('#subheading');

  const WIN_COMBOS = [
    // HORIZONTAL WINS
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // VERTICAL WINS
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // DIAGONAL WINS
    [0, 4, 8],
    [2, 4, 6],
  ];

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.

  const player = (name, mark) => {
    return { name, mark };
  };

  const playerOne = player('chris', 'X');
  const playerTwo = player('omega', 'O');

  let activePlayer = playerOne;

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  // const printNewRound = () => {
  //   gameboard.printBoard();
  //   console.log(`${activePlayer.name}'s turn.`);
  // };

  const checkIfWinner = function (player) {
    const { mark } = player;
    const board = gameboard.getBoard();
    return WIN_COMBOS.some(combo =>
      combo.every(index => {
        return board[index] === mark;
      })
    );
  };

  const checkIfTaken = index => gameboard.gameboard[index].length > 0;

  const printWinner = function (activePlayer) {
    displayController.printMessage(`${activePlayer.name} has won!!!`);
  };

  const playRound = function (player, index) {
    const { name, mark } = player;
    if (!checkIfTaken(index)) gameboard.placeMark(index, player);
    displayController.renderBoard();

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
    if (checkIfWinner(activePlayer)) {
      printWinner(activePlayer);
      gameboard.resetBoard();
      // return;
    }

    // If no winner, switch player turn
    switchPlayerTurn();
    displayController.printMessage(
      `${activePlayer.name}'s, ${activePlayer.mark}, turn...`
    );
  };

  const handleClick = e => {
    const index = e.target.dataset.index;
    if (index === undefined) return;
    e.target.classList.add('marked');
    playRound(getActivePlayer(), index);
  };

  return { playRound, getActivePlayer, handleClick };
})();

const displayController = (() => {
  // Methods to render the game state on the UI
  const board = document.querySelector('#gameboard');

  const printMessage = message => {
    document.querySelector('#subheading').textContent = message;
  };

  const renderBoard = () =>
    (board.innerHTML = `
  ${gameboard
    .getBoard()
    .map((val, i) => {
      return val.length === 0
        ? `<div class="cell" data-index="${i}">${val}</div>`
        : `<div class="cell marked" data-index="${i}">${val}</div>`;
    })
    .join('')}
  `);

  return { renderBoard, printMessage };
})();

displayController.renderBoard();
document
  .querySelector('#gameboard')
  .addEventListener('click', e => gameController.handleClick(e));
