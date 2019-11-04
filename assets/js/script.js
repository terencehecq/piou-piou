
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let vaisseau = new Image();
vaisseau.src = 'assets/img/vaisseau.png';
let bullet = new Image();
bullet.src = 'assets/img/bullet.png'
let cible = new Image();
cible.src = 'assets/img/ennemi.png';

let X = 700;
let Y = 400;

let VX = 700/2 -25;
let VY = 400-60;

let CX = parseInt(Math.random()*630);
let CY = 5;

let score = 0;
let scoreToGet = 10;
let setScore = document.getElementById("score");

function setTarget(){
    ctx.drawImage(cible,CX,CY);
}


function game(){
    document.getElementById("start-game").style.visibility = "hidden";
    
    score = 0;
    setScore.innerHTML = score;
    
    let chronoStart = Date.now()
    let toShow = `00' 00" 000`;
    
    let time = setInterval(()=>{
        let chrono = Date.now() - chronoStart;

        let mins = Math.floor(chrono/60000)
        let secs = Math.floor((chrono/1000)%60);
        let chronoToString = chrono.toString();
        let decis = chronoToString.charAt((chronoToString.length)-3)
        let centis = chronoToString.charAt((chronoToString.length)-2);


        if(secs < 10){toShow = `0${mins}' O${secs}" ${decis}${centis}0`}
        else{toShow = `0${mins}' ${secs}" ${decis}${centis}0`}

        document.getElementById("chrono").innerHTML = toShow;
    },10)

    ctx.drawImage(vaisseau, VX,VY);
    setTarget();
    
    window.addEventListener("keydown",function playing(e){

    
        let key = e.keyCode;
        
        if(key == 37){
            if(VX > 9){
                VX = VX-18;
                ctx.clearRect(0, VY, canvas.width, 60);
                setVaisseau = ctx.drawImage(vaisseau, VX,VY);
            }
        }
        if(key == 39){
            if(VX < X-59){
                VX = VX+18;
                ctx.clearRect(0, VY, canvas.width, 60);
                setVaisseau = ctx.drawImage(vaisseau, VX,VY);
            }
        }
        if(key == 32){
            
            let BY = VY-32;
            let BX = VX+20;

            let bulletShot = setInterval(()=>{
                if(BY > -32){ 
                    ctx.clearRect(BX, BY, 11, 32);
                    ctx.drawImage(bullet, BX,BY);
                    
                    BY = BY-10;
                } else{
                    clearInterval(bulletShot);
                }

                if(BX > CX-10 && BX <CX+70 && BY<CY+15){
                    score +=1;
                    setScore.innerHTML = score;
                    clearInterval(bulletShot);
                    ctx.clearRect(BX, BY, 11, 32);
                    ctx.clearRect(0, 0, canvas.width, 30);
                    CX = parseInt(Math.random()*630);
                    setTarget();
                    
                    if (score == scoreToGet){
                        ctx.clearRect(0, 0, canvas.width, 340);
                        document.getElementById("button").innerHTML = "Restart";
                        document.getElementById("start-game").style.visibility = "visible";
                        document.getElementById("time").style.display = "inline";
                        document.getElementById("timeHere").innerHTML = toShow;
                        window.removeEventListener("keydown", playing);
                        clearInterval(time)
                        return;
                    }
                }
            },30);
        }
    })
}


function chrono(){
    
}

// chrono();

document.getElementById("start-game").addEventListener("click", ()=>{
    game()
})