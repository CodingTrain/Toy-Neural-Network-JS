// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

function Bird(brain) {
  // position and size of bird
  this.x = 64;
  this.y = height / 2;
  this.r = 12;

  // Gravity, lift and velocity
  this.gravity = 0.4;
  this.lift = -12;
  this.velocity = 0;

  // Is this a copy of another Bird or a new one?
  // The Neural Network is the bird's "brain"
  if (brain instanceof NeuralNetwork) {
    this.brain = brain.copy();
    this.brain.mutate(0.1);
  } else {
    this.brain = new NeuralNetwork(4, 16, 2);
  }

  // Score is how many frames it's been alive
  this.score = 0;
  // Fitness is normalized version of score
  this.fitness = 0;

  // Create a copy of this bird
  this.copy = function() {
    return new Bird(this.brain);
  }

  // Display the bird
  this.show = function() {
    fill(255, 100);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  // This is the key function now that decides
  // if it should jump or not jump!
  this.think = function(pipes) {
    // First find the closest pipe
    var closest = null;
    var record = Infinity;
    for (var i = 0; i < pipes.length; i++) {
      var diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // Now create the inputs to the neural network
      var inputs = [];
      // x position of closest pipe
      inputs[0] = map(closest.x, this.x, width, -1, 1);
      // top of closest pipe opening
      inputs[1] = map(closest.top, 0, height, -1, 1);
      // bottom of closest pipe opening
      inputs[2] = map(closest.bottom, 0, height, -1, 1);
      // bird's y position
      inputs[3] = map(this.y, 0, height, -1, 1);
      // Get the outputs from the network
      var action = this.brain.predict(inputs);
      // Decide to jump or not!
      if (action[1] > action[0]) {
        this.up();
      }
    }
  }

  // Jump up
  this.up = function() {
    this.velocity += this.lift;
  }

  // Update bird's position based on velocity, gravity, etc.
  this.update = function() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;

    // Keep it stuck to top or bottom
    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }

    // Every frame it is alive increases the score
    this.score++;
  }
}