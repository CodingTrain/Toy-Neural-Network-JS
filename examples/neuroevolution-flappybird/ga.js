// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&


// This file includes functions for creating a new generation
// of birds.

// Start the game over
function resetGame() {
  counter = 0;
  // Resetting best bird score to 0
  if (bestBird) {
    bestBird.score = 0;
  }
  pipes = [];
}

// Create the next generation
function nextGeneration() {
  resetGame();
  // Normalize the fitness values 0-1
  normalizeFitness(allBirds);
  // Generate a new set of birds
  activeBirds = generate(allBirds);
  // Copy those birds to another array
  allBirds = activeBirds.slice();
}

// Generate a new population of birds
function generate(oldBirds) {
  let newBirds = [];
  for (let i = 0; i < oldBirds.length; i++) {
    // Select a bird based on fitness
    let bird = poolSelection(oldBirds);
    newBirds[i] = bird;
  }
  return newBirds;
}

// Normalize the fitness of all birds
function normalizeFitness(birds) {
  // Make score exponentially better?
  for (let i = 0; i < birds.length; i++) {
    birds[i].score = pow(birds[i].score, 2);
  }

  // Add up all the scores
  let sum = 0;
  for (let i = 0; i < birds.length; i++) {
    sum += birds[i].score;
  }
  // Divide by the sum
  for (let i = 0; i < birds.length; i++) {
    birds[i].fitness = birds[i].score / sum;
  }
}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(birds) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= birds[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return birds[index].copy();
}