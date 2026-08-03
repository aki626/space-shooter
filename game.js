const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 700;


// 状態

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

    hp:100,

    speed:5,

    size:40

};



// 配列

let bullets=[];

let enemies=[];

let enemyBullets=[];

let fighters=[];



let keys={};




// 艦選択

function selectShip(type){


    shipType=type;

    selected=true;



    let info="";



    if(type==="destroyer"){


        player.hp=80;

        player.speed=8;


        info="🚢 駆逐艦 HP80 速度8";

    }



    if(type==="battleship"){


        player.hp=200;

        player.speed=3;


        info="⚓ 戦艦 HP200 速度3";

    }



    if(type==="carrier"){


        player.hp=120;

        player.speed=5;


        info="🛳️ 空母 HP120 艦載機あり";


    }



    document.getElementById("shipInfo").innerHTML=info;



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


        fighter.style.display="inline-block";


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



// 攻撃ボタン

shoot.onclick=shoot;



function shoot(){


    bullets.push({


        x:player.x+18,

        y:player.y,

        size:5


    });


}



// 戦闘機ボタン

fighter.onclick=()=>{


    if(shipType==="carrier"){


        fighters.push({


            x:player.x+10,

            y:player.y-50


        });


    }


};
// 更新処理

function update(){


    if(!started) return;



    // 移動

    if(keys["ArrowLeft"])
        player.x -= player.speed;


    if(keys["ArrowRight"])
        player.x += player.speed;



    if(player.x < 0)
        player.x = 0;


    if(player.x > 460)
        player.x = 460;





    // 弾

    bullets.forEach(b=>{

        b.y -= 8;

    });





    // 敵ウェーブ

    if(
        enemies.length===0 &&
        enemyLeft>0
    ){


        enemies.push({

            x:Math.random()*460,

            y:-50,

            size:40,

            hp:wave


        });


        enemyLeft--;


    }





    // 敵

    enemies.forEach(e=>{


        e.y+=2;



        // 敵攻撃

        if(Math.random()<0.02){


            enemyBullets.push({


                x:e.x+18,

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







    // 敵弾とプレイヤー

    enemyBullets.forEach((b,i)=>{


        if(hit(b,player)){


            enemyBullets.splice(i,1);


            player.hp-=10;


        }


    });







    // ウェーブクリア

    if(
        enemies.length===0 &&
        enemyLeft===0
    ){


        wave++;


        enemyLeft=wave*5;


    }





    if(player.hp<=0){


        alert("撃沈しました");


        location.reload();


    }




}





// 当たり判定

function hit(a,b){


    return(

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



    // プレイヤー船

    drawShip(
        player.x,
        player.y,
        "cyan"
    );




    // 敵船

    enemies.forEach(e=>{


        drawShip(
            e.x,
            e.y,
            "red"
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







    // 表示

    document.getElementById("hp").innerHTML =
    "HP "+player.hp;


    document.getElementById("score").innerHTML =
    "SCORE "+score;


    document.getElementById("wave").innerHTML =
    "WAVE "+wave;



}





// 船を描く

function drawShip(x,y,color){


    ctx.fillStyle=color;



    // 船体

    ctx.beginPath();


    ctx.moveTo(
        x+20,
        y
    );


    ctx.lineTo(
        x+42,
        y+35
    );


    ctx.lineTo(
        x+35,
        y+45
    );


    ctx.lineTo(
        x+5,
        y+45
    );


    ctx.lineTo(
        x,
        y+35
    );


    ctx.closePath();


    ctx.fill();





    // 艦橋

    ctx.fillStyle="gray";


    ctx.fillRect(

        x+15,
        y+15,
        10,
        15

    );





    // 砲台

    ctx.fillStyle="black";


    ctx.fillRect(

        x+18,
        y+5,
        4,
        15

    );



}







// ゲームループ

function loop(){


    update();


    draw();


    requestAnimationFrame(loop);


}


loop();
