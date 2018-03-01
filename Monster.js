/***********
 * Monster *
 ***********/

function Monster(game, ctx, spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, scale, x, y) {
    
    this.game = game;
    this.ctx = ctx;
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.frameDuration = frameDuration;
    this.frames = frames;
    this.loop = loop;
    this.reverse = reverse;
    this.scale = scale;
    this.animation = new Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse);
    this.x = x; //10;
    this.y = 550 - frameHeight * scale; //510 - frameHeight;
    this.boundingBox = new BoundingBox(this.x, this.y, this.frameWidth * 2, this.frameHeight * 2);
    Entity.call(this, game, this.x, this.y);
} 

Monster.prototype = new Entity();
Monster.prototype.constructor = Monster;

Monster.prototype.update = function () {
    if (this.game.running) Entity.prototype.update.call(this);
}

Monster.prototype.draw = function() {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.scale);
        Entity.prototype.draw.call(this);
    }
}

Monster.prototype.move = function() {
    this.x += 10;
    this.boundingBox = new BoundingBox(this.x, this.y, this.frameWidth * 2 - 20, this.frameHeight * 2);
}

Monster.prototype.retreat = function() {
    this.x -= 50;
    this.boundingBox = new BoundingBox(this.x, this.y, this.frameWidth * 2 - 20, this.frameHeight * 2);
}