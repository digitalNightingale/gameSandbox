/*******************
 * Platform Object *
 *******************/

// function Platform(game, spritesheet) {
//     this.animation = new Animation(spritesheet, 0, 69, 132, 69, 0.15, 7, true, false);
//     this.x = 0;
//     this.speed = 1;
//     Entity.call(this, game, 350, 500); // x and y
// }

function Platform(game, ctx, spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, speed, scale, x, y, name) {
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
    this.speed = speed;
    this.scale = scale;
    this.boundingBox = {x: frameWidth, y: frameHeight};
    this.animation = new Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse);
    this.x = x;
    this.initialX = this.x;
    this.y = y;
    this.name = name;
    this.boundingBox = new BoundingBox(this.x, this.y, this.frameWidth, this.frameHeight);
    Entity.call(this, this.game, this.x, this.y); // y == the sprites gound
}

Platform.prototype = new Entity();
Platform.prototype.constructor = Platform;

Platform.prototype.update = function () {
    if (this.game.running) {
        this.x -= this.game.clockTick * this.speed * 200;
        if (this.x < -120) {
            this.x = this.initialX - 120;
        }
        this.boundingBox = new BoundingBox(this.x, this.y, this.frameWidth, this.frameHeight);
        Entity.prototype.update.call(this);
    }
}

Platform.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        Entity.prototype.draw.call(this);
    } 
}