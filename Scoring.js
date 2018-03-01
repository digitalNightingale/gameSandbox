/*********************
* Scoring Object *
*********************/
function Scoring(game, ctx) {
    this.x = 0;
    this.y = 0;
    this.score = 0;
    this.fps = 60;
    this.game = game;
    this.ctx = ctx;
}
Scoring.prototype.draw = function(){
    if (this.game.running) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Comic Sans MS';
        this.ctx.fillText("Score " + Math.floor(this.score), 10, 30);
        // console.log(this.score);
    }
};
Scoring.prototype.update = function(){
    if (this.game.running) this.score += (1/this.fps);
};