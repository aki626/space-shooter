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

document.addEventListener("keydown", e => {
    if(e.key === "ArrowLeft") player.x -= player.speed;
    if(e.key === "ArrowRight") player.x += player.speed;

    if(e.key === " ") {
        bullets.push({
            x: player.x + 18,
            y: player.y
        });
    }
});

function update(){

    bullets.forEach(b => {
        b.y -= 8;
    });

}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // プレイヤー
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
        ctx.fillRect(b.x,b.y,5,15);
    });

}

function loop(){
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
