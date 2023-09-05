const cells = Array.from(document.querySelectorAll('.cell'));

const gameboard = (() => {
  const gameboard = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
  // HORIZONTAL WINS
  // 0, 1, 2
  // gameboard.gameboard[0], gameboard.gameboard[1], gameboard.gameboard[2] === val, val, val
  // 3, 4, 5
  // 6, 7, 8

  // VERTICAL WINS
  // 0, 3, 6
  // 1, 4, 7
  // 2, 5, 8

  // DIAGONAL WINS
  // 0, 4, 8
  // 2, 4, 6

  // const gameboard = ['', '', '', '', '', '', '', '', ''];
  return { gameboard };
})();

const player = name => {
  const sayName = () => console.log(`my name is ${name}`);
  return { sayName };
};

cells.forEach((cell, i) => {
  cell.textContent = gameboard.gameboard[i];
});

const checkIfTaken = function (e) {
  return e.currentTarget.textContent.length > 0;
};

const handleClick = function (e) {
  if (!checkIfTaken(e)) e.currentTarget.textContent = 'P';
};

cells.forEach(cell => cell.addEventListener('click', handleClick));
