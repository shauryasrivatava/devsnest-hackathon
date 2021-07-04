//Create variables to reference and store canvas
let canvas = document.getElementById("brickcanvas");
let ctx = canvas.getContext("2d");
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 10;
let dx = 2;
let dy = -2;
//create the paddle
let paddleHeight = 12;
let paddleWidth = 72;
//specify starting point of paddle
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 8;
let brickColumnCount = 7;
let brickWidth = 72;
let brickHeight = 24;
let brickPadding = 12;
let brickOffsetTop = 100;
let brickOffsetLeft = 30;
//Create variables to take score
let score = 0;
let lives = 3;

// bricks colors
let colors = ["#3E00FD", "#00FDFD", "#FFFF32", "#CEFF03", "#F82888", "#E30303"];

// sounds
let unmute = document.querySelector("#unmute");
let mute = document.querySelector("#mute");
// let img3 = document.querySelector("#board");
// ctx.drawImage(img3, 40, 13);
let music = {
  brick_hit: new Howl({
    src: ["https://assets.codepen.io/21542/howler-sfx-levelup.mp3"],
    volume: 0.3,
  }),
  lift_lost: new Howl({
    src: ["./sounds/life_lost.mp3"],
  }),
  paddle_hit: new Howl({
    src: ["./sounds/paddle_hit.mp3"],
  }),
  bgmusic: new Howl({
    src: ["./sounds/bg2.mp3"],
    volume: 0.5,
    autoplay: true,
  }),

  // let bgmusic = {
  //   m1: new Howl({
  //     src: ["./sounds/bg2.mp3"],
  //     volume: 0.5,
  //     autoplay: true,
  //   }),

  // m2: new Howl({
  //   src: ["https://assets.codepen.io/21542/howler-demo-bg-music.mp3"],
  //   //  autoplay: true
  // }),
};




//Creating arrays for the bricks
let bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    //set the x and y position of the bricks
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Anchor paddle movement to mouse movement
function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

// var paused = false;
// //pause game
// window.addEventListener("keydown", pauseGameKeyHandler, false);

// function pauseGameKeyHandler(e) {
//   var keyCode = e.keyCode;
//   switch (keyCode) {
//     case 80: //p
//       togglePause();
//       break;
//   }
// }

// function togglePause() {
//   paused = !paused;
//   draw();
// }


// // CREATE THE PADDLE
// const paddle = {
//   m : canvas.width/2 - paddleWidth/2,
//   n : canvas.height - paddleHeight,
//   width : paddleWidth,
//   height : paddleHeight,
//   dx :5
// }


// // CREATE THE BALL
// const ball = {
//   m : canvas.width/2,
//   n : paddle.y - ballRadius,
//   radius : ballRadius,
//   speed : 4,
//   dx : 3 * (Math.random() * 2 - 1),
//   dy : -3
// }


function drawBall() {
  ctx.beginPath();
  ctx.arc(x,y, ballRadius, 0, Math.PI * 2); //centered at (x,y) position with radius r = ballRadius starting at 0 = startAngle, ending at Math.PI*2 = endAngle (in Radians)
  ctx.fillStyle = "red";
  ctx.shadowColor = "red";
  ctx.fill();
  ctx.closePath();
}





//Create a function to create the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); //centered at (x,y) position with radius r = ballRadius starting at 0 = startAngle, ending at Math.PI*2 = endAngle (in Radians)
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}
//Create a function to draw the bricks
function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    let rowArr = [];
    for (j = 0; j < brickRowCount; j++) {
      rowArr[j] = colors[Math.floor(Math.random() * colors.length)];
    }
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = rowArr[r];
        ctx.shadowColor = rowArr[r];
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//Create function to keep track of score
function drawScore() {
  var img2 = document.getElementById("trophy");
  ctx.font = "20px monospace";
  ctx.drawImage(img2, 40, 13);
  ctx.fillStyle = "#ffff32";
  ctx.fillText("Score: " + score, 80, 35); //position score at 8,20 on the x,y axis of the canvas
}
//no.of lives remaining
function drawLives() {
  var img1 = document.getElementById("heart");
  ctx.drawImage(img1, canvas.width - 180, 15);
  ctx.font = "20px monospace";
  ctx.fillStyle = "#e30302";
  ctx.fillText("Lives: " + lives, canvas.width - 140, 35);
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          // collision
          music.brick_hit.play();

          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            music.bgmusic.stop();
            alert("Congratulations!! You've won!");
            location.href = 'https://shauryasrivatava.github.io/Game/level5/';
            
            // alert("Level 2");
            // levelup();
            brickColumnCount += 7;
            
          }
        }
      }
    }
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  unmute.addEventListener("click", (e) => {
    if (!music.bgmusic.playing()) {
      music.bgmusic.play();
      unmute.hidden = true;
      mute.hidden = false;
    }
  });
  //music mute unmute
  mute.addEventListener("click", (e) => {
    music.bgmusic.pause();
    mute.hidden = true;
    unmute.hidden = false;
  });
  drawScore();
  drawLives();
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //top wall
  if (y + dy < ballRadius) {
    // dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    //detect paddle hits
    if (x > paddleX && x < paddleX + paddleWidth) {
      // dy = -dy;
      music.paddle_hit.play();
    }
    //if no paddle hit, body of canvas is hit ==> game over
    else {
      lives--;
      music.bgmusic.pause();
      if (!lives) {
        location.href = 'https://shauryasrivatava.github.io/Game/gameover/';

        // alert("GAME OVER!! Try again...");
        // document.location.reload();
      } else {
        music.lift_lost.play();
        alert(`${lives} lives left`);
      }
      music.bgmusic.play();
    }
  }

  //bottom wall
  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }
  //Make paddle move
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  // if (!paused) {
  //   requestAnimationFrame(setInterval(draw, 10));
  // }
}

setInterval(draw, 10);
