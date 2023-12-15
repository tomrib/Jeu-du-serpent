/* La classe Snake représente un serpent dans un jeu et contient des méthodes pour dessiner, avancer,
changer de direction, vérifier les collisions et vérifier si le serpent mange une pomme. */
class Snake {
/**
 * La fonction constructeur initialise un objet avec des propriétés concernant le corps, la direction
 * et si une pomme a été mangée.
 * 
 * Args:
 *   body: Le paramètre `body` représente un tableau contenant les coordonnées de chaque segment du
 * corps du serpent. Chaque segment est représenté par un objet avec les propriétés « x » et « y ».
 *   direction: Le paramètre direction est utilisé pour spécifier la direction initiale du corps. Il
 * peut s'agir d'une valeur de chaîne représentant la direction, telle que "haut", "bas", "gauche" ou
 * "droite".
 */
    constructor(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
    }

/**
 * La fonction draw en JavaScript enregistre le contexte actuel, définit le style de remplissage sur
 * "#33cc33", puis parcourt le tableau body, appelant la fonction drawBlock pour chaque élément.
 * 
 * Args:
 *   ctx: Le paramètre `ctx` est le contexte de rendu 2D de l'élément canevas. Il est utilisé pour
 * dessiner des formes et appliquer des styles à la toile.
 */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "#33cc33";
        for (let i = 0; i < this.body.length; i++) {
            drawBlock(ctx, this.body[i]);
        }
        ctx.restore();
    }

/**
 * La fonction `advance()` fait avancer le corps du serpent d'un pas dans la direction spécifiée et
 * supprime le dernier segment du corps si le serpent n'a pas mangé de pomme.
 */
    advance() {
        let nextPosition = this.body[0].slice();
        switch (this.direction) {
            case "left":
                nextPosition[0] -= 1;
                break;
            case "right":
                nextPosition[0] += 1;
                break;
            case "down":
                nextPosition[1] += 1;
                break;
            case "up":
                nextPosition[1] -= 1;
                break;
            default:
                throw ("Direction invalide");
        }
        this.body.unshift(nextPosition);
        if (!this.ateApple) {
            this.body.pop();
        } else {
            this.ateApple = false;
        }
    }

/**
 * La fonction `setDirection` met à jour la direction d'un objet en fonction de la direction actuelle
 * et de la nouvelle direction fournie, mais n'autorise que certaines directions basées sur la
 * direction actuelle.
 * 
 * Args:
 *   newDirection: La nouvelle direction que vous souhaitez définir pour un objet.
 */
    setDirection(newDirection) {
        let allowedDirection;
        switch (this.direction) {
            case "left":
            case "right":
                allowedDirection = ["up", "down"];
                break;
            case "down":
            case "up":
                allowedDirection = ["left", "right"];
                break;
            default:
                throw ("Direction invalide");
        }
        if (allowedDirection.indexOf(newDirection) > -1) {
            this.direction = newDirection;
        }
    }

/**
 * La fonction `checkCollision` vérifie si le serpent est entré en collision avec un mur ou avec
 * lui-même.
 * 
 * Returns:
 *   une valeur booléenne indiquant s'il y a une collision avec le mur ou avec le serpent.
 */
    checkCollision() {
        let wallCollision = false;
        let snakeCollision = false;
        let head = this.body[0];
        let rest = this.body.slice(1);
        let snakeX = head[0];
        let snakeY = head[1];
        let minX = 0;
        let minY = 0;
        let maxX = widthInBlocks - 1;
        let maxY = heightInBlocks - 1;
        let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
        let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

        if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
            wallCollision = true;
        }

        for (let i = 0; i < rest.length; i++) {
            if (snakeX == rest[i][0] && snakeY == rest[i][1]) {
                snakeCollision = true;
            }
        }
        return wallCollision || snakeCollision;
    }

/**
 * La fonction vérifie si la tête du serpent est dans la même position que la pomme donnée.
 * 
 * Args:
 *   appleToEat: Le paramètre `appleToEat` est un objet qui représente une pomme. Il possède une
 * propriété « position » qui est un tableau contenant les coordonnées x et y de la position de la
 * pomme sur une grille.
 * 
 * Returns:
 *   une valeur booléenne. Il renvoie vrai si la position de la pomme à manger correspond à la position
 * de la tête du corps, et faux dans le cas contraire.
 */
    isEatingApple(appleToEat) {
        let head = this.body[0];
        return appleToEat.position && head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1];
    }
};

/* La classe Apple représente un objet pomme dans un jeu et fournit des méthodes pour dessiner la
pomme, définir une nouvelle position pour la pomme et vérifier si la pomme est sur le serpent. */
class Apple {
 /**
  * La fonction constructeur initialise un objet avec une position donnée.
  * 
  * Args:
  *   position: Le paramètre position est utilisé pour spécifier la position d'un objet. Il peut s'agir
  * de n'importe quelle valeur représentant une position, telle que des coordonnées (x, y) ou une
  * chaîne indiquant un emplacement spécifique.
  */
    constructor(position) {
        this.position = position;
    }

/**
 * La fonction de dessin en JavaScript utilise le contexte du canevas pour dessiner un cercle rempli à
 * une position spécifiée avec un rayon spécifié.
 * 
 * Args:
 *   ctx: Le paramètre `ctx` est le contexte de rendu 2D de l'élément canevas. Il est utilisé pour
 * dessiner des formes et appliquer des styles à la toile.
 */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "#ff0000";
        let radius = blockSize / 2;
        let x = this.position[0] * blockSize + radius;
        let y = this.position[1] * blockSize + radius;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

/**
 * La fonction "setNewPosition" génère des coordonnées x et y aléatoires dans une plage donnée et les
 * affecte à la propriété "position".
 */
    setNewPosition() {
        let newX = Math.round(Math.random() * (widthInBlocks - 1));
        let newY = Math.round(Math.random() * (heightInBlocks - 1));
        this.position = [newX, newY];
    }

/**
 * La fonction vérifie si une position donnée se trouve sur le corps du serpent.
 * 
 * Args:
 *   snakeToCheck: Le paramètre `snakeToCheck` est un objet représentant un serpent. Il possède
 * probablement une propriété appelée « corps », qui est un ensemble de blocs représentant le corps du
 * serpent. Chaque bloc est représenté par un tableau avec deux éléments : la coordonnée x et la
 * coordonnée y de la position du bloc.
 * 
 * Returns:
 *   une valeur booléenne. Il vérifie si la position actuelle de l'objet se trouve sur n'importe quel
 * bloc du corps du serpent. Si c'est le cas, cela renvoie vrai, indiquant que l'objet se trouve sur le
 * serpent. Si ce n'est pas le cas, il renvoie false, indiquant que l'objet n'est pas sur le serpent.
 */
    isOnSnake(snakeToCheck) {
        return snakeToCheck.body.some((block) => {
            return this.position[0] === block[0] && this.position[1] === block[1];
        });
    }
};

const canvasWidth = 900;
const canvasHeight = 600;
const blockSize = 30;
let ctx;
const delay = 100;
let snake;
let canvas;
let apple;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;
let score;
let timeout;

/**
 * La fonction `init` initialise le canevas, le serpent, la pomme, le score et actualise le canevas.
 */
function init() {
    canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);

    snake = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    ctx = canvas.getContext('2d');
    apple = new Apple([10, 10]);
    score = 0;

    refreshCanvas();
};

/**
 * La fonction rafraîchirCanvas met à jour le canevas en faisant avancer le serpent, en vérifiant les
 * collisions, en mettant à jour le score et en redessinant le serpent et la pomme.
 */
function refreshCanvas() {
    snake.advance();
    if (snake.checkCollision()) {
        gameOver();
    } else {
        if (snake.isEatingApple(apple)) {
            score++;
            snake.ateApple = true;
            do {
                apple.setNewPosition();
            } while (apple.isOnSnake(snake));
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        snake.draw(ctx);
        apple.draw(ctx);
        timeout = setTimeout(refreshCanvas, delay);
    }
};

/**
 * La fonction « gameOver » affiche un message « GAME OVER » sur le canevas et invite l'utilisateur à
 * appuyer sur la barre d'espace pour rejouer la partie.
 */
function gameOver() {
    ctx.save();
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 5;
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;
    ctx.strokeText("GAME OVER", centerX, centerY - 180);
    ctx.fillText("GAME OVER", centerX, centerY - 180);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText("Appuyez sur la touche espace pour REJOUER", centerX, centerY - 120);
    ctx.fillText("Appuyez sur la touche espace pour REJOUER", centerX, centerY - 120);
    ctx.restore();
};

/**
 * La fonction de redémarrage réinitialise le jeu en créant un nouveau serpent, en plaçant une nouvelle
 * pomme, en réinitialisant le score et en actualisant la toile.
 */
function restart() {
    snake = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    apple = new Apple([10, 10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
};

/**
 * La fonction "drawScore" permet de dessiner la partition sur un canevas en utilisant JavaScript.
 */
function drawScore() {
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let centerX = canvasWidth / 2;
    let centerY = canvasHeight / 2;
    ctx.fillText(score.toString(), centerX, centerY);
    ctx.restore();
};

/**
 * La fonction drawBlock prend un contexte et une position du canevas, et dessine un bloc sur le
 * canevas à la position spécifiée.
 * 
 * Args:
 *   ctx: Le paramètre `ctx` est le contexte du canevas sur lequel on veut dessiner le bloc. C'est un
 * objet qui fournit des méthodes et des propriétés pour dessiner sur le canevas.
 *   position: Le paramètre position est un tableau contenant les coordonnées x et y de la position du
 * bloc sur le canevas.
 */
function drawBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
};

/* Ce code gère l'événement keydown sur le document. Lorsqu'une touche est enfoncée, il vérifie la
valeur de la touche et attribue une nouvelle direction au serpent en fonction de la touche enfoncée. */
document.onkeydown = function (e) {
    let key = e.key;
    let newDirection;
    switch (key) {
        case "ArrowLeft":
            newDirection = "left";
            break;
        case "ArrowUp":
            newDirection = "up";
            break;
        case "ArrowRight":
            newDirection = "right";
            break;
        case "ArrowDown":
            newDirection = "down";
            break;
        case " ":
            restart();
            return;
        default:
            throw ("Direction invalide");
    }
    snake.setDirection(newDirection);
};

/* `window.onload = init;` attribue la fonction `init` à l'événement `onload` de l'objet `window`. Cela
signifie que lorsque le chargement de la fenêtre aura fini, la fonction `init` sera appelée. Dans ce
cas, il est utilisé pour initialiser le jeu en créant le canevas, en configurant les objets serpent
et pomme et en démarrant la boucle de jeu. */
window.onload = init;
