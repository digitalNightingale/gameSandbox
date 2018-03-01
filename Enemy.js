/*********
 * Enemy *
 *********/


function Enemy(game, ctx, spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, speed, scale, type, x, y, name) {
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
    this.type = type;
    this.name = name;
    switch (type) {
        case "walk":
            this.x = x; //0 - frameWidth;
            this.y = 550 - frameHeight; //510 - frameHeight;
            break;
        case "fly":
            this.x = x; //0 - frameWidth;
            this.y = y; //frameHeight;
            break;
        default:
            this.x = 0;
            this.y = 0;
            break;
    }
    this.boundingBox = new BoundingBox(this.x, this.y, this.frameWidth, this.frameHeight);
    this.animation = new Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse);
    Entity.call(this, game, this.x, this.y);
}

Enemy.prototype = new Entity();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    if (this.game.running) {
        this.x -= this.game.clockTick * this.speed * 100;
        if (this.x < -120) {
            this.x = 1018;
        }
        this.boundingBox = new BoundingBox(this.x, this.y, this.frameWidth, this.frameHeight);
        Entity.prototype.update.call(this);
    }
}

Enemy.prototype.draw = function () {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.scale);
        Entity.prototype.draw.call(this);
    }
}