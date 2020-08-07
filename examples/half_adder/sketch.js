let nn;
let training_data = [{
  inputs: [0, 0],
  targets: [0,0]
}, {
  inputs: [1, 0],
  targets: [0,1]
}, {
  inputs: [0, 1],
  targets: [0,1]
}, {
  inputs: [1, 1],
  targets: [1,0]
}];

let lr_slider;

function setup() {
  createElement('h1',"Half adder example");
  createP("In this example the NN learns, how to act as half adder.")
  createP("The half adder adds two single binary digits A and B. It has two outputs, sum (S) and carry (C). The carry signal represents an overflow into the next digit of a multi-digit addition.")

  createDiv('');

  createCanvas(400, 400);
  nn = new NeuralNetwork(2, 4, 2);
  lr_slider = createSlider(0.01, 0.1, 0.01, 0.01);

  createDiv('');
  createP("example made by JonasFovea")
}

function draw() {
  background(0);

  nn.learning_rate = lr_slider.value();

  for (let i = 0; i < 100; i++) {
    let data = random(training_data);
    nn.train(data.inputs, data.targets);
  }

  let resolution = 10;
  let cols = floor(width / resolution);
  let rows = floor(height / resolution);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      let input_1 = i / (cols - 1);
      let input_2 = j / (rows - 1);
      let output = nn.predict([input_1, input_2]);
      let col1 = output[0] * 255;
      let col2 = output[1] * 255;
      let col3 = col1-col2;

      fill(col1,col2,col3);
      stroke(100,20,80);
      noStroke();
      rect(x, y, resolution, resolution);
    }
  }

}
