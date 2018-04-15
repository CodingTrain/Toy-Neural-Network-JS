let nn;
let lr_slider;

let training_data = [{
    inputs: [0, 0],
    outputs: [0]
  },
  {
    inputs: [0, 1],
    outputs: [1]
  },
  {
    inputs: [1, 0],
    outputs: [1]
  },
  {
    inputs: [1, 1],
    outputs: [0]
  }
];

function setup() {
  createCanvas(400, 800);
  nn = new NeuralNetwork(2, 4, 1);
  lr_slider = createSlider(0.01, 0.5, 0.1, 0.01);

}

function draw() {
  background(0);

  for (let i = 0; i < 10; i++) {
    let data = random(training_data);
    nn.train(data.inputs, data.outputs);
  }

  nn.setLearningRate(lr_slider.value());

  let resolution = 10;
  let cols = width / resolution;
  let rows = cols;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      let inputs = [x1, x2];
      let y = nn.predict(inputs);
      noStroke();
      fill(y * 255);
      rect(i * resolution, j * resolution, resolution, resolution);
    }
  }

  let weights = [nn.weights_ih, nn.weights_ho];
  drawNN(weights, 0, height / 2, width, height / 2);
}

function drawNN(weights, x, y, w, h) {
  fill(60);
  rect(x, y, w, h);

  //draw neurons and synapses for each layer
  for (let i = 0; i < weights.length; i++) {
    drawLayer(weights[i], x + i * (w / (weights.length + 1)), y, w / (weights.length + 1), h);
  }

  //draw last layer (output
  let layer = weights.length;
  drawLayer({cols: 1, rows: 0, data: []}, x + layer * (w / (weights.length + 1)), y, w / (weights.length + 1), h)
}


function drawLayer(weights, x, y, w, h) {
  let numNeurons = weights.cols;
  let nextNeurons = new Array(weights.rows);

  let neuronSize = Math.min(w / 3, h / numNeurons);
  let maxStroke = Math.max(1, neuronSize / 6);

  //compute min and max values for the weights (used for color and stroke)
  let min, max;
  for (let i = 0; i < weights.data.length; i++) {
    for (let j = 0; j < weights.data[i].length; j++) {
      if (!min || min > weights.data[i][j]) {
        min = weights.data[i][j];
      }
      if (!max || max < weights.data[i][j]) {
        max = weights.data[i][j];
      }
    }
  }

  //compute positions of neurons in next layer (needed to draw synapses)
  for (let j = 0; j < nextNeurons.length; j++) {
    nextNeurons[j] = {xpos: x + w + (w / 2), ypos: y + h / (nextNeurons.length + 1) * (j + 1)};
  }

  fill(255);
  for (let i = 0; i < numNeurons; i++) {
    // draw neurons
    stroke(255);
    strokeWeight(1);
    let curX = x + w / 2;
    let curY = y + h / (numNeurons + 1) * (i + 1);
    ellipse(curX, curY, neuronSize, neuronSize);

    //draw synapses
    for (let j = 0; j < nextNeurons.length; j++) {
      //compute color based on weight: red for negative, green for positive
      let synWeight = weights.data[j][i];
      let red = synWeight < 0 ? map(synWeight, min, 0, 0, 255) : 0;
      let green = synWeight >= 0 ? map(synWeight, 0, max, 0, 255) : 0;
      stroke(red, green, 0);

      //bigger stroke weight for heavier weights
      strokeWeight(map(Math.abs(synWeight), 0, Math.max(max, Math.abs(min)), 0, maxStroke));

      line(curX + neuronSize / 2, curY, nextNeurons[j].xpos - neuronSize / 2, nextNeurons[j].ypos);
    }
  }

}
