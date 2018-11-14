var board;
var players = [];

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
    for (var i = 0; i < players.length; i++) {
        players[i].draw();
        players[i].move();
    }
}

mouseClicked = function () {
    for (var i = 0; i < board.spaces.length; i++) {
        if (board.spaces[i].isInMouse(mouseX, mouseY)) {
            // For now move that one player
            players[0].targetSpace = {x: board.spaces[i].x+10, y: board.spaces[i].y+10};
        }
    }
} 