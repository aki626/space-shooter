const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;


let player = {
    x: 230,
    y: 600,
    size: 40,
    speed: 5
};


let bullets = [];
let enemies = [];
let score = 0;

let keys = {};


// PC操作
document.addEventListener("keydown", e => {

    keys[e.key] = true;

    if(e.key === " "){
        shoot();
    }

});


document.addEventListener("keyup", e => {
    keys[e.key] = false;
});


// スマホ操作

left.ontouchstart = () => {
    keys["ArrowLeft"] = true;
};

left.ontouchend = () => {
    keys["ArrowLeft"] = false;
};


right.ontouchstart = () => {
    keys["ArrowRight"] = true;
};

right.ontouchend = () => {
    keys["ArrowRight"] = false;
};


shoot.onclick = () => {
    shoot();
};


function shoot(){

    bullets.push({
        x: player.x + 18,
        y: player.y
    });

}



function update(){


    // 移動

    if(keys["ArrowLeft"])
        player.x -= player.speed;


    if(keys["ArrowRight"])
        player.x += player.speed;


    if(player.x < 0)
        player.x = 0;


    if(player.x > canvas.width-player.size)
        player.x = canvas.width-player.size;



    // 弾

    bullets.forEach(b=>{
        b.y -= 8;
    });



    // 敵生成

    if(Math.random() < 0.02){

        enemies.push({

            x: Math.random()*460,
            y:-40,
            size:40

        });

    }



    // 敵移動

    enemies.forEach(e=>{

        e.y += 2;

    });



    // 当たり判定

    bullets.forEach((b,bi)=>{

        enemies.forEach((e,ei)=>{


            if(
                b.x < e.x+e.size &&
                b.x+5 > e.x &&
                b.y < e.y+e.size &&
                b.y+15 > e.y
            ){

                bullets.splice(bi,1);

                enemies.splice(ei,1);

                score += 10;

            }


        });


    });



}



function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // 自機

    ctx.fillStyle="cyan";

    ctx.fillRect(
        player.x,
        player.y,
        player.size,
        player.size
    );



    // 弾

    ctx.fillStyle="yellow";

    bullets.forEach(b=>{

        ctx.fillRect(
            b.x,
            b.y,
            5,
            15
        );

    });



    // 敵

    ctx.fillStyle="red";

    enemies.forEach(e=>{

        ctx.fillRect(
            e.x,
            e.y,
            e.size,
            e.size
        );

    });



    // スコア

    ctx.fillStyle="white";

    ctx.font="24px Arial";

    ctx.fillText(
        "Score: "+score,
        10,
        30
    );


}



function loop(){

    update();

    draw();

    requestAnimationFrame(loop);

}


loop();
