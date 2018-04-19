// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// Evolutionary "Steering Behavior" Simulation

// An array of vehicles
let population = [];

// An array of "food"
let food = [];

// Checkbox to show additional info
let debug;

// Slider to speed up simulation
let speedSlider;
let speedSpan;

// How big is the food?
let foodRadius = 8;
// How much food should there?
let foodAmount = 25;
// Don't put food near the edge
let foodBuffer = 50;


// How many sensors does each vehicle have?
let totalSensors = 8;
// How far can each vehicle see?
let sensorLength = 150;
// What's the angle in between sensors
let sensorAngle = (Math.PI * 2) / totalSensors;

let best = null;

function setup() {

  // Add canvas and grab checkbox and slider
  let canvas = createCanvas(640, 360);
  canvas.parent('canvascontainer');
  debug = select('#debug');
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');

  // Create initial population
  for (let i = 0; i < 20; i++) {
    population[i] = new Vehicle();
  }
}

function draw() {
  background(0);

  // How fast should we speed up
  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  // Variable to keep track of highest scoring vehicle

  // Run the simulation "cycles" amount of time
  for (let n = 0; n < cycles; n++) {
    // Always keep a minimum amount of food
    while (food.length < foodAmount) {
      food.push(createVector(random(foodBuffer, width - foodBuffer), random(foodBuffer, height - foodBuffer)));
    }

    // Eat any food
    for (let v of population) {
      v.eat(food);
    }

    // Go through all vehicles and find the best!
    let record = -1;
    for (let i = population.length - 1; i >= 0; i--) {
      let v = population[i];
      // Eat the food (index 0)
      v.think(food);
      v.update(food);

      // If the vehicle has died, remove
      if (v.dead()) {
        population.splice(i, 1);
      } else {
        // Is it the vehicles that has lived the longest?
        if (v.score > record) {
          record = v.score;
          best = v;
        }
      }
    }

    // If there is less than 20 apply reproduction
    if (population.length < 20) {
      for (let v of population) {
        // Every vehicle has a chance of cloning itself according to score
        // Argument to "clone" is probability
        let newVehicle = v.clone(0.1 * v.score / record);
        // If there is a child
        if (newVehicle != null) {
          population.push(newVehicle);
        }
      }
    }
  }

  // Draw all the food
  for (let i = 0; i < food.length; i++) {
    fill(100, 255, 100, 200);
    stroke(100, 255, 100);
    ellipse(food[i].x, food[i].y, foodRadius * 2);
  }

  // Highlight the best if in debug mode
  if (debug.checked()) {
    best.highlight();
  }

  // Draw all the vehicles
  for (let v of population) {
    v.display();
  }
}
