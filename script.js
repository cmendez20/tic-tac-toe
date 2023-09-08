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
    gameboard = gameboard.map(val => '');
  };

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

  const playerOne = player('X-ray', 'X');
  const playerTwo = player('Oscar', 'O');

  let activePlayer = playerOne;

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const checkIfWinner = function (player) {
    const { mark } = player;
    const board = gameboard.getBoard();
    const winStatus = WIN_COMBOS.some(combo =>
      combo.every(index => {
        return board[index] === mark;
      })
    );
    console.log({ winStatus });
    console.log(board.join('').length > 8);

    if (!winStatus && board.join('').length > 8) {
      console.log('tie!!!');
      return 'tie';
    } else {
      return winStatus;
    }
  };

  const checkIfTaken = index => {
    const board = gameboard.getBoard();
    return board[index].length > 0;
  };

  const printWinner = function (activePlayer) {
    displayController.printMessage(`${activePlayer.name} has won!!!`);
  };

  const playRound = function (player, index) {
    if (!checkIfTaken(index)) gameboard.placeMark(index, player);
    displayController.renderBoard();

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

    if (checkIfWinner(activePlayer) === 'tie') {
      displayController.printMessage(`It's a tie!!!`);
      displayController.renderPlayAgainButton();
      disableGame();
      return;
    } else if (checkIfWinner(activePlayer)) {
      printWinner(activePlayer);
      displayController.renderPlayAgainButton();
      disableGame();
      return;
    }

    // If no winner, switch player turn
    switchPlayerTurn();
    displayController.printMessage(
      `${activePlayer.name}'s, ${activePlayer.mark}, turn...`
    );
  };

  const addPlayBtnEventListener = () =>
    document
      .querySelector('#playButton')
      .addEventListener('click', e => handleClick(e));

  const handleClick = e => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains('button')) resetGame();
    if (index === undefined || checkIfTaken(index)) return;
    e.target.classList.add('marked');
    playRound(getActivePlayer(), index);
  };

  const disableGame = () => {
    document
      .querySelectorAll('.cell')
      .forEach(cell => cell.classList.add('disabled'));
  };

  const resetGame = () => {
    activePlayer = playerOne;
    displayController.printMessage(`X's go first`);
    displayController.removePlayAgainButton();
    gameboard.resetBoard();
    displayController.renderBoard();
  };

  return {
    playRound,
    getActivePlayer,
    handleClick,
    addPlayBtnEventListener,
    disableGame,
    resetGame,
  };
})();

const displayController = (() => {
  // Methods to render the game state on the UI
  const board = document.querySelector('#gameboard');
  const messageEl = document.querySelector('#subheading');

  const printMessage = message => {
    messageEl.textContent = message;
  };

  const renderPlayAgainButton = () => {
    const playAgainBtnHTML = `
    <button class="button" id="playButton">One more?</button>
    `;
    messageEl.insertAdjacentHTML('afterend', playAgainBtnHTML);
    gameController.addPlayBtnEventListener();
  };

  const removePlayAgainButton = () => {
    document.querySelector('#playButton').remove();
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

  return {
    renderBoard,
    printMessage,
    renderPlayAgainButton,
    removePlayAgainButton,
  };
})();

displayController.renderBoard();
document
  .querySelector('#gameboard')
  .addEventListener('click', e => gameController.handleClick(e));
