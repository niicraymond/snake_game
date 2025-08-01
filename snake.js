// configuration
const rows = 20;
const cols = 20;

let board;
let context;
let blockSize;
let score = 0;

// snake head
let snakeX;
let snakeY;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];

// food
let foodX;
let foodY;
let gameOver = false;

// touch swipe tracking
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30;

// timing
const MOVE_INTERVAL = 1000 / 7;
let lastUpdateTime = 0;

// highscore helpers
function getHighScore() {
  return parseInt(localStorage.getItem("snakeHighScore") || "0", 10);
}
function setHighScore(s) {
  localStorage.setItem("snakeHighScore", String(s));
}

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  placeFood();
  document.addEventListener("keyup", handleKey);

  // touch input for mobile (swipe)
  board.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    },
    { passive: true }
  );
  board.addEventListener(
    "touchend",
    (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > SWIPE_THRESHOLD) tryChangeDirection("right");
        else if (dx < -SWIPE_THRESHOLD) tryChangeDirection("left");
      } else {
        if (dy > SWIPE_THRESHOLD) tryChangeDirection("down");
        else if (dy < -SWIPE_THRESHOLD) tryChangeDirection("up");
      }
    },
    { passive: true }
  );

  // prevent touch scrolling while playing
  board.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  requestAnimationFrame(gameLoop);
};

function resizeCanvas() {
  const rawMax = Math.min(window.innerWidth, window.innerHeight) * 0.9;
  const displaySize = Math.min(500, Math.floor(rawMax));
  const dpr = window.devicePixelRatio || 1;

  board.style.width = board.style.height = `${displaySize}px`;
  board.width = board.height = Math.floor(displaySize * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  blockSize = displaySize / rows;
  if (snakeX === undefined || snakeY === undefined) {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
  }
}

function gameLoop(timestamp) {
  if (gameOver) return;
  if (!lastUpdateTime || timestamp - lastUpdateTime >= MOVE_INTERVAL) {
    update();
    lastUpdateTime = timestamp;
  }
  requestAnimationFrame(gameLoop);
}

function update() {
  // clear board first
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  // draw score & high score
  const highScore = getHighScore();
  const infoFontSize = Math.max(12, Math.floor(blockSize * 0.4));
  context.font = `${infoFontSize}px monospace`;
  context.textBaseline = "top";
  context.textAlign = "left";
  context.fillStyle = "#fff";
  context.fillText(`Score: ${score}`, 5, 5);
  context.fillText(`High: ${highScore}`, 5, 5 + infoFontSize + 4);

  // draw food
  context.font = `${blockSize}px serif`;
  context.textBaseline = "top";
  context.fillText("🍎", foodX, foodY);

  // eat food
  if (
    Math.round(snakeX) === Math.round(foodX) &&
    Math.round(snakeY) === Math.round(foodY)
  ) {
    snakeBody.push([foodX, foodY]);
    placeFood();
    score += 1;
  }

  // move body
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // move head
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;

  // draw snake
  context.font = `${blockSize}px serif`;
  context.textBaseline = "top";
  context.fillText("🐸", snakeX, snakeY);
  for (let i = 0; i < snakeBody.length; i++) {
    context.fillText("🟢", snakeBody[i][0], snakeBody[i][1]);
  }

  // boundary collision
  if (
    snakeX < 0 ||
    snakeX >= cols * blockSize ||
    snakeY < 0 ||
    snakeY >= rows * blockSize
  ) {
    endGame();
    return;
  }

  // self-collision
  for (let i = 0; i < snakeBody.length; i++) {
    if (
      Math.round(snakeX) === Math.round(snakeBody[i][0]) &&
      Math.round(snakeY) === Math.round(snakeBody[i][1])
    ) {
      endGame();
      return;
    }
  }
}

function endGame() {
  gameOver = true;
  const prevHigh = getHighScore();
  let message;
  if (score > prevHigh) {
    setHighScore(score);
    message = `🎉 New High Score: ${score}!`;
  } else {
    message = `Game Over. Score: ${score}. High Score: ${prevHigh}.`;
  }
  setTimeout(() => {
    alert(message);
    window.location.reload();
  }, 50);
}

function handleKey(e) {
  if (e.code === "ArrowUp") tryChangeDirection("up");
  else if (e.code === "ArrowDown") tryChangeDirection("down");
  else if (e.code === "ArrowLeft") tryChangeDirection("left");
  else if (e.code === "ArrowRight") tryChangeDirection("right");
}

function tryChangeDirection(dir) {
  if (dir === "up" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (dir === "down" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (dir === "left" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (dir === "right" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

function placeFood() {
  const fx = Math.floor(Math.random() * cols);
  const fy = Math.floor(Math.random() * rows);
  foodX = fx * blockSize;
  foodY = fy * blockSize;
}
