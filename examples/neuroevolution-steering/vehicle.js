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

    // This indicates how well it is doing
    this.score = 0;

    // Create an array of food sensors
    this.foodSensors = [];
    for (let angle = 0; angle < TWO_PI; angle += sensorAngle) {
      this.foodSensors.push(new Sensor(angle));
    }

    // Create an array of wall sensors
    this.wallSensors = [];
    for (let angle = 0; angle < TWO_PI; angle += sensorAngle) {
      this.wallSensors.push(new Sensor(angle));
    }

    // If a brain is passed via constructor copy it
    if (brain) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
      // Otherwise make a new brain
    } else {
      // inputs are all the sensors plus velocity vector components
      let inputs = 2 + this.foodSensors.length + this.wallSensors.length;
      // Arbitrary hidden layer
      // 2 outputs for x and y desired velocity
      this.brain = new NeuralNetwork(inputs, 32, 2);
    }

    // Health keeps vehicle alive
    this.health = 5;
  }


  // Called each time step
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed to max
    this.velocity.limit(this.maxspeed);
    // Update position
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);

    // Decrease health
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
    // All food sensors start with maximum length
    for (let j = 0; j < this.foodSensors.length; j++) {
      this.foodSensors[j].val = sensorLength;
    }
    // All wall sensors start with maximum length
    for (let j = 0; j < this.wallSensors.length; j++) {
      this.wallSensors[j].val = sensorLength;
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

      // What is vector pointing to the food
      let toFood = p5.Vector.sub(otherPosition, this.position);

      // Check all the sensors
      for (let j = 0; j < this.foodSensors.length; j++) {
        // If the relative angle of the food is in between the range
        let delta = this.foodSensors[j].dir.angleBetween(toFood);
        if (delta < sensorAngle / 2) {
          // Sensor value is the closest food
          this.foodSensors[j].val = min(this.foodSensors[j].val, dist);
        }
      }
    }

    // Find the four wall points relative to the vehicle
    let nearbyWalls = [
      createVector(this.position.x, 0),
      createVector(this.position.x, height),
      createVector(0, this.position.y),
      createVector(width, this.position.y)
    ];
    // Update the wall sensors
    for (let i = 0; i < nearbyWalls.length; i++) {
      // Where is the wall?
      let wallPoint = nearbyWalls[i];
      // How far away?
      let dist = p5.Vector.dist(this.position, wallPoint);
      // Skip if it's too far away
      if (dist > sensorLength) {
        continue;
      }

      // What is vector pointing to the wall?
      let toWall = p5.Vector.sub(wallPoint, this.position);

      for (let j = 0; j < this.wallSensors.length; j++) {
        // If the relative angle of the wall is in between the range
        let delta = this.wallSensors[j].dir.angleBetween(toWall);
        if (delta < sensorAngle / 2) {
          // Sensor value is the closest wall point
          this.wallSensors[j].val = min(this.wallSensors[j].val, dist);
        }
      }
    }

    // Create inputs
    let inputs = [];
    // The velocity vector components
    inputs.push(map(this.velocity.x, 0, this.maxspeed, 0, 1));
    inputs.push(map(this.velocity.y, 0, this.maxspeed, 0, 1));
    // The food sensor readings
    for (let i = 0; i < this.foodSensors.length; i++) {
      inputs.push(map(this.foodSensors[i].val, 0, sensorLength, 1, 0));
    }
    // The wall sensor readings
    for (let i = 0; i < this.wallSensors.length; i++) {
      inputs.push(map(this.wallSensors[i].val, 0, sensorLength, 1, 0));
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
        this.health += 2;
      }
    }
  }

  // Add force to acceleration
  applyForce(force) {
    this.acceleration.add(force);
    // It takes up some health/energy to change inertia
    this.health -= force.magSq();
  }

  display() {
    // Color based on health
    let green = color(0, 255, 255, 255);
    let red = color(255, 0, 100, 100);
    let col = lerpColor(red, green, this.health)

    push();
    // Translate to vehicle position
    translate(this.position.x, this.position.y);

    if (debug.checked()) {
      // Draw lines for all the activated food sensors
      for (let i = 0; i < this.foodSensors.length; i++) {
        let val = this.foodSensors[i].val;
        if (val > 0) {
          stroke(green);
          strokeWeight(map(val, 0, sensorLength, 4, 0));
          let position = this.foodSensors[i].dir;
          line(0, 0, position.x * val, position.y * val);
        }
      }

      for (let i = 0; i < this.wallSensors.length; i++) {
        let val = this.wallSensors[i].val;
        if (val > 0) {
          stroke(red);
          strokeWeight(map(val, 0, sensorLength, 4, 0));
          let position = this.wallSensors[i].dir;
          line(0, 0, position.x * val, position.y * val);
        }
      }

      // Display score next to each vehicle
      noStroke();
      fill(255, 200);
      text(this.health.toFixed(2), 10, 0);
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
