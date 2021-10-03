function make2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}

let grid;
let rows = 20;
let cols = 50;
const gridSize = 20;

function checkNeighbors(grid, row, col) {
  let neighbors = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let currentRow = (row + i + rows) % rows;
      let currentCol = (col + j + cols) % cols;
      if (i === 0 && j === 0) {
        continue;
      }
      neighbors += grid[currentRow][currentCol];
    }
  }
  return neighbors;
}

function setup() {
  createCanvas(cols * gridSize, rows * gridSize);
  grid = make2DArray(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = floor(random(2));
    }
  }
  console.table(grid);
}

function draw() {
  // compute
  let next = make2DArray(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let neighbors = checkNeighbors(grid, i, j);
      let state = grid[i][j];
      if (state === 0 && neighbors === 3) {
        next[i][j] = 1;
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0;
      } else {
        next[i][j] = state;
      }
    }
  }

  grid = next;

  // render
  background(0);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 0) {
        fill(255);
        square(j * gridSize, i * gridSize, gridSize);
      }
    }
  }
}
