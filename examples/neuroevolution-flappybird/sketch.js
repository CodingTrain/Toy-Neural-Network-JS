// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY


// GA additions
// How big is the population
let totalPopulation = 250;
// All active birds (not yet collided with pipe)
let activeBirds = [];
// All birds for any given population
let allBirds = [];
// Pipes
let pipes = [];
// A frame counter to determine when to add a pipe
let counter = 0;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;

// Training or just showing the current best
let runBest = false;
let runBestButton;

//// Game stuff

// let bird;
// let pipes;
let parallax = 0.8;
let score = 0;
let maxScore = 0;
let birdSprite;
let pipeBodySprite;
let pipePeakSprite;
let bgImg;
let bgX = 0;
let gameoverFrame = 0;
let isOver = false;
let pipeSpeed = 2;

let touched = false;
let prevTouched = touched;


function preload() {
  pipeBodySprite = loadImage('graphics/pipe_marshmallow_fix.png');
  pipePeakSprite = loadImage('graphics/pipe_marshmallow_fix.png');
  birdSprite = loadImage('graphics/train.png');
  bgImg = loadImage('graphics/background.png');
}

function setup() {

  let canvas = createCanvas(600, 600);
  canvas.parent('canvascontainer');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
  runBestButton.mousePressed(toggleState);

  // Create a population
  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }


}

// Toggle the state of the simulation
function toggleState() {
  runBest = !runBest;
  // Show the best bird
  if (runBest) {
    resetGame();
    bestBird.score = 0;
    runBestButton.html('continue training');
    // Go train some more
  } else {
    nextGeneration();
    runBestButton.html('run best');
  }
}


function draw() {
  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // How many times to advance the game
  for (let n = 0; n < cycles; n++) {
    //bgX -= pipes[0].speed * parallax;
    bgX -= pipeSpeed * parallax;


    // this handles the "infinite loop" by checking if the right
    // edge of the image would be on the screen, if it is draw a
    // second copy of the image right next to it
    // once the second image gets to the 0 point, we can reset bgX to
    // 0 and go back to drawing just one image.
    if (bgX <= -bgImg.width + width) {
      if (bgX <= -bgImg.width) {
        bgX = 0;
      }
    }

    // Are we just running the best bird
    if (runBest) {
      bestBird.think(pipes);
      bestBird.update();
      for (let j = 0; j < pipes.length; j++) {
        // Start over, bird hit pipe
        if (pipes[j].hits(bestBird)) {
          resetGame();
          break;
        }
      }
      // Or are we running all the active birds
    } else {
      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();

        if (pipes[i].offscreen()) {
          pipes.splice(i, 1);
        }
      }

      for (let i = activeBirds.length - 1; i >= 0; i--) {
        let bird = activeBirds[i];
        // Bird uses its brain!
        bird.think(pipes);
        bird.update();
        // Check all the pipes
        for (let j = 0; j < pipes.length; j++) {
          // if (pipes[j].pass(bird)) {
          //   bird.score++;
          // }
          // It's hit a pipe
          if (pipes[j].hits(bird)) {
            // Remove this bird
            activeBirds.splice(i, 1);
            break;
          }
        }
      }
    }


    if (counter % 250 == 0) {
      pipes.push(new Pipe());
    }
    counter++;


    // What is highest score of the current population
    let tempHighScore = 0;
    // If we're training
    if (!runBest) {
      // Which is the best bird?
      let tempBestBird = null;
      for (let i = 0; i < activeBirds.length; i++) {
        let s = activeBirds[i].score;
        if (s > tempHighScore) {
          tempHighScore = s;
          tempBestBird = activeBirds[i];
        }
      }

      // Is it the all time high scorer?
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
        bestBird = tempBestBird;
      }
    } else {
      // Just one bird, the best one so far
      tempHighScore = bestBird.score;
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
      }
    }

    // Update DOM Elements
    highScoreSpan.html(tempHighScore);
    allTimeHighScoreSpan.html(highScore);

    // Draw everything!

    background(0);
    // Draw our background image, then move it at the same speed as the pipes
    image(bgImg, bgX, 0, bgImg.width, height);
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].show();
    }

    if (runBest) {
      bestBird.show();
    } else {
      for (let i = 0; i < activeBirds.length; i++) {
        activeBirds[i].show();
      }
      // If we're out of birds go to the next generation
      if (activeBirds.length == 0) {
        nextGeneration();
      }
    }

  }

}




// function keyPressed() {
//   if (key === ' ') {
//     bird.up();
//     if (isOver) reset(); //you can just call reset() in Machinelearning if you die, because you cant simulate keyPress with code.
//   }
// }

// function touchStarted() {
//   if (isOver) reset();
// }