var Button = function(object) {
    this.x = object.x;
    this.y = object.y;
    this.width = object.width || 100;
    this.height = object.height || 50;
    this.label = object.label;
    this.textSize = object.textSize;
    this.onClick = object.onClick;
    this.color = object.color || color(0, 243, 247);
};   
Button.prototype.draw = function() {
    fill(this.color);
    rectMode(CORNER);
    rect(this.x, this.y, this.width, this.height, 5);
    fill(0, 0, 0);
    textSize(this.textSize);
    textAlign(CENTER, TOP);
    text(this.label, this.x+this.width/2, this.y+this.height/4);
};
Button.prototype.checkMouseIn = function() {
    return mouseX >= this.x && mouseX <= this.x+this.width &&
           mouseY >= this.y && mouseY <= this.y+this.height;
           
}; 
Button.prototype.handleClick = function() {
    if (this.checkMouseIn()) {
        this.onClick();
    }    
};