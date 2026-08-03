const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;


let gameStart = false;

let player = {
    x:230,
    y:580,
    size:40,
    speed:5,
    hp:100
};


let shipType = "";

let bullets = [];
let enemies = [];
let enemyBullets = [];

let fighters = [];
let bombs = [];

let score = 0;


// 艦選択

function selectShip(type){

    shipType = type;

    if(type === "destroyer"){
        player.hp = 70;
        player.speed = 8;
    }

    if(type === "battleship"){
        player.hp = 150;
        player.speed = 3;
    }

    if(type === "carrier"){
        player.hp = 100;
        player.speed = 5;
    }


    document.getElementById("select").style.display="none";

    gameStart=true;

}



// キー操作

let keys={};


document.addEventListener("keydown",e=>{

    keys[e.key]=true;

    if(e.key===" ")
        shoot();

});


document.addEventListener("keyup",e=>{

    keys[e.key]=false;

});



// スマホ操作

left.ontouchstart=()=>{
    keys["ArrowLeft"]=true;
};

left.ontouchend=()=>{
    keys["ArrowLeft"]=false;
};


right.ontouchstart=()=>{
    keys["ArrowRight"]=true;
};

right.ontouchend=()=>{
    keys["ArrowRight"]=false;
};


shoot.onclick=()=>{
    shoot();
};


fighter.onclick=()=>{
    launchFighter();
};



// 発射

function shoot(){

    bullets.push({

        x:player.x+18,
        y:player.y

    });

}



// 戦闘機

function launchFighter(){

    if(shipType==="carrier"){

        fighters.push({

            x:player.x,
            y:player.y-40

        });

    }

}



// 更新

function update(){


if(!gameStart)return;



// 移動

if(keys["ArrowLeft"])
player.x-=player.speed;


if(keys["ArrowRight"])
player.x+=player.speed;


if(player.x<0)
player.x=0;


if(player.x>460)
player.x=460;



// 自分の弾

bullets.forEach(b=>{

    b.y-=8;

});



// 敵生成

if(Math.random()<0.02){

    enemies.push({

        x:Math.random()*460,
        y:-40,
        size:40,
        hp:3

    });

}



// 敵移動

enemies.forEach(e=>{

    e.y+=2;


    // 敵射撃

    if(Math.random()<0.01){

        enemyBullets.push({

            x:e.x+20,
            y:e.y+40

        });

    }

});



// 敵弾

enemyBullets.forEach(b=>{

    b.y+=5;


});



// 戦闘機

fighters.forEach(f=>{

    f.y-=5;


    if(Math.random()<0.05){

        bombs.push({

            x:f.x,
            y:f.y

        });

    }

});



// 爆弾

bombs.forEach(b=>{

    b.y+=6;

});




// 弾と敵

bullets.forEach((b,bi)=>{

    enemies.forEach((e,ei)=>{


        if(hit(b,e)){

            e.hp--;

            bullets.splice(bi,1);


            if(e.hp<=0){

                enemies.splice(ei,1);

                score+=10;

            }

        }


    });

});



// 爆弾と敵

bombs.forEach((b,bi)=>{

    enemies.forEach((e,ei)=>{


        if(hit(b,e)){

            enemies.splice(ei,1);

            bombs.splice(bi,1);

            score+=30;

        }


    });

});



// 敵弾と自分

enemyBullets.forEach((b,i)=>{


    if(hit(b,player)){


        enemyBullets.splice(i,1);

        player.hp-=10;


    }


});



// ゲームオーバー

if(player.hp<=0){

    alert("撃沈しました");

    location.reload();

}


}



// 当たり判定

function hit(a,b){

return (

a.x < b.x+b.size &&
a.x+10 > b.x &&
a.y < b.y+b.size &&
a.y+10 > b.y

);

}




// 描画

function draw(){


ctx.clearRect(0,0,500,700);


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



// 敵

ctx.fillStyle="red";

enemies.forEach(e=>{

ctx.fillRect(e.x,e.y,e.size,e.size);


});



// 敵弾

ctx.fillStyle="orange";

enemyBullets.forEach(b=>{

ctx.fillRect(b.x,b.y,5,15);

});



// 戦闘機

ctx.fillStyle="white";

fighters.forEach(f=>{

ctx.fillRect(f.x,f.y,20,20);

});



// 爆弾

ctx.fillStyle="black";

bombs.forEach(b=>{

ctx.fillRect(b.x,b.y,8,15);

});



// 情報

ctx.fillStyle="white";

ctx.font="20px Arial";

ctx.fillText(
"HP:"+player.hp,
10,
30
);

ctx.fillText(
"Score:"+score,
10,
55
);


}



function loop(){

update();

draw();

requestAnimationFrame(loop);

}


loop();
