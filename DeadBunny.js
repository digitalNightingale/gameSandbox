function DeadBunny(game, ctx, spriteSheet) {
    this.animation = new Animation(spriteSheet, 0, 0, 65, 60, 1, 4, false, false);
    this.x = 485;
    this.y = 450;
    this.isDone = false;
    this.game = game;
    this.ctx = ctx;
    this.dead = false;
}

DeadBunny.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

DeadBunny.prototype.update = function () {
    if (this.dead) {
        if (this.animation.elapsedTime > this.animation.totalTime * 3 / 4) {
            this.animation.startX = 195;
            this.animation.frameDuration = 9999;
            this.animation.frames = 1;
            this.animation.loop = true;
        }
        Entity.prototype.draw.call(this);
    }
}