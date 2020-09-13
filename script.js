// Set the default value of the map.
textarea.value = `
597333331395397313333313b
c6339595adccd639633b50039
cd53286a70ac619c5333a639c
c4a59e5396969cc6ad51b53ac
ce5a632bc5a5ac61b4ac5a738
432339ddcc5a5adc5ad6a5958
cd5396accccdc58cc5239c6ac
cccd633accc4aec6a639cc59c
68c43339cccc5949719cc6acc
7a6a7332a6a6a6a63a6a633a6`.trim();

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

// Turns cells into walls
function toWalls(cells) {
  const result = new Set();
  for (let row = 0; row < cells.length; row++) {
    for (let col = 0; col < cells[row].length; col++) {
      const walls = [];
      const cell = cells[row][col];
      if (cell.north) {
        walls.push({ from: { row, col }, to: { row, col: col + 1 } });
      }
      if (cell.south) {
        walls.push({
          from: { row: row + 1, col },
          to: { row: row + 1, col: col + 1 },
        });
      }
      if (cell.east) {
        walls.push({
          from: { row, col: col + 1 },
          to: { row: row + 1, col: col + 1 },
        });
      }
      if (cell.west) {
        walls.push({ from: { row, col }, to: { row: row + 1, col } });
      }
      for (const wall of walls) {
        result.add(JSON.stringify(wall));
      }
    }
  }
  return [...result].map((s) => JSON.parse(s));
}

// Rendering variables.
let svg = d3.select("svg").attr("width", 720).attr("class", "maze");
var player = { x: 0, y: 0 };
var cells;
const animationDuration = 50;
const lineWidth = 0.15;

// Render the svg.
function render() {
  cells = create(textarea.value);
  const walls = toWalls(cells);

  let svgHeight = cells.length;
  let svgWidth = cells[0].length;
  svg.attr(
    "viewBox",
    `-${lineWidth / 2} -${lineWidth / 2} ${svgWidth + lineWidth} ${
      svgHeight + lineWidth
    }`
  );

  svg
    .selectAll("line")
    .data(walls)
    .join("line")
    .attr("stroke", "black")
    .attr("stroke-width", 0.15)
    .attr("stroke-linecap", "round")
    .attr("x1", (w) => w.from.col)
    .attr("y1", (w) => w.from.row)
    .attr("x2", (w) => w.to.col)
    .attr("y2", (w) => w.to.row);

  svg
    .selectAll("image")
    .data([player])
    .join("image")
    .attr("xlink:href", getImg())
    .attr("x", (p) => p.x + 0.1)
    .attr("y", (p) => p.y + 0.1)
    .attr("height", 0.8)
    .style("transition", "all 0.05s");
}

// Listener.
svg.on("keydown", (event) => {
  if (event.key.startsWith("Arrow")) {
    event.preventDefault();
    const room = cells[player.y][player.x];
    switch (event.key) {
      case "ArrowUp":
        if (!room.north) {
          player.y -= 1;
        }
        break;
      case "ArrowDown":
        if (!room.south) {
          player.y += 1;
        }
        break;
      case "ArrowLeft":
        if (!room.west) {
          player.x -= 1;
        }
        break;
      case "ArrowRight":
        if (!room.east) {
          player.x += 1;
        }
        break;
    }
    render();
    didWin();
  }
});

// Checks if the player won (bottom right)
function didWin() {
  if (player.x === cells[0].length - 1 && player.y === cells.length - 1) {
    setTimeout(() => {
      alert("You won!");
    }, animationDuration * 1.5);
  }
}

// Get the player image.
function getImg() {
  const radios = Array.from(document.getElementsByName("player"))
    .filter((x) => x.checked)
    .map((x) => x.value);
  switch (radios[0]) {
    case "player_c":
      return "./img/c.png";
    case "player_java":
      return "./img/java.png";
    case "player_pyret":
      return "./img/pyret.png";
    default:
      return "./img/c.png";
  }
}

// Start
textarea.addEventListener("input", render);
render();
