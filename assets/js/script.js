let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let vaisseau = new Image();
vaisseau.src = 'assets/img/vaisseau.png';
let bullet = new Image();
bullet.src = 'assets/img/bullet.png'
let cible = new Image();
cible.src = 'assets/img/cible.png';

let X = 700;
let Y = 400;

let VX = 700/2 -25;
let VY = 400-60;

let CX = parseInt(Math.random()*630);
let CY = 5;

let score = 0;

function setTarget(){
    ctx.drawImage(cible,CX,CY);
}


window.addEventListener("load",()=>{
ctx.drawImage(vaisseau, VX,VY);
 setTarget();

})


window.addEventListener("keydown",(e)=>{
    
    let key = e.keyCode;
    
    if(key == 37){
        if(VX > 9){
            VX = VX-10;
            ctx.clearRect(0, VY, canvas.width, 60);
            setVaisseau = ctx.drawImage(vaisseau, VX,VY)
        }
    }
    if(key == 39){
        if(VX < X-59){
            VX = VX+10;
            ctx.clearRect(0, VY, canvas.width, 60);
            setVaisseau = ctx.drawImage(vaisseau, VX,VY)
        }
    }
    if(key == 32){
        
        let BY = VY-32;
        let BX = VX+20;

        let bulletShot = setInterval(()=>{
            if(BY > -32){ 
                ctx.clearRect(BX, BY, 10, 32);
                ctx.drawImage(bullet, BX,BY);
                
                BY = BY-10;
            }

            if(BX > CX-10 && BX <CX+70 && BY<CY+15){
                score +=1;
                clearInterval(bulletShot);
                ctx.clearRect(BX, BY, 10, 32);
                ctx.clearRect(0, 0, canvas.width, 30);
                CX = parseInt(Math.random()*630);
                setTarget();
                console.log(score);
            }
        },50);
    }

    

})