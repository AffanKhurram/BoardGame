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
var numRounds = 1;
var teleporting = false;
var telIndex;
var instIndex = 0;
var canMakeBad = false;
var endSceneTimer = 70;

var buttonObjects = [
    {
        x: 250,
        y: 100,
        label: "Play",
        textSize: 20,
        onClick: function () { scene = "players"; }
    },
    {
        x: 250,
        y: 300,
        label: "Instructions",
        textSize: 18,
        onClick: function () { scene = "instructions"; }
    }
];
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

    // Draw the points chart
    noFill();
    rect(70, 200, 95, 185);
    stroke(0);
    text("Points", 95, 210);
    for (var i=0; i<players.length; i++) {
        text("P"+(i+1)+": " + players[i].points, 80, 240+30*i);
    }

    // Rounds text
    text("Rounds Left: " + numRounds, 395, 260);

    if (rollDice && moveNum === 0 && !teleporting) {
        rolled = true;
        timer--;
        currentNum = Math.floor(random(1, 7));
        if (timer <= 0) {
            rollDice = false;
            moveNum = currentNum;
        }
    }
    if (moveNum === 0 && !teleporting && keys[81]) {
        canMakeBad = true;
    }
    if (moveNum > 0 && !moved && !canClick && !canMakeBad) {
        if (players[turn].diagonal) {
            var index = players[turn].path[0];
            players[turn].path.splice(0, 1);
            players[turn].currentIndex = index;
            if (players[turn].path.length === 0) {
                players[turn].diagonal = false;
            }
            players[turn].targetSpace = {x: board.spaces[index].x+players[turn].xConst, y: board.spaces[index].y+players[turn].yConst};
            moveNum--;
            if (moveNum === 0) {
                if (board.spaces[index].type === "shop") {
                    telIndex = turn;
                }
                board.spaces[index].onLand(players[turn]);
                turn++;
                turn %= this.players.length;
                if (turn === 0) {
                    numRounds--;
                }
            }
        }
        else if (board.spaces[players[turn].currentIndex].diagonal !== null) {
            canClick = true;
        } else {
            var index = players[turn].currentIndex+1;
            if (index >= 20) {
                index -= 20;
            }
            this.players[turn].targetSpace = {x: board.spaces[index].x+players[turn].xConst, y: board.spaces[index].y+players[turn].yConst};
            moveNum--;
            players[turn].currentIndex = index;
            if (moveNum === 0) {
                if (board.spaces[index].type === "shop") {
                    telIndex = turn;
                }
                board.spaces[index].onLand(players[turn]);
                turn++;
                turn %= this.players.length;
                if (turn === 0) {
                    numRounds--;
                }
            }
        }
    }
    if (numRounds <= 0 && !teleporting) {
        if (endSceneTimer > 0) {
            endSceneTimer--;
            return;
        }
        scene = "endScene";
    }
}

function endScene () {
    background(255);
    fill(0);
    textSize(25);
    players.sort(function(a, b) { return b.points - a.points; });
    if (players.length >1 && players[0].points === players[1].points) {
        text("There was a tie between the following players", 10, 100);
        var n = players[0].points;
        for (var i=0; i<players.length; i++) {
            if (n === players[i].points) {
                text("Player " + players[i].number, 10, i*50+200);
            }
        }
    } else {
        text("Player " + (players[0].number) + " wins!!!!!!!", 100, 100);
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
    } else if (scene === "endScene") {
        endScene();
    } else if (scene === "instructions") {
        instructions();
    }
}

function instructions () {
    background(255);
    if (instIndex === 0) {
        text("Welcome to my game\nThe goal is simple, collect the most points before the game ends, and you will win", 250, 10);
    } else if (instIndex === 1) {
        board.draw();
        text("Here is a picture of the board, all players\nwill start on the start space in the bottom left corner", 200, 100);
    } else if (instIndex === 2) {
        text("Press r to roll the dice", 100, 75);
        fill(255);
        rect(275, 50, 50, 50);
        fill(0);
        textAlign(LEFT, CENTER);
        textSize(15);
        text(currentNum, 295, 75);
        text("You will move the number of spaces said on the dice", 100, 150);
        text("If you land on this space, your points will increase by three", 100, 225);
        fill(0, 255, 0);
        ellipse(500, 200, 50, 50);
        fill(0);
        text("If you land on this space, your points will decrease by three", 100, 300);
        fill(255, 0, 0);
        ellipse(500, 275, 50, 50);
        fill(0);
        text("If you land on this space, you will be able to move to a space\non the edge", 100, 375);
        fill(255, 0, 255);
        ellipse(515, 350 , 50, 50);
    } else if (instIndex === 3) {
        text("The players will show up on the board in this order", 100, 50);
        textSize(50);
        text("1", 200, 200);
        text("2", 400, 200);
        text("3", 200, 400);
        text("4", 400, 400);
        textSize(20);
    } else if (instIndex === 4) {
        textSize(25);
        text("You will move in a clockwise path around the board.\nIf you ever hit a space on the corner, you have the\noption to move through the diagonal or continue\non the edge", 10, 150);
        text("You may also press 'q' to change any green space\ninto a red one. This will end up taking up your turn\nso keep that in mind.", 10, 300);
    } else if (instIndex === 5) {
        scene = "menu";
        menu();
        return;
    }
    fill(0);
    text("(Click to continue)", 250, 500);
}

mouseClicked = function () {
    if (scene === "menu") {
        for (var i=0; i<buttons.length; i++) {
            buttons[i].handleClick();
        }
    } else if (scene === "instructions") {
        instIndex++;
    } else if (scene === 'players') {
        for (var i = 0; i < playersButtons.length; i++) {
            playersButtons[i].handleClick();
        }
    } else if (canClick) {
        if (board.spaces[players[turn].currentIndex].diagonal.isInMouse(mouseX, mouseY) || board.spaces[players[turn].currentIndex].next.isInMouse(mouseX, mouseY)) {
            canClick = false;
            if (board.spaces[players[turn].currentIndex].diagonal.isInMouse(mouseX, mouseY)) {
                this.players[turn].targetSpace = {x: board.spaces[players[turn].currentIndex].diagonal.x+players[turn].xConst, y: board.spaces[players[turn].currentIndex].diagonal.y+players[turn].yConst};
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
                var index = players[turn].currentIndex;
                if (moveNum === 0) {
                    if (board.spaces[index].type === "shop") {
                        telIndex = turn;
                    }
                    board.spaces[players[turn].currentIndex].onLand(players[turn]);
                    turn++;
                    turn %= players.length;
                    if (turn === 0) {
                        numRounds--;
                    }
                }
            } else {
                var index = players[turn].currentIndex+1;
                if (index >= 20) {
                    index -= 20;
                }
                this.players[turn].targetSpace = {x: board.spaces[index].x+players[turn].xConst, y: board.spaces[index].y+players[turn].yConst};
                moveNum--;
                players[turn].currentIndex = index;
                if (moveNum === 0) {
                    if (board.spaces[index].type === "shop") {
                        telIndex = turn;
                    }
                    board.spaces[index].onLand(players[turn]);
                    turn++;
                    turn %= players.length;
                    if (turn === 0) {
                        numRounds--;
                    }
                }
            }
        }
    } else if (canMakeBad) {
        for (var i=0; i<board.spaces.length; i++) {
            if (board.spaces[i].isInMouse(mouseX, mouseY) && board.spaces[i].type === "good") {
                board.spaces[i] = new Space(board.spaces[i].x, board.spaces[i].y, board.spaces[i].radius, "bad", board.spaces[i].val);
                turn++;
                canMakeBad = false;
                turn %= players.length;
                if (turn === 0) {
                    numRounds--;
                }
            }
        }
    } 
    if (teleporting) {
        for (var i=0; i<20; i++) {
            if (board.spaces[i].isInMouse(mouseX, mouseY)) {
                teleporting = false;
                players[telIndex].currentIndex = i;
                players[telIndex].x = board.spaces[i].x+10;
                players[telIndex].y = board.spaces[i].y+10;
                players[telIndex].targetSpace = {x: players[telIndex].x, y: players[telIndex].y};
                if (players[telIndex].path.length) {
                    players[telIndex].path = [];
                    players[telIndex].diagonal = false;
                }
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

function teleport () {
    teleporting = true;
    alert("Click on the square you want to move to on the edge of the board");
}