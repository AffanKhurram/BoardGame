var board;
var players = [];
var keys = [];
var rollDice = false;
var timer = 0;
var currentNum = 1;
var moveNum = 0;
var rolled = false;
var canClick = false;

function setup () {
    var cnv = createCanvas(600, 600);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
    frameRate(30);
    board = new Board();
    players.push(new Player(1));
}

function draw () {
    board.draw();
    var moved = false;
    for (var i = 0; i < players.length; i++) {
        players[i].draw();
        moved = players[i].move();
    }
    // Roll the dice
    if (keys[82]) {
        rollDice = true;
        timer = 30;
    }
    // Draw the dice
    fill(255);
    rect(275, 100, 50, 50);
    fill(0);
    textSize(15);
    text(currentNum, 295, 130);
    if (rollDice) {
        rolled = true;
        timer--;
        currentNum = Math.floor(random(1, 7));
        if (timer <= 0) {
            rollDice = false;
            moveNum = currentNum;
        }
    }
    if (moveNum > 0 && !moved && !canClick) {
        if (players[0].diagonal) {
            
        }
        if (board.spaces[players[0].currentIndex].diagonal !== null) {
            canClick = true;
        } else {
            var index = players[0].currentIndex+1;
            if (index >= 20) {
                index -= 20;
            }
            this.players[0].targetSpace = {x: board.spaces[index].x+10, y: board.spaces[index].y+10};
            moveNum--;
            players[0].currentIndex = index;
        }
    }
}

mouseClicked = function () {
    if (canClick) {
        if (board.spaces[players[0].currentIndex].diagonal.isInMouse(mouseX, mouseY) || board.spaces[players[0].currentIndex].next.isInMouse(mouseX, mouseY)) {
            canClick = false;
            if (board.spaces[players[0].currentIndex].diagonal.isInMouse(mouseX, mouseY)) {
                this.players[0].targetSpace = {x: board.spaces[players[0].currentIndex].diagonal.x, y: board.spaces[players[0].currentIndex].diagonal.y+10};
                moveNum--;
                players[0].currentIndex = index;
                players[0].diagonal = true;
            } else {
                var index = players[0].currentIndex+1;
                if (index >= 20) {
                    index -= 20;
                }
                this.players[0].targetSpace = {x: board.spaces[index].x+10, y: board.spaces[index].y+10};
                moveNum--;
                players[0].currentIndex = index;
            }
        }
    }
    // If the dice is clicked
    if (mouseX >= 275 && mouseX <= 325 && mouseY >= 100 && mouseY <= 150) {
        keys[82] = true;
    }
}
mouseReleased = function () {
    if (mouseX >= 275 && mouseX <= 325 && mouseY >= 100 && mouseY <= 150) {
        keys[82] = false;
    }
}

keyPressed = function () {
    keys[keyCode] = true;
}

keyReleased = function () {
    keys[keyCode] = false;
}