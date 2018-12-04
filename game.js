var board;
var players = [];
var keys = [];
var rollDice = false;
var timer = 0;
var currentNum = 1;
var moveNum = 0;
var rolled = false;
var canClick = false;
var turn = 0;
var scene = 'menu';

var testButton = {
    x: 10,
    y: 10,
    width: 100,
    heightL: 50,
    label: "For test",
    textSize: 20,
    onClick: function () { alert("test"); }
};
var btn;

function setup () {
    var cnv = createCanvas(600, 600);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
    frameRate(30);
    board = new Board();
    for (var i =0 ; i < 3; i++)
        players.push(new Player(i+1));

}

function menu () {
    
}

function game () {
    noStroke();
    fill(255);
    rect(0, 0, width, height);
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

    if (rollDice && moveNum === 0) {
        rolled = true;
        timer--;
        currentNum = Math.floor(random(1, 7));
        if (timer <= 0) {
            rollDice = false;
            moveNum = currentNum;
        }
    }
    console.log(turn);
    if (moveNum > 0 && !moved && !canClick) {
        if (players[turn].diagonal) {
            var index = players[turn].path[0];
            players[turn].path.splice(0, 1);
            players[turn].currentIndex = index;
            if (players[turn].path.length === 0) {
                players[turn].diagonal = false;
            }
            players[turn].targetSpace = {x: board.spaces[index].x+15, y: board.spaces[index].y+15};
            moveNum--;
            if (moveNum === 0) {
                turn++;
                turn %= this.players.length;
            }
        }
        else if (board.spaces[players[turn].currentIndex].diagonal !== null) {
            canClick = true;
        } else {
            var index = players[turn].currentIndex+1;
            if (index >= 20) {
                index -= 20;
            }
            this.players[turn].targetSpace = {x: board.spaces[index].x+10, y: board.spaces[index].y+10};
            moveNum--;
            players[turn].currentIndex = index;
            if (moveNum === 0) {
                turn++;
                turn %= this.players.length;
            }
        }
    }
    
}

function draw () {
    if (scene === "menu") {
        menu();
    } else if (scene === "game") {
        game();
    }
}

mouseClicked = function () {
    if (scene === "menu") {
        
    } else if (canClick) {
        if (board.spaces[players[turn].currentIndex].diagonal.isInMouse(mouseX, mouseY) || board.spaces[players[turn].currentIndex].next.isInMouse(mouseX, mouseY)) {
            canClick = false;
            if (board.spaces[players[turn].currentIndex].diagonal.isInMouse(mouseX, mouseY)) {
                this.players[turn].targetSpace = {x: board.spaces[players[turn].currentIndex].diagonal.x, y: board.spaces[players[turn].currentIndex].diagonal.y+10};
                moveNum--;
                if (players[turn].currentIndex === 15) {
                    players[turn].path = [21, 20, 23, 5];
                } else if (players[turn].currentIndex === 0) {
                    players[turn].path = [24, 20, 22, 10];
                } else if (players[turn].currentIndex === 5) {
                    players[turn].path = [23, 20, 21, 15];
                } else if (players[turn].currentIndex === 10) {
                    players[turn].path = [22, 20, 24, 0];
                }
                players[turn].currentIndex = players[turn].path[0];
                players[turn].path.splice(0, 1);
                players[turn].diagonal = true;
            } else {
                var index = players[turn].currentIndex+1;
                if (index >= 20) {
                    index -= 20;
                }
                this.players[turn].targetSpace = {x: board.spaces[index].x+10, y: board.spaces[index].y+10};
                moveNum--;
                players[turn].currentIndex = index;
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