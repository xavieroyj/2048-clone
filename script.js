const gridContainer = document.querySelector('.grid-container');
const restartButton = document.getElementById('restart');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');

let board = [];
let score = 0;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

function updateScore(points) {
    score += points;
    scoreDisplay.textContent = score;
    
    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.textContent = bestScore;
        localStorage.setItem('bestScore', bestScore);
    }
}

function startGame() {
    const existingGameOver = document.querySelector('.game-over');
    if (existingGameOver) {
        existingGameOver.remove();
    }
    
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    scoreDisplay.textContent = '0';
    bestScoreDisplay.textContent = bestScore;
    generateTile();
    generateTile();
    updateBoard();
}

function generateTile() {
    let emptyTiles = [];
    board.forEach((row, rIndex) => {
        row.forEach((value, cIndex) => {
            if (value === 0) {
                emptyTiles.push({rIndex, cIndex});
            }
        });
    });
    if (emptyTiles.length > 0) {
        const {rIndex, cIndex} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[rIndex][cIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    gridContainer.innerHTML = '';
    board.forEach((row, rIndex) => {
        row.forEach((value, cIndex) => {
            const tile = document.createElement('div');
            tile.className = value ? `tile tile-${value}` : 'tile';
            if (value) {
                const number = document.createElement('div');
                number.className = 'number';
                number.textContent = value;
                tile.appendChild(number);
            }
            gridContainer.appendChild(tile);
        });
    });
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = board[i].filter(cell => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                updateScore(row[j]);
                row.splice(j + 1, 1);
                moved = true;
            }
        }
        while (row.length < 4) {
            row.push(0);
        }
        if (row.join(',') !== board[i].join(',')) {
            moved = true;
        }
        board[i] = row;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = board[i].filter(cell => cell !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                updateScore(row[j]);
                row.splice(j - 1, 1);
                moved = true;
            }
        }
        while (row.length < 4) {
            row.unshift(0);
        }
        if (row.join(',') !== board[i].join(',')) {
            moved = true;
        }
        board[i] = row;
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== 0) {
                column.push(board[i][j]);
            }
        }
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2;
                updateScore(column[i]);
                column.splice(i + 1, 1);
                moved = true;
            }
        }
        while (column.length < 4) {
            column.push(0);
        }
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== column[i]) {
                moved = true;
            }
            board[i][j] = column[i];
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== 0) {
                column.push(board[i][j]);
            }
        }
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i] === column[i - 1]) {
                column[i] *= 2;
                updateScore(column[i]);
                column.splice(i - 1, 1);
                moved = true;
            }
        }
        while (column.length < 4) {
            column.unshift(0);
        }
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== column[i]) {
                moved = true;
            }
            board[i][j] = column[i];
        }
    }
    return moved;
}

function isGameOver() {
    // Check for any empty cells
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }

    // Check for possible merges horizontally
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === board[i][j + 1]) {
                return false;
            }
        }
    }

    // Check for possible merges vertically
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === board[i + 1][j]) {
                return false;
            }
        }
    }

    return true;
}

function showGameOver() {
    const gameOver = document.createElement('div');
    gameOver.className = 'game-over';
    gameOver.innerHTML = `
        <div class="game-over-content">
            <h2>Game Over!</h2>
            <p>Final Score: ${score}</p>
            <button onclick="startGame()">Play Again</button>
        </div>
    `;
    document.querySelector('.game-container').appendChild(gameOver);
}

function handleKeyPress(event) {
    if (document.querySelector('.game-over')) {
        return;
    }

    let moved = false;
    switch(event.key) {
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        default:
            return;
    }
    
    if (moved) {
        generateTile();
        updateBoard();
        
        if (isGameOver()) {
            showGameOver();
        }
    }
}

document.addEventListener('keydown', handleKeyPress);
restartButton.addEventListener('click', startGame);

// Touch event handling
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, false);

document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Minimum swipe distance to trigger a move (in pixels)
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                moveRight();
            } else {
                moveLeft();
            }
        }
    } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                moveDown();
            } else {
                moveUp();
            }
        }
    }
}, false);

startGame();
