// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

// How big is the population
var totalPopulation = 250;
// All active birds (not yet collided with pipe)
var activeBirds = [];
// All birds for any given population
var allBirds = [];
// Pipes
var pipes = [];
// A frame counter to determine when to add a pipe
var counter = 0;

// Interface elements
var speedSlider;
var speedSpan;
var highScoreSpan;
var allTimeHighScoreSpan;

// All time high score
var highScore = 0;

// Training or just showing the current best
var runBest = false;
var runBestButton;

function setup() {
  var canvas = createCanvas(600, 400);
  canvas.parent('canvascontainer');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
  runBestButton.mousePressed(toggleState);

  // Create a population
  for (var i = 0; i < totalPopulation; i++) {
    var bird = new Bird();
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
  background(0);

  // Should we speed up cycles per frame
  var cycles = speedSlider.value();
  speedSpan.html(cycles);


  // How many times to advance the game
  for (var n = 0; n < cycles; n++) {
    // Show all the pipes
    for (var i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    // Are we just running the best bird
    if (runBest) {
      bestBird.think(pipes);
      bestBird.update();
      for (var j = 0; j < pipes.length; j++) {
        // Start over, bird hit pipe
        if (pipes[j].hits(bestBird)) {
          resetGame();
          break;
        }
      }
    // Or are we running all the active birds
    } else {
      for (var i = activeBirds.length - 1; i >= 0; i--) {
        var bird = activeBirds[i];
        // Bird uses its brain!
        bird.think(pipes);
        bird.update();
        // Check all the pipes
        for (var j = 0; j < pipes.length; j++) {
          // It's hit a pipe
          if (pipes[j].hits(activeBirds[i])) {
            // Remove this bird
            activeBirds.splice(i, 1);
            break;
          }
        }
      }
    }

    // Add a new pipe every so often
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  // What is highest score of the current population
  var tempHighScore = 0;
  // If we're training
  if (!runBest) {
    // Which is the best bird?
    var tempBestBird = null;
    for (var i = 0; i < activeBirds.length; i++) {
      var s = activeBirds[i].score;
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
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    bestBird.show();
  } else {
    for (var i = 0; i < activeBirds.length; i++) {
      activeBirds[i].show();
    }
    // If we're out of birds go to the next generation
    if (activeBirds.length == 0) {
      nextGeneration();
    }
  }
}
