const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;


// 状態

let started = false;

let selected = false;

let shipType = "";

let wave = 1;

let enemyLeft = 0;

let scoreValue = 0;



// プレイヤー

let player = {

    x:230,

    y:580,

    size:40,

    hp:100,

    speed:5

};



// 配列

let bullets = [];

let enemies = [];

let enemyBullets = [];

let fighters = [];



let keys = {};




// 艦選択

function selectShip(type){


    shipType = type;

    selected = true;



    if(type==="destroyer"){

        player.hp=80;

        player.speed=8;


        shipInfo.innerHTML =
        "🚤 駆逐艦 HP80 速度8";

    }




    if(type==="battleship"){

        player.hp=200;

        player.speed=3;


        shipInfo.innerHTML =
        "⚓ 戦艦 HP200 速度3";

    }





    if(type==="carrier"){

        player.hp=120;

        player.speed=5;


        shipInfo.innerHTML =
        "🛳️ 空母 HP120 戦闘機あり";

    }

}





// START

function startGame(){


    if(!selected){

        alert("艦を選択してください");

        return;

    }



    document.getElementById("title").style.display="none";


    canvas.style.display="block";


    document.getElementById("controls").style.display="flex";


    document.getElementById("status").style.display="block";



    if(shipType==="carrier"){

        document.getElementById("fighter").style.display="block";

    }



    startWave();


    started=true;


}






// ウェーブ開始

function startWave(){


    enemyLeft = wave * 5;


}






// キーボード

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






// 発射

document.getElementById("shoot").onclick=shoot;


function shoot(){


    bullets.push({

        x:player.x+18,

        y:player.y,

        size:5

    });


}






// 空母戦闘機

document.getElementById("fighter").onclick=()=>{


    if(shipType==="carrier"){


        fighters.push({

            x:player.x+10,

            y:player.y-50

        });


    }


};
// 敵を作る

function spawnEnemy(){


    let type = Math.floor(Math.random()*3);



    enemies.push({

        x:Math.random()*450,

        y:-60,

        size:40,


        hp:wave,


        type:type,


        speed:1.5,


        angle:Math.random()*6.28,


        bounce:false

    });


}







// 更新処理

function update(){


    if(!started)

        return;





    // プレイヤー移動

    if(keys["ArrowLeft"])

        player.x-=player.speed;



    if(keys["ArrowRight"])

        player.x+=player.speed;



    if(player.x<0)

        player.x=0;



    if(player.x>460)

        player.x=460;







    // 弾移動

    bullets.forEach(b=>{


        b.y-=8;


    });








    // 敵を複数出す

    while(

        enemyLeft>0 &&

        enemies.length<5

    ){


        spawnEnemy();


        enemyLeft--;


    }








    // 敵移動

    enemies.forEach(e=>{



        // プレイヤー方向

        let dx = player.x - e.x;

        let dy = player.y - e.y;



        let distance = Math.sqrt(

            dx*dx + dy*dy

        );






        if(distance>0){


            e.x += (dx/distance)*e.speed;


            e.y += (dy/distance)*e.speed;


        }






        // カーブ

        e.x += Math.sin(Date.now()/300 + e.angle)*1.5;








        // 下まで来たら跳ね返る

        if(e.y>600){


            e.y=600;


            e.speed=-Math.abs(e.speed);


        }




        // 上に戻ったら再び接近

        if(e.y<50){


            e.speed=Math.abs(e.speed);


        }








        // 敵弾

        if(Math.random()<0.015){


            enemyBullets.push({

                x:e.x+18,

                y:e.y+40,

                size:6

            });


        }



    });








    // 敵弾移動

    enemyBullets.forEach(b=>{


        b.y+=5;


    });








    // 戦闘機

    fighters.forEach(f=>{


        f.y-=6;



        if(Math.random()<0.05){


            bullets.push({

                x:f.x,

                y:f.y,

                size:5

            });


        }


    });

// 当たり判定

function hit(a,b){

    return (

        a.x < b.x + b.size &&

        a.x + a.size > b.x &&

        a.y < b.y + b.size &&

        a.y + a.size > b.y

    );

}







// 弾 → 敵

for(let bi=bullets.length-1; bi>=0; bi--){


    let b = bullets[bi];



    for(let ei=enemies.length-1; ei>=0; ei--){


        let e = enemies[ei];



        if(hit(b,e)){



            e.hp--;



            bullets.splice(bi,1);





            if(e.hp<=0){



                enemies.splice(ei,1);



                scoreValue+=10;


            }


            break;


        }


    }


}







// 敵弾 → プレイヤー

for(let bi=enemyBullets.length-1; bi>=0; bi--){



    let b=enemyBullets[bi];



    if(hit(b,player)){



        enemyBullets.splice(bi,1);



        player.hp-=10;


    }


}








// 画面外の弾削除

for(let i=bullets.length-1;i>=0;i--){


    if(bullets[i].y<0){


        bullets.splice(i,1);


    }


}







for(let i=enemyBullets.length-1;i>=0;i--){


    if(enemyBullets[i].y>700){


        enemyBullets.splice(i,1);


    }


}








// ウェーブ終了

if(

    enemies.length===0 &&

    enemyLeft===0

){


    wave++;


    startWave();


}







// 撃沈

if(player.hp<=0){


    alert("⚓ 撃沈しました");


    location.reload();


}
    // 描画

function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // プレイヤー

    drawShip(
        player.x,
        player.y,
        "cyan",
        shipType,
        false
    );






    // 敵

    enemies.forEach(e=>{


        drawShip(

            e.x,

            e.y,

            "red",

            "enemy",

            true

        );


    });







    // 自分の弾

    ctx.fillStyle="yellow";


    bullets.forEach(b=>{


        ctx.fillRect(

            b.x,

            b.y,

            5,

            15

        );


    });








    // 敵弾

    ctx.fillStyle="orange";


    enemyBullets.forEach(b=>{


        ctx.fillRect(

            b.x,

            b.y,

            6,

            15

        );


    });







    // 戦闘機

    fighters.forEach(f=>{


        ctx.fillStyle="white";


        ctx.beginPath();


        ctx.moveTo(
            f.x,
            f.y
        );


        ctx.lineTo(
            f.x+25,
            f.y+10
        );


        ctx.lineTo(
            f.x,
            f.y+20
        );


        ctx.fill();


    });








    // UI

    document.getElementById("hp").innerHTML =
    "HP "+player.hp;


    document.getElementById("score").innerHTML =
    "SCORE "+scoreValue;


    document.getElementById("wave").innerHTML =
    "WAVE "+wave;



}








// 船を描く

function drawShip(x,y,color,type,enemy){


    ctx.save();



    ctx.translate(

        x+20,

        y+20

    );



    // 敵は下向き

    if(enemy){

        ctx.rotate(Math.PI);

    }



    ctx.translate(

        -20,

        -20

    );




    ctx.fillStyle=color;







    // 空母

    if(type==="carrier"){


        ctx.fillRect(

            0,

            15,

            55,

            25

        );



        ctx.fillStyle="gray";


        ctx.fillRect(

            15,

            0,

            20,

            15

        );


    }







    // 通常艦

    else{


        ctx.beginPath();


        ctx.moveTo(

            20,

            0

        );


        ctx.lineTo(

            45,

            45

        );


        ctx.lineTo(

            0,

            45

        );


        ctx.closePath();


        ctx.fill();





        // 砲台

        ctx.fillStyle="black";


        ctx.fillRect(

            18,

            8,

            5,

            18

        );


    }



    ctx.restore();


}









// ゲームループ

function loop(){


    update();


    draw();


    requestAnimationFrame(loop);


}



loop();
