const gameboard = (() => {
  const gameboard = [
    [x, o, x],
    [o, x, o],
    [x, o, x],
  ];
})();

const player = name => {
  const sayName = () => console.log(`my name is ${name}`);
  return { sayName };
};
