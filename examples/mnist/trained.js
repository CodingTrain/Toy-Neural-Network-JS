let mnist;
let data;

// testing variables
let test_index = 0;
let total_tests = 0;
let total_correct = 0;
let do_testing = true;

let nn;

let user_digit;
let user_has_drawing = false;

let user_guess_ele;
let percent_ele;

function preload() {
  data = loadJSON('trained-neuralnetwork.json');
}

function setup() {
  createCanvas(200, 200).parent('container');
  nn = NeuralNetwork.deserialize(data);
  user_digit = createGraphics(200, 200);
  user_digit.pixelDensity(1);

  user_guess_ele = select('#user_guess');
  percent_ele = select('#percent');

  loadMNIST(function(data) {
    mnist = data;
  });
}

function testing() {
  let inputs = [];
  for (let i = 0; i < 784; i++) {
    let bright = mnist.test_images[test_index][i];
    inputs[i] = bright / 255;
  }
  let label = mnist.test_labels[test_index];

  let prediction = nn.predict(inputs);
  let guess = findMax(prediction);
  total_tests++;
  if (guess == label) {
    total_correct++;
  }

  let percent = 100 * (total_correct / total_tests);
  percent_ele.html(nf(percent, 2, 2) + '%');

  test_index++;
  if (test_index == mnist.test_labels.length) {
    do_testing = false;
    console.log('finished test set');
    console.log(percent);
  }
}

function guessUserDigit() {
  let img = user_digit.get();
  if(!user_has_drawing) {
    user_guess_ele.html('_');
    return img;
  }
  let inputs = [];
  img.resize(28, 28);
  img.loadPixels();
  for (let i = 0; i < 784; i++) {
    inputs[i] = img.pixels[i * 4] / 255;
  }
  let prediction = nn.predict(inputs);
  let guess = findMax(prediction);
  user_guess_ele.html(guess);
  return img;
}

function draw() {
  background(0);

  let user = guessUserDigit();
  if (mnist && do_testing) {
    let total = 25;
    for (let i = 0; i < total; i++) {
      testing();
    }
  }
  image(user_digit, 0, 0);

  if (mouseIsPressed) {
    user_has_drawing = true;
    user_digit.stroke(255);
    user_digit.strokeWeight(16);
    user_digit.line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function keyPressed() {
  if (key == ' ') {
    user_has_drawing = false;
    user_digit.background(0);
  }
}

function findMax(arr) {
  let record = 0;
  let index = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > record) {
      record = arr[i];
      index = i;
    }
  }
  return index;
}
