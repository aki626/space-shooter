const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");

canvas.width=500;
canvas.height=700;


let gameStart=false;

let shipType="";


let player={

x:230,
y:600,
size:40,
speed:5,
hp:100

};


let bullets=[];
let enemies=[];
let enemyBullets=[];

let score=0;


let keys={};



function selectShip(type){

shipType=type;


if(type=="destroyer"){

player.hp=70;
player.speed=8;

fighter.style.display="none";

}


if(type=="battleship"){

player.hp=150;
player.speed=3;

fighter.style.display="none";

}


if(type=="carrier"){

player.hp=100;
player.speed=5;

fighter.style.display="block";

}


document.getElementById("select").style.display="none";


gameStart=true;

}





document.addEventListener("keydown",e=>{

keys[e.key]=true;


if(e.key==" ")
shoot();


});


document.addEventListener("keyup",e=>{

keys[e.key]=false;

});





left.ontouchstart=()=>keys["ArrowLeft"]=true;
left.ontouchend=()=>keys["ArrowLeft"]=false;


right.ontouchstart=()=>keys["ArrowRight"]=true;
right.ontouchend=()=>keys["ArrowRight"]=false;


shoot.onclick=shoot;


function shoot(){

bullets.push({

x:player.x+18,
y:player.y

});

}






function update(){


if(!gameStart)return;



if(keys["ArrowLeft"])
player.x-=player.speed;


if(keys["ArrowRight"])
player.x+=player.speed;


if(player.x<0)
player.x=0;


if(player.x>460)
player.x=460;



bullets.forEach(b=>{

b.y-=8;

});





// 敵生成

if(Math.random()<0.05){

enemies.push({

x:Math.random()*460,

y:-40,

size:40,

hp:3

});

}




enemies.forEach(e=>{


e.y+=2;


if(Math.random()<0.01){

enemyBullets.push({

x:e.x+20,
y:e.y+40

});

}


});





enemyBullets.forEach(b=>{

b.y+=5;

});





// 自分の弾と敵

bullets.forEach((b,bi)=>{


enemies.forEach((e,ei)=>{


if(hit(b,e)){


bullets.splice(bi,1);

e.hp--;


if(e.hp<=0){

enemies.splice(ei,1);

score+=10;

}


}


});


});




// 敵弾

enemyBullets.forEach((b,i)=>{


if(hit(b,player)){


enemyBullets.splice(i,1);

player.hp-=10;


}


});



if(player.hp<=0){

alert("撃沈");

location.reload();

}



}




function hit(a,b){

return(

a.x<b.x+b.size&&
a.x+10>b.x&&
a.y<b.y+b.size&&
a.y+10>b.y

);

}





function draw(){


ctx.clearRect(0,0,500,700);



ctx.fillStyle="cyan";

ctx.fillRect(

player.x,
player.y,
player.size,
player.size

);




ctx.fillStyle="yellow";

bullets.forEach(b=>{

ctx.fillRect(b.x,b.y,5,15);

});



ctx.fillStyle="red";

enemies.forEach(e=>{

ctx.fillRect(e.x,e.y,e.size,e.size);

});



ctx.fillStyle="orange";

enemyBullets.forEach(b=>{

ctx.fillRect(b.x,b.y,5,15);

});



ctx.fillStyle="white";

ctx.font="20px Arial";

ctx.fillText("HP:"+player.hp,10,30);

ctx.fillText("Score:"+score,10,55);



}



function loop(){

update();

draw();

requestAnimationFrame(loop);

}


loop();
