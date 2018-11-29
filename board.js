var verticalConst = 20;
var horizontalConst = 15;
var numSpaces;
var numVertical;
var startX;
var startY;
var lastX;
var lastYl

function Board () {
    this.board = [
        [1, 1, 1, 1, 2, 1],
        [2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 2, 1, 1, 3]
    ];
    this.vals = [
        [1,2,3,4,5,6],
        [20,0,0,0,0,7],
        [19,0,0,0,0,8],
        [18,0,0,0,0,9],
        [17,0,0,0,0,10],
        [16,15,14,13,12,11],
    ];
    numSpaces = this.board[0].length;
    numVertical = this.board.length;
    this.spaceRadius = 25;
    this.horizontalDist = (width-(numSpaces*this.spaceRadius*2 + 2*horizontalConst)) / (numSpaces-1);
    this.verticalDist = (height-(numVertical*this.spaceRadius*2 + 2*verticalConst)) / (numVertical-1);
    this.spaceApartx = this.horizontalDist+2*this.spaceRadius;
    this.spaceAparty = this.verticalDist+2*this.spaceRadius;
    
    // Populate the spaces array
    this.spaces = [];
    // Adds from the boards 2d array
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board[0].length; j++) {
            var x = horizontalConst+this.spaceApartx*j;
            var y = verticalConst+this.spaceAparty*i;
            if (this.board[i][j] === 1) {
                this.spaces.push(new Space(x, y, this.spaceRadius, 'good', this.vals[i][j]));
            } else if (this.board[i][j] === 2) {
                this.spaces.push(new Space(x, y, this.spaceRadius, 'bad', this.vals[i][j]));
            }
            else if (this.board[i][j] === 3) {
                this.spaces.push(new Space(x, y, this.spaceRadius, 'shop', this.vals[i][j]));
            }
        }
    }
    
    lastX = this.spaces[this.spaces.length-1].x-3;
    lastY = this.spaces[this.spaces.length-1].y-2;

    this.spaces.sort(function(x, y) { return x.val-y.val; });
    for (var i = 0; i < this.spaces.length; i++) {
        if (i !== this.spaces.length-1) {
            this.spaces[i].next = this.spaces[i+1];
        } else {
            this.spaces[i].next = this.spaces[0];
        }
    }
    // Add some custom spaces that will make an X
    // Looks weird if doing with normal spacing
    var shop = new Space(275, 270, this.spaceRadius, 'shop');
    this.spaces.push(shop);
    this.spaces.push(new Space(150, 395, this.spaceRadius, 'bad'));
    this.spaces.push(new Space(400, 395, this.spaceRadius, 'good'));
    this.spaces.push(new Space(400, 145, this.spaceRadius, 'good'));
    this.spaces.push(new Space(150, 150, this.spaceRadius, 'good'));

    // Link the edges to the diagonal
    this.spaces[15].diagonal = this.spaces[21];
    this.spaces[0].diagonal = this.spaces[24];
    this.spaces[5].diagonal = this.spaces[23];
    this.spaces[10].diagonal = this.spaces[22];
    startX = horizontalConst;
    startY = verticalConst+this.spaceAparty*(numVertical-1);

}


Board.prototype.draw = function () {
    fill(0, 255, 0);
    rect(0, 0, width-1, height-1, 15);
    fill(225, 228, 196);
    noStroke();
    // The horizontal rectangles
    rect(horizontalConst-3, verticalConst-3, 2*this.spaceRadius+5, height - 2*verticalConst+3);
    rect(lastX, verticalConst-3, 2*this.spaceRadius+5, height - 2*verticalConst+3);
    rect(horizontalConst-3, verticalConst-3, width - 2*horizontalConst+3, 2*this.spaceRadius+5);
    rect(horizontalConst-3, lastY, width - 2*horizontalConst+5, 2*this.spaceRadius+5);
    // Rotated ones
    push();
    translate(horizontalConst+this.spaceApartx*(numSpaces-1), verticalConst);
    rotate(radians(45));
    var h = Math.sqrt(Math.pow(horizontalConst+this.spaceApartx*(numSpaces-1), 2) + Math.pow(verticalConst+this.spaceAparty*(numVertical-1)-20, 2));
    rect(0, 0, 2*this.spaceRadius+5, h);
    pop();
    push();
    translate(horizontalConst+5, verticalConst+2*this.spaceRadius-13);
    rotate(radians(-45));
    rect(0, 0, 2*this.spaceRadius+5, h-3);
    pop();
    for (var i = 0; i < this.spaces.length; i++) {
        this.spaces[i].draw();
    }
    // Write the start text
    fill(0, 0, 0);
    textSize(14);
    text('Start', startX+10, startY+30);
}

function Space (x, y, radius, type, val) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.val = val;
    if (type === 'good') {
        this.color = color(0, 255, 0);
        this.onLand = function() {}
    } else if (type === 'bad') {
        this.color = color(255, 0, 0);
        this.onLand = function() {}
    } else if (type === 'shop') {
        this.color = color(255, 0, 255);
        this.onLand = function() {}
    }
    this.next = null;
    this.diagonal = null;
}

Space.prototype.draw = function () {
    ellipseMode(CORNER);
    fill(this.color);
    stroke(0, 0, 0);
    ellipse(this.x, this.y, 2*this.radius, 2*this.radius);
}

Space.prototype.isInMouse = function (x, y) {
    var d = dist(this.x+this.radius, this.y+this.radius, x, y);
    if (d <= this.radius) {
        return true;
    }
    return false;
}

var Player = function (number) {
    this.number = number;
    this.x = startX+10;
    this.y = startY+10;
    this.currentIndex = 15;
    this.color = color(0, 0, 255);
    this.targetSpace = {x:this.x, y:this.y};
    this.onDiagonal = false;
}

Player.prototype.move = function () {
    var moveX = this.targetSpace.x - this.x;
    var moveY = this.targetSpace.y - this.y;
    if ((moveX === 0 && moveY === 0) || (abs(moveX) < 5 && abs(moveY) < 5)) {
        return false;
    }

    if (Math.abs(moveX) < 5) {
        this.x = this.targetSpace.x-5;
    }
    if (Math.abs(moveY) < 5) {
        this.y = this.targetSpace.y-5;
    }

    if (moveX !== 0) {
        this.x += 5*Math.sign(moveX);
    }
    if (moveY !== 0) {
        this.y += 5*Math.sign(moveY);
    }
    return true;
}

Player.prototype.draw = function () {
    // A rectangle for now, change it later
    fill(this.color);
    rect(this.x, this.y, 10, 10);
}