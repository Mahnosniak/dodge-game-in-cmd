const readline = require("readline");
const { stdin, stdout } = process;

const WIDTH = 20;
const HEIGHT = 15;
const PLAYER = "A";
const OBSTACLE = "#";
const EMPTY = " ";

let playerX = Math.floor(WIDTH / 2);
let obstacles = [];
let score = 0;
let gameOver = false;

// Setup keyboard
readline.emitKeypressEvents(stdin);
stdin.setRawMode(true);
stdin.on("keypress", (str, key) => {
  if (key.name === "left" && playerX > 0) playerX--;
  if (key.name === "right" && playerX < WIDTH - 1) playerX++;
  if (key.ctrl && key.name === "c") process.exit();
});

// Draw the grid
function draw() {
  console.clear();
  let grid = Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => EMPTY)
  );

  // Place obstacles
  obstacles.forEach(([x, y]) => {
    if (y >= 0 && y < HEIGHT) grid[y][x] = OBSTACLE;
  });

  // Place player
  grid[HEIGHT - 1][playerX] = PLAYER;

  // Print
  grid.forEach(row => console.log(row.join("")));
  console.log("Score:", score);
}

// Game loop
function loop() {
  if (gameOver) return;

  // Move obstacles down
  obstacles = obstacles.map(([x, y]) => [x, y + 1]);

  // Spawn new obstacle
  if (Math.random() < 0.3) {
    obstacles.push([Math.floor(Math.random() * WIDTH), 0]);
  }

  // Collision check
  obstacles.forEach(([x, y]) => {
    if (y === HEIGHT - 1 && x === playerX) {
      gameOver = true;
    }
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(([_, y]) => y < HEIGHT);

  // Score
  score++;

  draw();

  if (!gameOver) setTimeout(loop, 200);
  else console.log("💀 GAME OVER! Final Score:", score);
}

// Start
draw();
loop();