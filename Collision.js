//if the boxes collide
function collide(a,b){
    var rabbit;
    var mushroom;
    var dxA = a.x + a.width;
    var dyA = a.y + a.height;
    var dxB = b.x + b.width;
    var dyB = b.y + b.height;

    if(a.x < dxB && a.y < dyB &&
    dxA > b.x && dyA > b.y){ return true;}
    else { return false;}


}
