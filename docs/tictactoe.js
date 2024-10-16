"use strict";

(() => {
window.addEventListener("load", () => {
// *****************************************************************************
// #region Constants and Variables

// Canvas references
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// UI references
const restartButton = document.querySelector("#restart");
const undoButton = document.querySelector('#undo');

// Constants
const CELLS_PER_AXIS = 3;  // Tic Tac Toe grid size
const CELL_WIDTH = canvas.width / CELLS_PER_AXIS;
const CELL_HEIGHT = canvas.height / CELLS_PER_AXIS;
let grids = [];  // History of game states

// Game objects
let currentPlayer = true;  // true for Player X, false for Player O

// #endregion


// *****************************************************************************
// #region Game Logic

function startGame() {
    const startingGrid = initializeGrid();
    initializeHistory(startingGrid);
    render(grids[0]);  // Render the initial empty grid
}

function initializeGrid() {
    return Array(CELLS_PER_AXIS * CELLS_PER_AXIS).fill("");  // Empty grid for Tic Tac Toe
}

function initializeHistory(startingGrid) {
    grids = [];
    grids.push(startingGrid);  // Add the initial empty grid to history
}

function rollBackHistory() {
    if (grids.length > 1) {  // Ensure there's a previous state to undo
        grids = grids.slice(0, grids.length - 1);  // Remove the latest move
        render(grids[grids.length - 1]);  // Re-render the previous grid
    }
}

function render(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    for (let i = 0; i < grid.length; i++) {
    }
    playerScoreText.textContent = playerScore;
}

function updateGridAt(mousePositionX, mousePositionY) {
    const gridCoordinates = convertCartesiansToGrid(mousePositionX, mousePositionY);
    const newGrid = grids[grids.length - 1].slice();  // Create a copy of the current grid

    // Perform the flood fill operation
    floodFill(newGrid, gridCoordinates, newGrid[gridCoordinates.column * CELLS_PER_AXIS + gridCoordinates.row]);

    // Compare new grid with the last one before pushing
    if (!arraysAreEqual(grids[grids.length - 1], newGrid)) {
        // Push the updated grid to history only if there's a change
        grids.push(newGrid);

        // Render the updated grid
        render(grids[grids.length - 1]);

        // Update the player's score
        updatePlayerScore();
    }
}

function restart() {
    startGame(grids[0]);
}

// #endregion


// *****************************************************************************
// #region Event Listeners

canvas.addEventListener("mousedown", gridClickHandler);
function gridClickHandler(event) {
    const gridCoordinates = convertCartesiansToGrid(event.offsetX, event.offsetY);
    console.log(`Clicked on column: ${gridCoordinates.column}, row: ${gridCoordinates.row}`);
    ctx.fillStyle = 'yellow';  // Temporarily color the clicked cell yellow
    ctx.fillRect(gridCoordinates.column * CELL_WIDTH, gridCoordinates.row * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    // Delay the actual grid update to allow yellow cell to be shown briefly
    setTimeout(() => {
        updatePlayerScore();
        updateGridAt(event.offsetX, event.offsetY);
    }, 200); // 200 ms delay to visualize the yellow fill
}

restartButton.addEventListener("mousedown", restartClickHandler);
function restartClickHandler() {
    restart();
}

undoButton.addEventListener("mousedown", undoLastMove);
function undoLastMove() {
    rollBackHistory();
}


// #endregion


// *****************************************************************************
// #region Helper Functions

// To convert canvas coordinates to grid coordinates
function convertCartesiansToGrid(xPos, yPos) {
    return {
        column: Math.floor(xPos/CELL_WIDTH),
        row: Math.floor(yPos/CELL_HEIGHT)
    };
}


// #endregion

//Start game
startGame();

});
})();