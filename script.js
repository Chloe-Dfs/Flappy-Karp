//initialisation du tableau (board)
let board;
let boardHeight = 640;
let boardWidth = 360;
let context;

//initialisation du magicarpe (karp)
let karpWidth = 48;
let karpHeight = 48;
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
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Initialisation de la physique et gravité
let velocityX = -2; //rapidité du déplacement des tubes vers la gauche
let velocityY = 0; //vitesse de saut du magicarpe
let gravity = 0.2;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //chargement des images
    //magicarpe
    karpImg = new Image();
    karpImg.src = "img/karpp.png";
    karpImg.onload = function () {
        context.drawImage(karpImg, karp.x, karp.y, karp.width, karp.height);
    };

    //tube haut
    topPipeImg = new Image();
    topPipeImg.src = "img/toppipe.png";

    //tube bas
    bottomPipeImg = new Image();
    bottomPipeImg.src = "img/bottompipe.png";

    //animation
    requestAnimationFrame(update);
    setInterval(placePipes, 2000); //toutes les 1.5sec
    document.addEventListener("keydown", moveKarp);


};

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
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}


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
        

        //reset du jeu
        if (gameOver) {
            karp.y = karpY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            alert("Démarrer la partie ? ");
        }
    }
    if (e.code == "KeyV") {
        alert("key V");
        console.log("c pressé");
    }
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
