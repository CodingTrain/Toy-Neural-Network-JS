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
var xorW = 400;
var xorH = 400;
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
  let cols = xorW / resolution;
  let rows = xorH / resolution;
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

nn.render(20,400,50,20,20);

}
