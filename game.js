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
var numPlayers = 0;

var buttonObjects = [{
    x: 250,
    y: 100,
    label: "play",
    textSize: 20,
    onClick: function () { scene = "players"; }
}];
var buttons = [];

var playersButtonObj = [
    {
        x: 150,
        y: 150,
        label: '1',
        textSize: 20,
        onClick: function () { numPlayers=1; scene = "game"; }
    },
    {
        x: 400,
        y: 150,
        label: '2',
        textSize: 20,
        onClick: function () { numPlayers=2; scene="game"; }
    }, 
    {
        x: 150,
        y: 350,
        label: '3',
        textSize: 20,
        onClick: function () { numPlayers=3; scene='game'; }
    },
    {
        x: 400,
        y: 350,
        label: '4',
        textSize: 20,
        onClick: function () { numPlayers=4; scene='game'; }
    }
    
];
var playersButtons = [];

function setup () {
    var cnv = createCanvas(600, 600);
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
    frameRate(30);
    board = new Board();
    for (var i = 0; i < buttonObjects.length; i++) {
        buttons.push(new Button(buttonObjects[i]));
    }
    for (var i=0; i<playersButtonObj.length; i++) {
        playersButtons.push(new Button(playersButtonObj[i]));
    }
}

function menu () {
    for (var i=0; i<buttons.length; i++) {
        buttons[i].draw();
    }
}

function game () {
    for (var i=1; players.length<numPlayers; i++) {
        players.push(new Player(i));
    }
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
    textAlign(LEFT, CENTER);
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

function playersSelect () {
    background(255);
    textAlign(CENTER, TOP);
    text("Select number of players", width/2, 50);
    for (var i=0; i < playersButtons.length; i++) {
        playersButtons[i].draw();
    }
}

function draw () {
    if (scene === "menu") {
        menu();
    } else if (scene === "game") {
        game();
    } else if (scene === "players") {
        playersSelect();
    }
}

mouseClicked = function () {
    if (scene === "menu") {
        for (var i=0; i<buttons.length; i++) {
            buttons[i].handleClick();
        }
    } else if (scene === 'players') {
        for (var i = 0; i < playersButtons.length; i++) {
            playersButtons[i].handleClick();
        }
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
}
mouseReleased = function () {
    
}

mouseMoved = function () {
    if (scene === "menu") {
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].checkMouseIn()){
                cursor(HAND);
                return;
            }
        }
    }
    if (scene === "players") {
        for (var i = 0; i < playersButtons.length; i++) {
            if (playersButtons[i].checkMouseIn()){
                cursor(HAND);
                return;
            }
        }
    }
    cursor(ARROW);
}

keyPressed = function () {
    keys[keyCode] = true;
}

keyReleased = function () {
    keys[keyCode] = false;
}