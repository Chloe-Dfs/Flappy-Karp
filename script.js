//initialisation du tableau (board)
let board;
let boardHeight = 640;
let boardWidth = 360;
let context;

//tableau game over
let boardGO;
let boardGOHeight = 640;
let boardGOWidth = 360;
let contextGO;




//initialisation du magicarpe (karp)
let karpWidth = 62;
let karpHeight = 62;
let karpX = boardWidth/8;
let karpY = boardHeight/2;
let karpImg;

let karp = {
    x : karpX,
    y : karpY,
    width : karpWidth,
    height : karpHeight
}

//initialisation des tubes (pipes)
let pipeArray = [];
let pipeWidth = 80;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Initialisation de la physique et gravité
let velocityX = -2; //rapidité du déplacement des tubes vers la gauche
let velocityY = 0; //vitesse de saut du magicarpe
let gravity = 0.3;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    boardGO = document.getElementById("boardGO");
    boardGO.height = boardGOHeight;
    boardGO.width = boardGOWidth;
    contextGO = boardGO.getContext("2d");


    //chargement des images
    //magicarpe
    karpImg = new Image();
    karpImg.src = "img/karpv3.png";
    karpImg.onload = function () {
    context.drawImage(karpImg, karp.x, karp.y, karp.width, karp.height);
    };

    //tube haut
    topPipeImg = new Image();
    topPipeImg.src = "img/toppipev3.png";

    //tube bas
    bottomPipeImg = new Image();
    bottomPipeImg.src = "img/bottompipev3.png";

    //page game over 
    //titre
    gameOverImg = new Image();
    gameOverImg.src = "img/gameovertitrev2.png";
    
    gameOverImg.onload = function () {
        let x = 40;
        let y = 130;
        contextGO.drawImage(gameOverImg, x, y, 280, 60)
    }

    //magicarpe mort
    karpdead = new Image();
    karpdead.src = "img/karpdead.png";

    karpdead.onload = function () {
        let x = 110;
        let y = 250;
        contextGO.drawImage(karpdead, x, y, 150, 150)
    }


    //animation
    //requestAnimationFrame(update);
    setInterval(placePipes, 2000); //toutes les 1.5sec
    document.addEventListener("keydown", moveKarp);

    

    document.addEventListener("keydown", startGameOnSpace);

    function startGameOnSpace(event) {
        if (event.code === "Space") {
            document.removeEventListener("keydown", startGameOnSpace); // Retire l'écouteur après le démarrage
            document.addEventListener("keydown", moveKarp); // Ajoute l'écouteur pour le mouvement du personnage
            requestAnimationFrame(update); // Démarre l'animation
        }
    }
    

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //magicarpe
    velocityY += gravity;
    karp.y += velocityY;
    karp.y = Math.max(karp.y + velocityY, 0); // application de la gravité
    context.drawImage(karpImg, karp.x, karp.y, karp.width, karp.height);

    if (karp.y > board.height) {
        gameOver = true;
    }

    //tubes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && karp.x > pipe.x + pipe.width) {
            score += 0.5; // 0.5 point pour chaque tube passé
            pipe.passed = true;
        }

        if (detectCollision(karp, pipe)) {
            gameOver = true;
        }
    }

    //clear les tubes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //retire le premier élément du tableau
    }

    //score
    context.fillStyle = "white";
    context.font = "45px 'Press Start 2P', cursive";
    context.fillText("Score : " + score, 5, 45);

    contextGO.fillStyle = "white";
    contextGO.font = "bold 18px 'Press Start 2P', cursive";
    

    if (gameOver) {
        contextGO.fillText("Appuie sur C pour recommencer", 45, 500);
    }
    }

};


function placePipes() {
    if (gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveKarp(e) {
    if (e.code == "Space" || e.code == "ArrowTop" || e.code == "KeyX") {
        //saut du magicarpe
        velocityY = -4;
        

        
    }

    //reset du jeu
    if (gameOver) {
        boardGO.style.zIndex = "1";
        board.style.zIndex = "0";
        

        if (e.code == "KeyC") {
            location.reload();  
        }

        
        
    }

    //pause
    if (e.code == "Enter") {
        if(window.confirm("Voulez-vous recommencer la partie ? ")){
            alert("Début d'une nouvelle partie ! ");
            location.reload();
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;
}


/* restart


                karp.y = karpY;
                pipeArray = [];
                score = 0;
                board.style.zIndex = "1";
                boardGO.style.zIndex = "0";
                gameOver = false;
                alert("ca marche");

                */