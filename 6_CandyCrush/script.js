var candies = ["Blue", "Purple", "Red", "Yellow", "Green", "Orange"];
var board = [];
var columns = 9;
var rows = 9;
var score = 0;
var curTile;
var otherTile;
var touchStartX = 0;
var touchStartY = 0;

window.onload = function () {
    startGame();

    window.setInterval(function () {
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
};

function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    board = []; // Reset the board array

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./image/" + randomCandy() + ".png";
            tile.draggable = true;

            // Desktop drag events
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            // Mobile touch events
            tile.addEventListener("touchstart", touchStart, { passive: false });
            tile.addEventListener("touchmove", touchMove, { passive: false });
            tile.addEventListener("touchend", touchEnd, { passive: false });

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

// Desktop drag functions
function dragStart() {
    curTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop(e) {
    e.preventDefault();
    otherTile = this;
}

function dragEnd() {
    if (!otherTile || curTile === otherTile) return;
    swapTiles();
}

// Mobile touch functions
function touchStart(e) {
    e.preventDefault();
    curTile = this;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function touchMove(e) {
    e.preventDefault();
}

function touchEnd(e) {
    e.preventDefault();
    if (!curTile) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Only consider significant swipes (more than 30px)
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    const [r, c] = curTile.id.split("-").map(Number);
    let targetR = r,
        targetC = c;

    // Determine swipe direction
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        targetC = dx > 0 ? c + 1 : c - 1;
    } else {
        // Vertical swipe
        targetR = dy > 0 ? r + 1 : r - 1;
    }

    // Check if target is within bounds
    if (targetR >= 0 && targetR < rows && targetC >= 0 && targetC < columns) {
        otherTile = board[targetR][targetC];
        swapTiles();
    }
}

// Common function for both desktop and mobile
function swapTiles() {
    if (!curTile || !otherTile || curTile.src.includes("blank") || otherTile.src.includes("blank") || curTile === otherTile) {
        return;
    }

    let [r1, c1] = curTile.id.split("-").map(Number);
    let [r2, c2] = otherTile.id.split("-").map(Number);

    // Check if tiles are adjacent
    let isAdjacent = Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;

    if (isAdjacent) {
        let curImg = curTile.src;
        let otherImg = otherTile.src;
        curTile.src = otherImg;
        otherTile.src = curImg;

        let validMove = checkValid();
        if (!validMove) {
            // Swap back if not valid
            curTile.src = curImg;
            otherTile.src = otherImg;
        } else {
            // Update the board array to reflect the swap
            board[r1][c1].src = otherImg;
            board[r2][c2].src = curImg;
            crushCandy(); // check for candies to crush after a successful swap
        }
    }
}

function crushCandy() {
    let candiesCrushed = crushMatches();
    if (candiesCrushed) {
        score += candiesCrushed >= 6 ? 60 : candiesCrushed >= 5 ? 50 : candiesCrushed >= 4 ? 40 : 30;
        document.getElementById("score").innerText = score;
    }
}

function crushMatches() {
    let totalCrushed = 0;

    // Check horizontal lines
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                let count = 3;
                while (c + count < columns && board[r][c + count].src === candy1.src && !board[r][c + count].src.includes("blank")) {
                    count++;
                }
                for (let i = 0; i < count; i++) {
                    board[r][c + i].src = "./image/blank.png";
                }
                totalCrushed += count;
                c += count - 1; // skip over crushed candies
            }
        }
    }

    // Check vertical lines
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                let count = 3;
                while (r + count < rows && board[r + count][c].src === candy1.src && !board[r + count][c].src.includes("blank")) {
                    count++;
                }
                for (let i = 0; i < count; i++) {
                    board[r + i][c].src = "./image/blank.png";
                }
                totalCrushed += count;
                r += count - 1; // skip over crushed candies
            }
        }
    }

    return totalCrushed;
}

function checkValid() {
    // Check horizontal and vertical lines for valid moves
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            if (board[r][c].src === board[r][c + 1].src && board[r][c + 1].src === board[r][c + 2].src && !board[r][c].src.includes("blank")) {
                return true;
            }
        }
    }
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            if (board[r][c].src === board[r + 1][c].src && board[r + 1][c].src === board[r + 2][c].src && !board[r][c].src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = rows - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind--;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./image/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./image/" + randomCandy() + ".png";
        }
    }
}

