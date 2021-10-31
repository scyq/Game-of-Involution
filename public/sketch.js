function make2DArray(rows, cols) {
  let arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols);
  }
  return arr;
}

const GAME_STATE = ["PLAYING", "PAUSE", "WIN", "DEATH"];
let currentGameState = 1;
let grid;
let rows, cols, gridSize;
let cnvsX, cnvsY; // the position of main canvas
let cnvs;
let setCanvasSizeButton;
let inputRow, inputCol;
let userJSON;
let playButton;

function preload() {
  // Serialization
  loadJSON("user.json", (json) => {
    // set the default configuration
    rows = json.rows;
    cols = json.cols;
    gridSize = json.gridSize;
    userJSON = json;
  });
}

/**
 *
 * @param {2D Array} grid
 * @param {number} row
 * @param {number} col
 * @returns the number of colored neighbor
 */
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

function setMainCanvas() {
  // position the canvas in the center
  const cnvs = createCanvas(cols * gridSize, rows * gridSize);
  cnvsX = (windowWidth - width) / 2;
  cnvsY = (windowHeight - height) / 2;
  cnvs.position(cnvsX, cnvsY);
}

function resizeMainCanvas() {
  let newRows = parseFloat(inputRow.value());
  let newCols = parseFloat(inputCol.value());
  if (newRows.toString() === "NaN" || newCols.toString() === "NaN") {
    alert("Please input numbers!");
  } else {
    userJSON.rows = newRows;
    userJSON.cols = newCols;
    $.post("resize", userJSON);
  }
}

function changeGameState(state) {
  currentGameState = state;
  if (state === 1) {
    playButton.html("Play");
  } else if (state === 0) {
    playButton.html("Pause");
  }
}

function drawCanvasConfig() {
  inputRow = createInput();
  inputCol = createInput();
  let rowTxt = createSpan("row");
  let colTxt = createSpan("col");
  let distanceFromTop = cnvsY - 50;
  rowTxt.position(cnvsX, distanceFromTop);
  inputRow.position(cnvsX + rowTxt.width + 10, distanceFromTop);
  colTxt.position(cnvsX + rowTxt.width + inputRow.width + 20, distanceFromTop);
  inputCol.position(
    cnvsX + rowTxt.width + inputRow.width + colTxt.width + 30,
    distanceFromTop
  );
  setCanvasSizeButton = createButton("resize");
  setCanvasSizeButton.position(
    cnvsX + rowTxt.width + inputRow.width + colTxt.width + inputCol.width + 40,
    distanceFromTop
  );
  setCanvasSizeButton.mousePressed(resizeMainCanvas);
}

function drawGameController() {
  playButton = createButton("Play");
  playButton.position(cnvsX, cnvsY - 90);
  playButton.mousePressed(() => {
    if (currentGameState === 0) {
      changeGameState(1);
    } else if (currentGameState === 1) {
      changeGameState(0);
    }
  });
}

// if not click, then return null
function getClickGrid() {
  if (mouseIsPressed) {
    let rowGrid = floor(mouseY / gridSize);
    let colGrid = floor(mouseX / gridSize);
    if (rowGrid < 0 || colGrid < 0 || rowGrid >= rows || colGrid >= cols)
      return null;
    return createVector(rowGrid, colGrid);
  }
  return null;
}

/**
 *
 * @param {number} row
 * @param {number} col
 * @param {number} team
 */
function colorGrid(row, col, team) {
  if (grid[row][col] !== team) {
    console.log("here");
    grid[row][col] = team;
  }
}

function setup() {
  setMainCanvas();
  drawCanvasConfig();
  drawGameController();

  grid = make2DArray(rows, cols);
  background(0);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = floor(random(2));
      if (grid[i][j] === 0) {
        fill(255);
        square(j * gridSize, i * gridSize, gridSize);
      }
    }
  }
}

function draw() {
  // get user's input
  let clickResult = getClickGrid();
  if (clickResult) {
    colorGrid(clickResult.x, clickResult.y, 1);
  }

  if (currentGameState === 0) {
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
  }

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
