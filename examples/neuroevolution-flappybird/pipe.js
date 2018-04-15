// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

class Pipe {
  constructor() {

    // How big is the empty space
    let spacing = 125;
    // Where is th center of the empty space
    let centery = random(spacing, height - spacing);

    // Top and bottom of pipe
    this.top = centery - spacing / 2;
    this.bottom = height - (centery + spacing / 2);
    // Starts at the edge
    this.x = width;
    // Width of pipe
    this.w = 80;
    // How fast
    this.speed = 6;
  }

  // Did this pipe hit a bird?
  hits(bird) {
    if ((bird.y - bird.r) < this.top || (bird.y + bird.r) > (height - this.bottom)) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }

  // Draw the pipe
  show() {
    stroke(255);
    fill(200);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  // Update the pipe
  update() {
    this.x -= this.speed;
  }

  // Has it moved offscreen?
  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }
}