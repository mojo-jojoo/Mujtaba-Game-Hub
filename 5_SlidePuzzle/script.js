    
var rows = 3;
var columns = 3;

var curTile;
var otherTile; //blank tile

var turns = 0;

var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

window.onload = function() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + imgOrder.shift() + ".jpg";
            tile.draggable = true; // Add this to make images draggable

            // Switching Tiles
            tile.addEventListener("dragstart", dragStart);   // click an image to drag
            tile.addEventListener("dragover", dragOver);      // moving image over potential drop target
            tile.addEventListener("dragenter", dragEnter);    // dragging image onto another one
            tile.addEventListener("dragleave", dragLeave);    // leaving image over another tile
            tile.addEventListener("drop", dragDrop);          // drop on another tile
            tile.addEventListener("dragend", dragEnd);        // after drag operation completes

            document.getElementById("board").append(tile);
        }
    }
}

function dragStart() {
    curTile = this; // this is the image being dragged
}

function dragOver(e) {
    e.preventDefault(); // necessary to allow drop
}

function dragEnter(e) {
    e.preventDefault(); // necessary to allow drop
}

function dragLeave() {
    // optional: can add visual feedback when leaving a tile
}

function dragDrop(e) {
    e.preventDefault();
    otherTile = this; // this is the tile being dropped on
}

function dragEnd() {
    // Only proceed if we have both tiles
    if (!curTile || !otherTile) return;
    
    // Don't allow self-drops
    if (curTile === otherTile) return;

    let curCords = curTile.id.split("-");
    let r = parseInt(curCords[0]);
    let c = parseInt(curCords[1]);

    let otherCords = otherTile.id.split("-");
    let r2 = parseInt(otherCords[0]);
    let c2 = parseInt(otherCords[1]);

    // Check if the tiles are adjacent (including diagonal)
    let moveLeft = c2 == c - 1 && r2 == r;
    let moveRight = c2 == c + 1 && r2 == r;
    let moveUp = r2 == r - 1 && c2 == c;
    let moveDown = r2 == r + 1 && c2 == c;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let curImg = curTile.src;
        let otherImg = otherTile.src;

        curTile.src = otherImg;
        otherTile.src = curImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;
    }
}