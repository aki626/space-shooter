const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;


// ゲーム状態
let gameStart = false;
let shipType = "";

let wave = 1;
let enemiesLeft = 5;

let score = 0;


// プレイヤー

let player = {

    x:230,
    y:580,

    hp:100,

    speed:5,

    size:40

};


// 配列

let bullets = [];
let enemies = [];
let enemyBullets = [];

let fighters = [];



// キー

let keys = {};



// 艦選択

function selectShip(type){

    shipType = type;


    if(type=="destroyer"){

        player.hp=80;
        player.speed=8;

    }


    if(type=="battleship"){

        player.hp=200;
        player.speed=3;

    }


    if(type=="carrier"){

        player.hp=120;
        player.speed=5;

        fighter.style.display="block";

    }


    document.getElementById("select").style.display="none";


    gameStart=true;

}



// キーボード

document.addEventListener("keydown",e=>{


    keys[e.key]=true;


    if(e.key==" ")
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



shoot.onclick=shoot;



fighter.onclick=()=>{


    if(shipType=="carrier"){


        fighters.push({

            x:player.x+10,

            y:player.y-50

        });


    }


};



// 主砲

function shoot(){


    bullets.push({

        x:player.x+18,

        y:player.y

    });


}



// 更新

function update(){


if(!gameStart)
return;



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



// 敵ウェーブ生成

if(enemies.length==0 && enemiesLeft>0){


    enemies.push({

        x:Math.random()*460,

        y:-40,

        size:40,

        hp:wave

    });


    enemiesLeft--;

}



// 敵

enemies.forEach(e=>{


    e.y+=2;



    if(Math.random()<0.02){


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


    f.y-=6;



    if(Math.random()<0.05){


        bullets.push({

            x:f.x,

            y:f.y

        });


    }


});
