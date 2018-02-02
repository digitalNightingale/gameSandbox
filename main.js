/*****************
 * Leahs SandBox *
 *****************/

/*********************
 * Animantion Object *
 *********************/

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1; // make bunny smaller or bigger
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY, // source from sheet
        this.frameWidth, this.frameHeight,
        locX, locY,
        this.frameWidth * scaleBy,
        this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


/****************
 * Bunny Object *
 ****************/

function Bunny(game) {

    // Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse)
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/Rev_Bunny.png"), 240, 114, 58, 57, 0.15, 4, true, true);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/Rev_Bunny.png"), 0, 0, 62, 57, 0.12, 2, false, true);
    this.jumping = false;
    this.radius = 100;
    this.ground = 475; // changed from 400
    Entity.call(this, game, 0, 475); // changed from 400
}

Bunny.prototype = new Entity();
Bunny.prototype.constructor = Bunny;

Bunny.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }
    Entity.prototype.update.call(this);
}

Bunny.prototype.draw = function (ctx) {
    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

/*********************
 * Dead Bunny Object *
 *********************/

function DeadBunny(game, spritesheet) {
    this.animation = new Animation(spritesheet, 0, 0, 65, 60, 1, 4, false, false);
    this.spriteSheet = spritesheet;
    this.x = 485;
    this.y = 450;
    this.isDone = false;
    this.game = game;
    this.ctx = game.ctx;
}

DeadBunny.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

DeadBunny.prototype.update = function () {
    if (this.animation.elapsedTime > this.animation.totalTime * 3 / 4) {
        this.animation.startX = 195;
        this.animation.frameDuration = 9999;
        this.animation.frames = 1;
        this.animation.loop = true;
    }
    Entity.prototype.draw.call(this);
}


/*********************
 * Background Object *
 *********************/

function Background(game, spritesheet, speed) {
    this.speed = speed;
    this.backgroundWidth = 1017;
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;

    this.draw = function () {
        this.x += this.speed;
        // Scrolling left
        this.ctx.drawImage(spritesheet, -(this.x), this.y);

        // Draws image at edge of the first image
        this.ctx.drawImage(spritesheet, -(this.x - this.backgroundWidth), this.y);

        // Reset after image runs off screen
        if (this.x >= this.backgroundWidth)
            this.x = 0;

    };
}

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function () {};


/***************
 * Text Object *
 ***************/

    /// expand with color, background etc.
    function drawTextBG(ctx, txt, font, x, y) {

        ctx.save();
        ctx.font = font;
        ctx.textBaseline = 'top'; //moves up
        //ctx.fillStyle = '#f50';

        //var width = ctx.measureText(txt).width;
        //ctx.fillRect(x, y, width, parseInt(font, 10));

        ctx.fillStyle = '#000';
        ctx.fillText(txt, x, y);

        ctx.restore();
    }


/*************************
 * Main Code Begins Here *
 *************************/

var ASSET_MANAGER = new AssetManager();

// Backgrounds

// ASSET_MANAGER.queueDownload("./img/Rev_Bunny.png");
// ASSET_MANAGER.queueDownload("./img/tree_layer_0.png");
// ASSET_MANAGER.queueDownload("./img/tree_layer_1.png");
// ASSET_MANAGER.queueDownload("./img/tree_layer_2.png");
// ASSET_MANAGER.queueDownload("./img/tree_layer_3.png");
// ASSET_MANAGER.queueDownload("./img/tree_layer_4.png");
// ASSET_MANAGER.queueDownload("./img/tree_layer_5.png");

// Game Over

ASSET_MANAGER.queueDownload("./img/deathBackground.jpg");
ASSET_MANAGER.queueDownload("./img/game_over.png");
ASSET_MANAGER.queueDownload("./img/deadBunny.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    // var bunny = new Bunny(gameEngine);
    gameEngine.init(ctx);
    gameEngine.start();

    // gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/tree_layer_5.png"), 0));
    // gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/tree_layer_4.png"), 1.4));
    // gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/tree_layer_3.png"), 1.5));
    // gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/tree_layer_2.png"), 1.8));
    // gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/tree_layer_1.png"), 1.9));
    // gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/tree_layer_0.png"), .5));


    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/deathBackground.jpg"), 0));
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/game_over.png"), 0));
    //gameEngine.addEntity(bunny);
    
    gameEngine.addEntity(new DeadBunny(gameEngine, ASSET_MANAGER.getAsset("./img/deadBunny.png")));


    var ctx = text.getContext('2d'),
        txt = 'GAME OVER';
    drawTextBG(ctx, txt, '124px Comic Sans MS', 60, 60);


});