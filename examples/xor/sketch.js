let nn;
let lr_slider;

// Training\testing data
const training_data = [{
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
  createCanvas(400, 400);
  nn = new NeuralNetwork(2, 4, 1);
  lr_slider = createSlider(0.01, 0.5, 0.1, 0.01);
  colorMode(HSB);
  noStroke();
}


function draw() {
  background(0);
  for (let i = 0; i < 10; i++) {
    const data = random(training_data);
    nn.train(data.inputs, data.outputs);
  }
  nn.setLearningRate(lr_slider.value());
  const resolution = 5;
  const cols = width / resolution;
  const rows = height / resolution;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x1 = i / cols;
      const x2 = j / rows;
      const inputs = [x1, x2];
      const y = nn.predict(inputs);
      fill(y * 360, 100, 100);
      rect(i * resolution, j * resolution, resolution, resolution);
    }
  }
}
