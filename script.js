// Pick a single source of authority for game state.
// Code can be a very easy to understand flow:
// user interaction
// update data
// render data
// const cells = Array.from(document.querySelectorAll('.cell'));

const gameboard = (() => {
  // Methods to update and query the gameboard state

  const gameboard = Array(9).fill(null);
  // const gameboard = Array(9).fill('hi');

  const placeMark = function (index, player) {
    const { mark } = player;
    gameboard[index] = mark;
  };

  const getBoard = () => gameboard;

  const printBoard = () => console.log(gameboard);

  return { gameboard, placeMark, getBoard, printBoard };
})();

const gameController = (() => {
  // Methods for game logic

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
  const playerTwo = player('tim', 'Y');

  let activePlayer = playerOne;

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  const printNewRound = () => {
    gameboard.printBoard();
    console.log(`${activePlayer.name}'s turn.`);
  };

  const checkIfWinner = function (player) {
    const { mark } = player;
    const board = gameboard.getBoard();
    console.log({ board });
    return WIN_COMBOS.some(combo =>
      combo.every(index => {
        return board[index] === mark;
      })
    );
  };

  const printWinner = function (activePlayer) {
    console.log(`${activePlayer.name} has won!!!`);
  };

  const playRound = function (player, index) {
    const { mark } = player;
    console.log(`Placing ${activePlayer.name}'s mark into cell ${mark}...`);
    gameboard.placeMark(index, player);

    /*  This is where we would check for a winner and handle that logic,
        such as a win message. */
    if (checkIfWinner(activePlayer)) printWinner(activePlayer);

    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  return { playRound, getActivePlayer };
})();

gameController.playRound(gameController.getActivePlayer(), 6);
gameController.playRound(gameController.getActivePlayer(), 5);
gameController.playRound(gameController.getActivePlayer(), 8);
gameController.playRound(gameController.getActivePlayer(), 4);
gameController.playRound(gameController.getActivePlayer(), 7);

// const displayController = (() => {
//   // Methods to render the game state on the UI

//   cells.forEach((cell, i) => {
//     cell.textContent = gameboard.gameboard[i];
//   });
// })();
