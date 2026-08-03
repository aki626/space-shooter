const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;


// ゲーム状態

let started = false;

let shipType = "";

let selected = false;


let wave = 1;

let enemyLeft = 5;

let score = 0;



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


        player.hp = 80;

        player.speed = 8;


        shipInfo.innerHTML =
        "🚤 駆逐艦 HP80 速度8";

    }



    if(type==="battleship"){


        player.hp = 200;

        player.speed = 3;


        shipInfo.innerHTML =
        "⚓ 戦艦 HP200 速度3";

    }



    if(type==="carrier"){


        player.hp = 120;

        player.speed = 5;


        shipInfo.innerHTML =
        "🛳️ 空母 HP120 艦載機あり";

    }


}





// START

function startGame(){


    if(!selected){

        alert("艦を選択してください");

        return;

    }


    title.style.display="none";


    canvas.style.display="block";


    controls.style.display="flex";


    status.style.display="block";



    if(shipType==="carrier"){

        fighter.style.display="block";

    }


    started=true;


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





// スマホ移動

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





// 攻撃

shoot.onclick=shoot;


function shoot(){


    bullets.push({

        x:player.x+18,

        y:player.y,

        size:5

    });


}





// 戦闘機

fighter.onclick=()=>{


    if(shipType==="carrier"){


        fighters.push({

            x:player.x+10,

            y:player.y-50

        });


    }


};
// 敵生成

function spawnEnemy(){


    let type = Math.floor(Math.random()*3);



    enemies.push({

        x:Math.random()*460,

        y:-50,

        size:40,

        hp:wave,


        type:type,


        dx:2,


        angle:0


    });


}




// 更新

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






    // ウェーブ敵出現

    if(

        enemies.length===0 &&

        enemyLeft>0

    ){


        spawnEnemy();


        enemyLeft--;


    }





    // 敵の動き

    enemies.forEach(e=>{


        e.angle+=0.05;




        // 🚤 駆逐艦

        if(e.type===0){


            e.x += Math.sin(e.angle)*3;


            e.y += 3;


        }





        // 🚢 巡洋艦

        if(e.type===1){


            e.x+=e.dx;


            e.y+=2;



            if(e.x<=0 || e.x>=460){


                e.dx*=-1;


            }


        }





        // ⚓ 戦艦

        if(e.type===2){


            if(e.x<player.x)

                e.x+=1;



            if(e.x>player.x)

                e.x-=1;



            e.y+=1.5;


        }






        // 画面下で跳ね返る

        if(e.y>600){

            e.y=600;

        }




        // 敵攻撃

        if(Math.random()<0.02){


            enemyBullets.push({

                x:e.x+20,

                y:e.y+40,

                size:6

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

                y:f.y,

                size:5

            });


        }


    });
// 弾と敵の当たり判定

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






// 敵弾とプレイヤー

enemyBullets.forEach((b,bi)=>{


    if(hit(b,player)){


        enemyBullets.splice(bi,1);


        player.hp-=10;


    }


});






// ウェーブ終了

if(

    enemies.length===0 &&

    enemyLeft===0

){


    wave++;


    enemyLeft=wave*5;


}






// ゲームオーバー

if(player.hp<=0){


    alert("⚓ 撃沈しました");


    location.reload();


}






}



// 当たり判定

function hit(a,b){


    return (

        a.x < b.x+b.size &&

        a.x+a.size > b.x &&

        a.y < b.y+b.size &&

        a.y+a.size > b.y

    );


}
// 描画

function draw(){


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    // 自分の船

    drawShip(
        player.x,
        player.y,
        "cyan",
        shipType
    );





    // 敵船

    enemies.forEach(e=>{


        drawShip(
            e.x,
            e.y,
            "red",
            e.type
        );


    });






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

    ctx.fillStyle="white";


    fighters.forEach(f=>{


        ctx.fillRect(
            f.x,
            f.y,
            20,
            10
        );


    });







    // UI

    hp.innerHTML =
    "HP "+player.hp;


    score.innerHTML =
    "SCORE "+score;


    wave.innerHTML =
    "WAVE "+wave;



}





// 船を描く

function drawShip(x,y,color,type){


    ctx.fillStyle=color;



    // 空母

    if(type==="carrier"){


        ctx.fillRect(
            x,
            y+15,
            50,
            25
        );


        ctx.fillStyle="gray";


        ctx.fillRect(
            x+10,
            y,
            20,
            15
        );


        return;

    }






    // 戦艦

    if(type==="battleship"){


        ctx.beginPath();


        ctx.moveTo(x+20,y);


        ctx.lineTo(x+45,y+40);


        ctx.lineTo(x,y+40);


        ctx.closePath();


        ctx.fill();



        ctx.fillStyle="black";


        ctx.fillRect(
            x+18,
            y+5,
            5,
            20
        );


        return;

    }






    // 駆逐艦

    ctx.beginPath();


    ctx.moveTo(
        x+20,
        y
    );


    ctx.lineTo(
        x+35,
        y+40
    );


    ctx.lineTo(
        x+5,
        y+40
    );


    ctx.closePath();


    ctx.fill();



}







// ゲームループ

function loop(){


    update();


    draw();


    requestAnimationFrame(loop);


}



loop();
