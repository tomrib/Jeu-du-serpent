/* La fonction `window.onload` est un gestionnaire d'événements qui est déclenché lorsque le chargement
de la fenêtre est terminé. Dans ce cas, il est utilisé pour garantir que le code JavaScript contenu
dans la fonction n'est exécuté qu'une fois le chargement du document HTML terminé. */
window.onload = function () {
    /* Ces variables initialisent les valeurs qui seront utilisées dans le jeu. */
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var dela = 100;
    var snakee;
    var canvas;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;
    var timeout;

    /**
     * La fonction initialise un élément du canevas, crée un serpent et une pomme et définit le score sur 0
     * avant d'actualiser le canevas.
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
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        ctx = canvas.getContext('2d');
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    /**
     * La fonction rafraîchirCanvas met à jour le canevas en faisant avancer le serpent, en vérifiant les
     * collisions, en mettant à jour le score et en redessinant le serpent et la pomme.
     */
    function refreshCanvas() {
        snakee.advance();
        if (snakee.checkCollision()) {
            gameOver();
        } else {
            if (snakee.isEatingAppel(applee)) {
                score++;
                snakee.ateApple = true;
                do {
                    applee.setNewPosition();
                }
                while (applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawScore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas, dela);
        }
    }

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
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("GAME OVER", centreX, centreY - 180);
        ctx.fillText("GAME OVER", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuer sur la touche espace pour REJOUER", centreX, centreY - 120)
        ctx.fillText("Appuer sur la touche espace pour REJOUER", centreX, centreY - 120)
        ctx.restore();
    }
    /**
     * La fonction de redémarrage réinitialise le jeu en créant un nouveau serpent, une pomme et un nouveau
     * score, puis en actualisant le canevas.
     */

    function restart() {
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    /**
     * La fonction "drawScore" permet de dessiner la partition sur un canevas en utilisant JavaScript.
     */
    function drawScore() {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        var ventreX = canvasWidth / 2;
        var ventreY = canvasHeight / 2;
        ctx.fillText(score.toString(), ventreX, ventreY);
        ctx.restore();
    }
    /**
     * La fonction drawBlock prend un contexte et une position du canevas, et dessine un bloc sur le
     * canevas à la position spécifiée.
     * 
     * Args:
     *   ctx: Le paramètre ctx est le contexte de rendu 2D de l'élément canvas. Il sert à dessiner sur la
     * toile.
     *   position: Le paramètre position est un tableau contenant les coordonnées x et y de la position du
     * bloc.
     */
    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }

    /**
     * La fonction Serpent représente un objet serpent dans un jeu et contient des méthodes pour déplacer
     * le serpent, changer sa direction, vérifier les collisions et vérifier s'il mange une pomme.
     * 
     * Args:
     *   body: Un tableau représentant le corps du serpent. Chaque élément du tableau représente un bloc du
     * corps du serpent, le premier élément étant la tête du serpent et le dernier élément étant la queue.
     *   direction: Le paramètre direction est une chaîne qui représente la direction actuelle du serpent.
     * Il peut avoir l'une des valeurs suivantes : "gauche", "droite", "haut" ou "bas".
     * 
     * Returns:
     *   La fonction Snake ne renvoie rien. Il s'agit d'une fonction constructeur utilisée pour créer des
     * objets avec des propriétés et des méthodes spécifiques.
     */
    function Snake(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            for (var i = 0; i < this.body.length; i++) {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function () {
            var nextPosition = this.body[0].slice();
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
                    throw ("Invalid Direction");
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple) {
                this.body.pop();
            } else {
                this.ateApple = false;
            }
        };
        this.setDirection = function (newDirection) {
            var allowedDirection;
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
                    throw ("Invalid Direction");
            }
            if (allowedDirection.indexOf(newDirection) > -1) {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function () {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollision = true;
            }

            for (var i = 0; i < rest.length; i++) {
                if (snakeX == rest[i][0] && snakeY == rest[i][1]) {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };

        this.isEatingAppel = function (appleToEat) {
            var head = this.body[0];
            if (appleToEat.position && head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) {
                return true;
            } else {
                return false;
            }
        };
    }

    /**
     * La fonction ci-dessus définit un constructeur pour un objet Apple en JavaScript, qui possède des
     * propriétés et des méthodes liées au dessin et au positionnement de la pomme sur un canevas.
     * 
     * Args:
     *   position: Le paramètre position est un tableau qui représente les coordonnées x et y de la
     * pomme sur la grille de jeu.
     * 
     * Returns:
     *   La variable `isOnSnake` est renvoyée.
     */
    function Apple(position) {
        this.position = position;
        this.draw = function () {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        };
        this.setNewPosition = function () {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function (snakeToCheck) {
            var isOnSnake = false;
            for (var i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        }
    }

    init();

    /* L'extrait de code ajoute un écouteur d'événement à l'objet document pour l'événement "keydown".
    Lorsqu'une touche est enfoncée, la fonction handleKeyDown est appelée. */
    document.onkeydown = function handleKeyDown(e) {
        var key = e.key;
        var newDirection;
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
                throw ("Invalid Direction");
        }
        snakee.setDirection(newDirection);
    };
};
