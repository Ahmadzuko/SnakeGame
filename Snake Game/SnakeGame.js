//get all elements from html file
const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#score");
const button = document.querySelector("#button");
//to use canvas
const context = gameBoard.getContext("2d");
//needed variables
const gameWidth = gameBoard.width; //not very important
const gameHeight = gameBoard.height;
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX, foodY; //food coordinates
let score = 0;
let snake = [{ x: unitSize * 2, y: 0 }, { x: unitSize * 1, y: 0 }, { x: 0, y: 0 }] //initialise snake

//functions
gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        // setTimeout(funciton() {}, ); or the one below
        setTimeout(() => {
            startTimer();
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    context.fillStyle = 'lightgreen';
    context.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        const ranNum =
            Math.round((Math.random() * (max - min) + min) / unitSize) *
            unitSize;
        return ranNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
}

function drawFood() {
    context.fillStyle = 'red';
    context.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };
    snake.unshift(head);
    //if food is eaten
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop(); // remove the tail so it looks like it's moving
    }
}

function drawSnake() {
    context.fillStyle = 'pink';
    context.strokeStyle = 'black';
    snake.forEach(function(snakePart) {
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });

}

window.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    const goingUp = yVelocity == -unitSize;
    const goingDown = yVelocity == unitSize;
    const goingRight = xVelocity == unitSize;
    const goingLeft = xVelocity == -unitSize;

    switch (true) { //so the snake doesn't go back to its body
        case keyPressed == left && !goingRight:
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case keyPressed == up && !goingDown:
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case keyPressed == right && !goingLeft:
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case keyPressed == down && !goingUp:
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case snake[0].x < 0: //hit the left wall
            running = false;
            break;
        case snake[0].x >= gameWidth: //hit the right wall
            running = false;
            break;
        case snake[0].y < 0: //hit the top wall
            running = false;
            break;
        case snake[0].y >= gameHeight: //hit the buttom wall
            running = false;
            break;
    }
    //if snake touched itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    pauseTimer();
    context.font = "50px MV Boli";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText("Game Over!", gameWidth / 2, gameHeight / 2);
    running = false;
}

button.addEventListener("click", resetGame);

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [{ x: unitSize * 2, y: 0, }, { x: unitSize, y: 0, }, { x: 0, y: 0, }, ];
    resetTimer();
    gameStart();
}

//timer
const timeDisplay = document.querySelector('#timer');

let startTime = 0;
let elapsedTime = 0;
let currentTime = 0;
let paused = true;
let intervalId;
let mins = 0;
let secs = 0;

function startTimer() {
    if (paused) {
        paused = false;
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(updateTime, 1000);
    }
}

function updateTime() {
    elapsedTime = Date.now() - startTime;

    secs = Math.floor((elapsedTime / 1000) % 60);
    mins = Math.floor((elapsedTime / (1000 * 60)) % 60);

    secs = pad(secs);
    mins = pad(mins);

    timeDisplay.textContent = `${mins}:${secs}`;

    function pad(unit) {
        return ("0" + unit).length > 2 ? unit : "0" + unit;
    }
}

function pauseTimer() {
    if (!paused) {
        paused = true;
        elapsedTime = Date.now() - startTime;
        clearInterval(intervalId);
    }
}

function resetTimer() {
    paused = true;
    clearInterval(intervalId);
    startTime = 0;
    elapsedTime = 0;
    currentTime = 0;
    mins = 0;
    secs = 0;
    timeDisplay.textContent = "00:00";
}