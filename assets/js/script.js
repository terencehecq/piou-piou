// Initialiser le canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

// Importer les images
let vaisseau = new Image();
vaisseau.src = 'assets/img/vaisseau.png';
let bullet = new Image();
bullet.src = 'assets/img/bullet.png'
let cible = new Image();
cible.src = 'assets/img/ennemi.png';

// Importer les sons
let startSound = new Audio('assets/sound/press-start.wav');
let fire = new Audio('assets/sound/shoot.wav');
let hereWeGo = new Audio('assets/sound/here-we-go.wav');
let shot = new Audio('assets/sound/oof.wav');

// Taille du canevas
let X = 700;
let Y = 400;

// Position initiale du vaisseau
let VX = 700/2 -25;
let VY = 400-60;

// Position initiale de la cible
let CX = parseInt(Math.random()*630);
let CY = 5;

// Initialiser les scores
let score = 0;
let scoreToGet = 10;
let setScore = document.getElementById("score");

// Local Storage des scores
scoresStorage = localStorage;
let storedScores;

// Fonction qui met les scores dans le tableau
function setScoresInTable(){ 

    storedScores = JSON.parse(localStorage.getItem("scores")); // Récupère les scores stockés en local (déjà dans le bon ordre)
    
    if (storedScores != null){ // Si il y a au moins 1 score stocké ,
        
        // on met le/les score(s) dans le tableau à la position correspondante
        for (let rank = 0; rank<storedScores.length && rank < 5; rank++){ 
            let tableName = document.querySelector(`tbody>tr:nth-child(${rank+1})>td:nth-child(2)`)
            let tableScore = document.querySelector(`tbody>tr:nth-child(${rank+1})>td:nth-child(3)`)
            
            tableName.innerHTML = storedScores[rank].name;
            tableScore.innerHTML = storedScores[rank].scoreToList;
        }
    }
}

window.addEventListener("load",()=>{
        setScoresInTable(); // Au chargement de la page, on met les scores dans le tableau
})

// Fonction qui initialise une cible.
function setTarget(){
    ctx.drawImage(cible,CX,CY);
}


// Fonction qui fait tourner le jeu, elle contient tout ce qui doit se relancer à chaque nouvelle partie
function game(){
    document.getElementById("start-game").style.visibility = "hidden"; // cacher le bouton de lancement du jeu
    document.getElementById("time").style.visibility = "hidden"; // Cacher le temps final (utile àpd de la 2e partie)
    
    score = 0; // réinitialiser le score
    setScore.innerHTML = score; // afficher le score sur la page
    
    // Déclarer les variables utiles pour le chrono
    let chronoStart = Date.now() 
    let mins;
    let secs;
    let decis;
    let centis;
    let toShow = `00' 00" 000`;
    

    // ----- Chronomètre ----- //
    // Chaque 100eme de seconde, on recalcule le temps écoulé et on l'affiche dans la balise prévue en HTML
    let time = setInterval(()=>{
        let chrono = Date.now() - chronoStart; 

        mins = Math.floor(chrono/60000);
        secs = Math.floor((chrono/1000)%60);
        let chronoToString = chrono.toString();
        decis = chronoToString.charAt((chronoToString.length)-3);
        centis = chronoToString.charAt((chronoToString.length)-2);


        if(secs < 10){toShow = `0${mins}' O${secs}" ${decis}${centis}0`}
        else{toShow = `0${mins}' ${secs}" ${decis}${centis}0`}

        document.getElementById("chrono").innerHTML = toShow;
    },10)

    // Initialisation du vaisseau et de la cible
    ctx.drawImage(vaisseau, VX,VY);
    setTarget();
    

    // ----- Commandes du jeu ----- //

    // Actions à effectuer lorsqu'une touche est enfoncée ("keydown")
    window.addEventListener("keydown",function playing(e){

    
        let key = e.keyCode;
        
        // --- Flèche de gauche --- //
        if(key == 37){
            if(VX > 9){
                VX = VX-18;
                ctx.clearRect(0, VY, canvas.width, 60);
                setVaisseau = ctx.drawImage(vaisseau, VX,VY);
            }
        }
        // --- Flèche de droite --- //
        if(key == 39){
            if(VX < X-59){
                VX = VX+18;
                ctx.clearRect(0, VY, canvas.width, 60);
                setVaisseau = ctx.drawImage(vaisseau, VX,VY);
            }
        }

        // --- Barre d'espace --- //
        if(key == 32){
            e.preventDefault(); // empèche le scroll en appuyant sur "espace"

            // Initialisation de la position du projectile en fct de la position à ce moment du vaisseau
            let BY = VY-32;
            let BX = VX+20;
            fire.currentTime = 0; // réinitialiser le son joué 
            fire.play(); // jouer le son "fire"


            // ----- Fonction du déplacement du projectile ----- //
            let bulletShot = setInterval(()=>{ 
                if(BY > -32){ // Déplacement si il est toujours dans le canvas (-32 pour qu'il soit entièrement en dehors)
                    ctx.clearRect(BX, BY, 11, 32);
                    ctx.drawImage(bullet, BX,BY);
                    
                    BY = BY-10;
                } else{ // S'il est sorti, on arrête la fct qui le fait se déplacer
                    clearInterval(bulletShot);
                }

                // Actions à exécuter si la cible est touchée (si la pos du projectile coïncide avec elle)
                if(BX > CX-10 && BX <CX+70 && BY<CY+15){ 
                    score +=1; // Incrémenter le score
                    shot.currentTime = 0; // réinitialiser le son "shot"
                    shot.play(); // Jouer le son "shot"
                    setScore.innerHTML = score; // Afficher le nouveau score
                    clearInterval(bulletShot); // Arrêter le déplacement du projectile
                    ctx.clearRect(BX, BY, 11, 32); // Effacer le projectile
                    ctx.clearRect(0, 0, canvas.width, 30); // Effacer la cible
                    CX = parseInt(Math.random()*630); // Définir une nouvelle position X de la cible au hasard
                    setTarget(); // Afficher une nouvelle cible
                    
                    // Actions à exécuter si le score fixé (scoreToGet) est atteint
                    if (score == scoreToGet){ 
                        clearInterval(time); // Arrêter le chrono
                        ctx.clearRect(0, 0, canvas.width, 340); // Effacer le canvas sauf le vaisseau
                        document.getElementById("button").innerHTML = "Restart"; // Changer la valeur du bouton
                        // Afficher le bouton, le temps de fin et le formulaire pour les scores
                        document.getElementById("start-game").style.visibility = "visible";
                        document.getElementById("time").style.visibility = "visible";
                        document.getElementById("form").style.visibility = "visible";
                        document.getElementById("timeHere").innerHTML = toShow; 
                        document.getElementById("name").focus(); // autofocus sur le champs de formulaire
                        window.removeEventListener("keydown", playing); // Empêcher les commandes du vaisseau
                        startSound.play(); // Jouer le son "play"

                        return; // Arrêter la fonction en cours
                    }
                }
            },30); // Interval de déplacement du projectile
        }
    })



    // ----- Jeu en mobile ----- //
        // window.addEventListener("touchend", (e)=>{e.preventDefault()})
        window.addEventListener("dblclick", (e)=>{e.preventDefault()})
        
        // --- Flèche de gauche --- //
        document.getElementById("left").addEventListener("click", ()=>{
         
            if(VX > 9){
                VX = VX-18;
                ctx.clearRect(0, VY, canvas.width, 60);
                setVaisseau = ctx.drawImage(vaisseau, VX,VY);
            }
        });
        

        // --- Flèche de droite --- //
        document.getElementById("right").addEventListener("click", ()=>{
           
                if(VX < X-59){
                    VX = VX+18;
                    ctx.clearRect(0, VY, canvas.width, 60);
                    setVaisseau = ctx.drawImage(vaisseau, VX,VY);
                }
        });

        // --- Barre d'espace --- //
        document.getElementById("shoot").addEventListener("click", ()=>{
            // e.preventDefault(); // empèche le scroll en appuyant sur "espace"

            // Initialisation de la position du projectile en fct de la position à ce moment du vaisseau
            let BY = VY-32;
            let BX = VX+20;
            fire.currentTime = 0; // réinitialiser le son joué 
            fire.play(); // jouer le son "fire"


            // ----- Fonction du déplacement du projectile ----- //
            let bulletShot = setInterval(()=>{ 
                if(BY > -32){ // Déplacement si il est toujours dans le canvas (-32 pour qu'il soit entièrement en dehors)
                    ctx.clearRect(BX, BY, 11, 32);
                    ctx.drawImage(bullet, BX,BY);
                    
                    BY = BY-10;
                } else{ // S'il est sorti, on arrête la fct qui le fait se déplacer
                    clearInterval(bulletShot);
                }

                // Actions à exécuter si la cible est touchée (si la pos du projectile coïncide avec elle)
                if(BX > CX-10 && BX <CX+70 && BY<CY+15){ 
                    score +=1; // Incrémenter le score
                    shot.currentTime = 0; // réinitialiser le son "shot"
                    shot.play(); // Jouer le son "shot"
                    setScore.innerHTML = score; // Afficher le nouveau score
                    clearInterval(bulletShot); // Arrêter le déplacement du projectile
                    ctx.clearRect(BX, BY, 11, 32); // Effacer le projectile
                    ctx.clearRect(0, 0, canvas.width, 30); // Effacer la cible
                    CX = parseInt(Math.random()*630); // Définir une nouvelle position X de la cible au hasard
                    setTarget(); // Afficher une nouvelle cible
                    
                    // Actions à exécuter si le score fixé (scoreToGet) est atteint
                    if (score == scoreToGet){ 
                        clearInterval(time); // Arrêter le chrono
                        ctx.clearRect(0, 0, canvas.width, 340); // Effacer le canvas sauf le vaisseau
                        document.getElementById("button").innerHTML = "Restart"; // Changer la valeur du bouton
                        // Afficher le bouton, le temps de fin et le formulaire pour les scores
                        document.getElementById("start-game").style.visibility = "visible";
                        document.getElementById("time").style.visibility = "visible";
                        document.getElementById("form").style.visibility = "visible";
                        document.getElementById("timeHere").innerHTML = toShow; 
                        document.getElementById("name").focus(); // autofocus sur le champs de formulaire
                        window.removeEventListener("keydown", playing); // Empêcher les commandes du vaisseau
                        startSound.play(); // Jouer le son "play"

                        return; // Arrêter la fonction en cours
                    }
                }
            },30); // Interval de déplacement du projectile
        })






    

    // Fonction qui met les scores dans le Local Storage
    function setScoresInStorage(){
        
        
        storedScores = JSON.parse(localStorage.getItem("scores")) // Récupérer les scores stockés en local
        
        if(storedScores == undefined){ // S'il n'y a pas de scores stockés (retourne undefined)
        
            let newScore=[]; // Variable où stocker la première valeur

            // Créer l'objet et définir ses propriétés et valeurs
            newScore[0]={};
            newScore[0].name = document.getElementById("name").value;
            newScore[0].score = `${mins}${secs}${decis}${centis}`;
            newScore[0].scoreToList = toShow;

            localStorage.setItem("scores", JSON.stringify(newScore)); // On initialise le Local Storage avec le 1er élément

        }else{ // S'il y a déjà des scores stockés

            let i = storedScores.length // i vaut la longueur du tableau, donc on rajoute à la fin du tableau (puisque l'index commence à 0)
            
            storedScores[i]={};
            storedScores[i].name = document.getElementById("name").value;
            storedScores[i].score = `${mins}${secs}${decis}${centis}`;
            storedScores[i].scoreToList = toShow;
            
            
            // Trier les scores dans l'ordre croissant
            function compare( a, b ) {
                if ( a.score < b.score ){
                    return -1;
                }
                if ( a.score > b.score ){
                    return 1;
                }
                return 0;
            }
            storedScores.sort(compare);
            
            localStorage.setItem("scores", JSON.stringify(storedScores)); // On renvoie les nouveaux scores dans le Local Storage
        }

        document.getElementById("sendName").removeEventListener("click", setScoresInStorage); // Si on ne l'arrête pas, il y a 2 listeners à la 2eme partie, and so on...
        document.getElementById("name").value = ""; // on efface le nom une fois validé
        document.getElementById("form").style.visibility = "hidden"; // On cache le formulaire
          
    };

    // Fonction pour envoyer le nom en appuyant sur Enter
    function setOnEnter(e){ 
        if(e.keyCode == 13 && document.getElementById("name").value != ""){
            setScoresInStorage();
            setScoresInTable();
            window.removeEventListener("keypress", setOnEnter); // Empêche listener x2 à la 2e partie, ...
        }
    }

    // Si on click sur le bouton, on envoie aussi le nom
    document.getElementById("sendName").addEventListener("click", ()=>{
        if(document.getElementById("name").value != ""){
            setScoresInStorage();
            setScoresInTable();
        }
    });

    // Si on appuie sur Enter, on exécute la fonction
    window.addEventListener("keypress",setOnEnter)
    
    
  
    
}


// ----- Lancer le jeu ----- //
document.getElementById("button").addEventListener("click", ()=>{
    hereWeGo.play();
    game();
})