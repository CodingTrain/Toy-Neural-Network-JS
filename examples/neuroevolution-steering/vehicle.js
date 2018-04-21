// Daniel Shiffman
// Nature of Code 2018
// https://github.com/shiffman/NOC-S18

// Evolutionary "Steering Behavior" Simulation


// Mutation function to be passed into Vehicle's brain
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

// This is a class for an individual sensor
// Each vehicle will have N sensors
class Sensor {
  constructor(angle) {
    // The vector describes the sensor's direction
    this.dir = p5.Vector.fromAngle(angle);
    // This is the sensor's reading
    this.val = 0;
  }
}

// This is the class for each Vehicle
class Vehicle {
  // A vehicle can be from a "brain" (Neural Network)
  constructor(brain) {

    // All the physics stuff
    this.acceleration = createVector();
    this.velocity = createVector();
    this.position = createVector(random(width), random(height));
    this.r = 4;
    this.maxforce = 0.1;
    this.maxspeed = 4;
    this.minspeed = 0.25;
    this.maxhealth = 3;

    // This indicates how well it is doing
    this.score = 0;

    // Create an array of sensors
    this.sensors = [];
    for (let angle = 0; angle < TWO_PI; angle += sensorAngle) {
      this.sensors.push(new Sensor(angle));
    }

    // If a brain is passed via constructor copy it
    if (brain) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
      // Otherwise make a new brain
    } else {
      // inputs are all the sensors plus position and velocity info
      let inputs = this.sensors.length + 6;
      // Arbitrary hidden layer
      // 2 outputs for x and y desired velocity
      this.brain = new NeuralNetwork(inputs, 32, 2);
    }

    // Health keeps vehicl alive
    this.health = 1;
  }


  // Called each time step
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed to max
    this.velocity.limit(this.maxspeed);
    // Keep speed at a minimum
    if (this.velocity.mag() < this.minspeed) {
      this.velocity.setMag(this.minspeed);
    }
    // Update position
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);

    // Decrease health
    this.health = constrain(this.health, 0, this.maxhealth);
    this.health -= 0.005;
    // Increase score
    this.score += 1;
  }

  // Return true if health is less than zero
  // or if vehicle leaves the canvas
  dead() {
    return (this.health < 0 ||
      this.position.x > width + this.r ||
      this.position.x < -this.r ||
      this.position.y > height + this.r ||
      this.position.y < -this.r
    );
  }

  // Make a copy of this vehicle according to probability
  clone(prob) {
    // Pick a random number
    let r = random(1);
    if (r < prob) {
      // New vehicle with brain copy
      return new Vehicle(this.brain);
    }
    // otherwise will return undefined
  }

  // Function to calculate all sensor readings
  // And predict a "desired velocity"
  think(food) {
    // All sensors start with maximum length
    for (let j = 0; j < this.sensors.length; j++) {
      this.sensors[j].val = sensorLength;
    }

    for (let i = 0; i < food.length; i++) {
      // Where is the food
      let otherPosition = food[i];
      // How far away?
      let dist = p5.Vector.dist(this.position, otherPosition);
      // Skip if it's too far away
      if (dist > sensorLength) {
        continue;
      }

      // What is vector pointint to food
      let toFood = p5.Vector.sub(otherPosition, this.position);

      // Check all the sensors
      for (let j = 0; j < this.sensors.length; j++) {
        // If the relative angle of the food is in between the range
        let delta = this.sensors[j].dir.angleBetween(toFood);
        if (delta < sensorAngle / 2) {
          // Sensor value is the closest food
          this.sensors[j].val = min(this.sensors[j].val, dist);
        }
      }
    }

    // Create inputs
    let inputs = [];
    // This is goofy but these 4 inputs are mapped to distance from edges
    inputs[0] = constrain(map(this.position.x, foodBuffer, 0, 0, 1), 0, 1);
    inputs[1] = constrain(map(this.position.y, foodBuffer, 0, 0, 1), 0, 1);
    inputs[2] = constrain(map(this.position.x, width - foodBuffer, width, 0, 1), 0, 1);
    inputs[3] = constrain(map(this.position.y, height - foodBuffer, height, 0, 1), 0, 1);
    // These inputs are the current velocity vector
    inputs[4] = this.velocity.x / this.maxspeed;
    inputs[5] = this.velocity.y / this.maxspeed;
    // All the sensor readings
    for (let j = 0; j < this.sensors.length; j++) {
      inputs[j + 6] = map(this.sensors[j].val, 0, sensorLength, 1, 0);
    }

    // Get two outputs
    let outputs = this.brain.predict(inputs);
    // Turn it into a desired velocity and apply steering formula
    let desired = createVector(2 * outputs[0] - 1, 2 * outputs[1] - 1);
    desired.mult(this.maxspeed);
    // Craig Reynolds steering formula
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    // Apply the force
    this.applyForce(steer);
  }

  // Check against array of food
  eat(list) {
    for (let i = list.length - 1; i >= 0; i--) {
      // Calculate distance
      let d = p5.Vector.dist(list[i], this.position);
      // If vehicle is within food radius, eat it!
      if (d < foodRadius) {
        list.splice(i, 1);
        // Add health when it eats food
        this.health++;
      }
    }
  }

  // Add force to acceleration
  applyForce(force) {
    this.acceleration.add(force);
  }

  display() {
    // Color based on health
    let green = color(0, 255, 255, 255);
    let red = color(255, 0, 100, 100);
    let col = lerpColor(red, green, this.health)

    push();
    // Translate to vehicle position
    translate(this.position.x, this.position.y);

    // Draw lines for all the activated sensors
    if (debug.checked()) {
      for (let i = 0; i < this.sensors.length; i++) {
        let val = this.sensors[i].val;
        if (val > 0) {
          stroke(col);
          strokeWeight(map(val, 0, sensorLength, 4, 0));
          let position = this.sensors[i].dir;
          line(0, 0, position.x * val, position.y * val);
        }
      }
      // Display score next to each vehicle
      noStroke();
      fill(255, 200);
      text(int(this.score), 10, 0);
    }
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + PI / 2;
    rotate(theta);
    // Draw the vehicle itself
    fill(col);
    strokeWeight(1);
    stroke(col);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  // Highlight with a grey bubble
  highlight() {
    fill(255, 255, 255, 50);
    stroke(255);
    ellipse(this.position.x, this.position.y, 32, 32);
  }
}