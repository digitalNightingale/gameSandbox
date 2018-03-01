/*********************
 *   Leah Ruisenor   *
 *********************/

/*********************
 * Animantion Object *
 *********************/
var copy = [];
var score = null;

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
 * temp Pause Button *
 *********************/
//Temp button code
function Pause(game, ctx, spriteSheet, back) {
    this.game = game;
    this.ctx = ctx;
    this.flag = false;
    this.back = back;
    this.entities_copy = [];
    this.animation = new Animation(spriteSheet, 16, 16, 480, 480, Infinity, 1, false, false);
    Entity.call(this, this.game, 0, 0);
}

Pause.prototype = new Entity();
Pause.prototype.constructor = Pause;

//end undo
Pause.prototype.update = function () {
    if ((this.game.click.x > 960 && this.game.click.x < 1008) &&
        this.game.click.y > 8 && this.game.click.y < 56 && this.game.running) {
        this.game.entities[0].visible = true;
        var temp = this.game.entities[this.game.entities.length - 1];
        this.entities_copy[0] = this.game.entities[0];
        for(var i = 1; i < this.game.entities.length; i++) {
            this.entities_copy[i] = this.game.entities[i];
            this.game.entities[i].removeFromWorld = true;
        }
    }
    this.game.click.x = null;
    this.game.click.y = null;
    
};

Pause.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, this.ctx, 960, 8, .1);
    Entity.prototype.draw.call(this);
};

/*************************
 * Main Code Begins Here *
 *************************/

var ASSET_MANAGER = new AssetManager();

//Rabbit
ASSET_MANAGER.queueDownload("./imgs/Rabbit/Rev_Bunny.png");

//Monsters
ASSET_MANAGER.queueDownload("./imgs/Monster/wraith.png");
//ASSET_MANAGER.queueDownload("./imgs/Monster/knight.png");

//Enemies
ASSET_MANAGER.queueDownload("./imgs/Enemies/crowFly.png");
ASSET_MANAGER.queueDownload("./imgs/Enemies/hawk.png");
ASSET_MANAGER.queueDownload("./imgs/Enemies/stumpy.png");
ASSET_MANAGER.queueDownload("./imgs/Enemies/bearWalk.png");
ASSET_MANAGER.queueDownload("./imgs/Enemies/snake.png");
ASSET_MANAGER.queueDownload("./imgs/Enemies/snail.png");

//Pickups
ASSET_MANAGER.queueDownload("./imgs/Pickups/goldCarrot.png");
ASSET_MANAGER.queueDownload("./imgs/Pickups/carrot.png");
ASSET_MANAGER.queueDownload("./imgs/Pickups/mushroom.png");

//Background
ASSET_MANAGER.queueDownload("./imgs/Background/black_vignette.png");
ASSET_MANAGER.queueDownload("./imgs/Background/cave.png");
ASSET_MANAGER.queueDownload("./imgs/Background/tutorial_1.png");
ASSET_MANAGER.queueDownload("./imgs/Background/tutorial_2.png");
ASSET_MANAGER.queueDownload("./imgs/Background/temp_pause.png");
ASSET_MANAGER.queueDownload("./imgs/Background/start_game_bg.png");
ASSET_MANAGER.queueDownload("./imgs/Background/highscore.png");
ASSET_MANAGER.queueDownload("./imgs/Background/tree_layer_0.png");
ASSET_MANAGER.queueDownload("./imgs/Background/tree_layer_1.png");
ASSET_MANAGER.queueDownload("./imgs/Background/tree_layer_2.png");
ASSET_MANAGER.queueDownload("./imgs/Background/tree_layer_3.png");
ASSET_MANAGER.queueDownload("./imgs/Background/tree_layer_4.png");
ASSET_MANAGER.queueDownload("./imgs/Background/tree_layer_5.png");

//Platform
ASSET_MANAGER.queueDownload("./imgs/Platforms/portal.png");
ASSET_MANAGER.queueDownload("./imgs/Platforms/hole_portal.png");
ASSET_MANAGER.queueDownload("./imgs/Platforms/bush.png");
ASSET_MANAGER.queueDownload("./imgs/Platforms/sign.png");

ASSET_MANAGER.queueDownload("./imgs/Platforms/sm_stump.png");
ASSET_MANAGER.queueDownload("./imgs/Platforms/med_stump.png");
ASSET_MANAGER.queueDownload("./imgs/Platforms/lg_stump.png");

//Buttons
ASSET_MANAGER.queueDownload("./imgs/pause.png");

//Game Over
ASSET_MANAGER.queueDownload("./imgs/Gameover/deadBunny.png");
ASSET_MANAGER.queueDownload("./imgs/Gameover/deathBackground.png");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    initialize(gameEngine, ctx);
});

function initialize (gameEngine, ctx) {
    //Pause
    var score = new Scoring(gameEngine, ctx);
    var pause = new Pause(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/pause.png"), 0);

    //Monsters
    var wraith = new Monster(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Monster/wraith.png"), 360, 0, 88.3, 105, .15, 4, true, true, 2, -88.3 * 2, 330);
    //var mist = new Monster(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Monster/knight.png"), 800, 105, 104, 105, .15, 6, true, true, 2, -120, 330);

    //Pickups
    var mushroom = new Pickup(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Pickups/mushroom.png"), .5, .5, 33, 33, .15, 2, true, true, 1.8, 1, 1000, 505, "mush"); //300
    var carrot = new Pickup(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Pickups/carrot.png"), 0, 0, 39, 62, .15, 5, true, true, 2, 1, 1100, 475, "car");

    //Enemies
    var crow = new Enemy(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Enemies/crowFly.png"), 0, 0, 73, 73, .10, 5, true, true, 4, 1, "fly", 400, 300);
    var hawk = new Enemy(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Enemies/hawk.png"), 0, -15, 130, 130, .10, 9, true, true, 4, 1, "fly", 500, 350);
    var bear = new Enemy(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Enemies/bearWalk.png"), -10, 0, 196, 108, 0.15, 5, true, true, 4, 1, "walk", 1300, 450);
    var stumpy = new Enemy(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Enemies/stumpy.png"), 0, 90, 111, 85, .17, 4, true, true, 4, 1, "walk", 1400, 450); //600, 470
    var snake = new Enemy(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Enemies/snake.png"), 0, 0, 95, 87, 0.15, 12, true, true, 4, 1, "walk", 1500, 450);

    //Background
    var vignette = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/black_vignette.png"), 0);
    var cave = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/cave.png"), 4);
    var pause_back = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/temp_pause.png"), 0, pause);
    var start = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/start_game_bg.png"), 0);
    var tutorial = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/tutorial_1.png"), 0);
    var tutorial2 = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/tutorial_2.png"), 0);
    var highscore = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/highscore.png"), 0);
    var back1 = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/tree_layer_5.png"), 0);
    var back2 = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/tree_layer_4.png"), .5);
    var back3 = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/tree_layer_3.png"), 1);
    var back4 = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/tree_layer_2.png"), 2);
    var back5 = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/tree_layer_1.png"), 4);
    var back6 = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Background/tree_layer_0.png"), 8);

    //Platforms
    //game, ctx, spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse, speed, scale, x, y) {
    var hole = new Platform(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Platforms/hole_portal.png"), 0, 0, 85, 41, 0.15, 1, true, false, 1.2, 1, 4000, 510, "bonus");
    var sign = new Platform(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Platforms/sign.png"), 0, 0, 63, 93, 0.15, 1, true, false, 1.2, 1, 4015, 425);
    var snail = new Enemy(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Enemies/snail.png"), 0, 0, 45, 36, 0.15, 4, true, true, 2.4, 0.7, "walk", 3950, 500, "snail");

    var sstump = new Platform(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Platforms/sm_stump.png"), 50, 56, 90, 112, 0.15, 1, true, false, 1.5, 1, 1800, 420, "stump"); //move= 1 //460 = up/down
    var mstump = new Platform(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Platforms/med_stump.png"), 172.5, 132, 100, 153, 0.15, 1, true, false, 1.5, 1, 2100, 380, "stump");
    var lstump = new Platform(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Platforms/lg_stump.png"), 76, 22, 98, 194, 0.15, 1, true, false, 1.5, 1, 2400, 345, "stump");
  
    //Game Over
    var death = new Background(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Gameover/deathBackground.png"), 0);
    var corpse = new DeadBunny(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Gameover/deadBunny.png"));

    //Rabbits
    var bunny = new Bunny(gameEngine, ctx, ASSET_MANAGER.getAsset("./imgs/Rabbit/Rev_Bunny.png"), wraith, score, vignette); 

    //gameEngine.addEntity(pause_back);
    gameEngine.addEntity(pause_back);
    gameEngine.addEntity(death);
    gameEngine.addEntity(corpse);
    /************************************************
     * NEVER EVER EVER EVER ADD AN ENTITY BEFORE THIS
     *************************************************/

    gameEngine.addEntity(cave);
    gameEngine.addEntity(back1);
    gameEngine.addEntity(back2);
    gameEngine.addEntity(back3);
    gameEngine.addEntity(back4);
    gameEngine.addEntity(back5);
    gameEngine.addEntity(back6);

    gameEngine.addEntity(sign);
    gameEngine.addEntity(snail);
    gameEngine.addEntity(hole);
    gameEngine.addEntity(sstump);
    gameEngine.addEntity(mstump);
    gameEngine.addEntity(lstump);

    
    gameEngine.addEntity(bear);
    gameEngine.addEntity(crow);
    gameEngine.addEntity(hawk);
    gameEngine.addEntity(stumpy);
    gameEngine.addEntity(snake);

    // if (getRandomInt(0, 1) === 0) {
    //     gameEngine.addEntity(wraith);
    // } else {
    //     gameEngine.addEntity(mist);
    // }

    gameEngine.addEntity(mushroom);
    gameEngine.addEntity(carrot);
    gameEngine.addEntity(wraith);

    
    gameEngine.addEntity(bunny);
    gameEngine.addEntity(vignette);
    gameEngine.addEntity(score);

    /********************************************************************* 
     * NEVER EVER EVER EVER ADD AN ENTITY AFTER THIS
    **********************************************************************/
    
    gameEngine.addEntity(pause);
    gameEngine.addEntity(tutorial2);
    gameEngine.addEntity(tutorial);
    gameEngine.addEntity(highscore);
    gameEngine.addEntity(start);
}

function bonus (game, ctx) {
    // game.entities[10].x = 4000;
    // game.entities[10].x = 4015;
    // game.entities[10].x = 3950;
    game.entities.splice(10, 1);
    game.entities.splice(10, 1);
    game.entities.splice(10, 1);
    backup(game, ctx);
    for (var i = 4; i < 21; i++) {
        game.entities[i].removeFromWorld = true;
    }
    var portal = new Platform(game, ctx, ASSET_MANAGER.getAsset("./imgs/Platforms/portal.png"), 0, 0, 200, 367, 0.15, 1, true, false, 1.2, 1, 2000, 300, "end")
    game.addEntity(portal);
    var gold;
    for (var i = 0; i < 10; i++) {
        gold = new Pickup(game, ctx, ASSET_MANAGER.getAsset("./imgs/Pickups/goldCarrot.png"), 0, 0, 39, 62, .15, 5, true, true, 2, 1, 1000 + 100 * i, 475, "gold");
        game.addEntity(gold);
    }
}

function backup (game, ctx) {
    for(var i = 0; i < game.entities.length; i++) {
        copy[i] = game.entities[i];
    }
}

function restore (game, ctx) {
    reset(game, ctx);
    for (var i = 0; i < copy.length; i++) {
        game.entities[i] = copy[i];
        game.entities[i].removeFromWorld = false;
    }
}

function reset(game, ctx) {
    for (var i = 0; i < game.entities.length; i++) {
        game.entities[i].removeFromWorld = true;
    }
}