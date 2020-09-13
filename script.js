const defaultMaze = `
597333331395397313333313b
c6339595adccd639633b59639
cd53286a70ac619c5333a639c
c4a59e5396969cc6ad51b53ac
ce5a632bc5a5ac61b4ac5a738
432339ddcc5a5adc5ad6a5958
cd5396accccdc58cc5239c6ac
cccd633accc4aec6a639cc59c
68c43339cccc5949719cc6acc
7a6a7332a6a6a6a63a6a633ae`.trim();

// Creates a Maze, which is a 2D array of Wall Objects.
function create(input) {
  const parse = (n) => {
    const bits = parseInt(n, 16)
      .toString(2)
      .padStart(4, "0")
      .split("")
      .map((digit) => parseInt(digit, 2));
    return { east: bits[0], west: bits[1], south: bits[2], north: bits[3] };
  };

  const walls = input
    .trim()
    .split("\n")
    .map((line) => line.split("").map(parse));

  return walls;
}

// Ensures that a maze is valid.
function validate(maze) {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      const room = maze[row][col];

      if (row == 0) {
        assert(room.north, "Missing north wall at " + col);
      } else {
        assert(
          room.north === maze[row - 1][col].south,
          "Missing wall between " + [row, col] + " and " + [row - 1, col]
        );
      }

      if (row === maze.length - 1) {
        assert(room.south, "Missing south wall at " + col);
      } else {
        assert(
          room.south === maze[row + 1][col].north,
          "Missing wall between " + [row, col] + " and " + [row + 1, col]
        );
      }

      if (col == 0) {
        assert(room.west, "Missing west wall at " + row);
      } else {
        assert(
          room.west === maze[row][col - 1].east,
          "Missing wall between " + [row, col] + " and " + [row, col - 1]
        );
      }

      if (col === maze[row].length - 1) {
        assert(room.east, "Missing east wall at " + row);
      } else {
        assert(
          room.east === maze[row][col + 1].west,
          "Missing wall between " + [row, col] + " and " + [row, col + 1]
        );
      }
    }
  }
}

// Assert.
function assert(cond, message = "Assertion failed") {
  if (!cond) throw new TypeError(message);
}


function toWalls(cells) {
  const result = new Set()
  for (let row = 0; row < cells.length; row++) {
    for (let col = 0; col < cells[row].length; col++) {
      const walls = []
      const cell = cells[row][col]
      if (cell.north) {
        walls.push({ from: { row, col }, to: { row, col: col + 1 } })
      }
      if (cell.south) {
        walls.push({ from: { row: row + 1, col }, to: { row: row + 1, col: col + 1 } })
      }
      if (cell.east) {
        walls.push({ from: { row, col: col + 1 }, to: { row: row + 1, col: col + 1 } })
      }
      if (cell.west) {
        walls.push({ from: { row, col }, to: { row: row + 1, col } })
      }
      for (const wall of walls) {
        result.add(JSON.stringify(wall))
      }
    }
  }
  return [...result].map(s => JSON.parse(s))
}

const cells = create(defaultMaze);
console.log(cells);
console.log(toWalls(cells))
