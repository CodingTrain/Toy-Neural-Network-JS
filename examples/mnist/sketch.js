let mnist;


let train_index = 0;

// testing variables
let test_index = 0;
let total_tests = 0;
let total_correct = 0;



let nn;
let train_image;

let user_digit;
let user_has_drawing = false;

let user_guess_ele;
let percent_ele;

function setup() {
  createCanvas(400, 200).parent('container');
  nn = new NeuralNetwork(784, 64, 10);
  user_digit = createGraphics(200, 200);
  user_digit.pixelDensity(1);

  train_image = createImage(28, 28);

  user_guess_ele = select('#user_guess');
  percent_ele = select('#percent');

  loadMNIST(function(data) {
    mnist = data;
    console.log(mnist);
  });
}

function train(show) {
  let inputs = [];
  if (show) {
    train_image.loadPixels();
  }
  for (let i = 0; i < 784; i++) {
    let bright = mnist.train_images[train_index][i];
    inputs[i] = bright / 255;
    if (show) {
      let index = i * 4;
      train_image.pixels[index + 0] = bright;
      train_image.pixels[index + 1] = bright;
      train_image.pixels[index + 2] = bright;
      train_image.pixels[index + 3] = 255;
    }
  }
  if (show) {
    train_image.updatePixels();
    image(train_image, 200, 0, 200, 200);
  }

  // Do the neural network stuff;
  let label = mnist.train_labels[train_index];
  let targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  targets[label] = 1;

  // console.log(inputs);
  // console.log(targets);

  //console.log(train_index);

  let prediction = nn.predict(inputs);
  let guess = findMax(prediction);

  nn.train(inputs, targets);
  train_index = (train_index + 1) % mnist.train_labels.length;
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
    test_index = 0;
    console.log('finished test set');
    console.log(percent);
    total_tests = 0;
    total_correct = 0;
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
  //image(user, 0, 0);


  if (mnist) {
    let total1 = 5;
    for (let i = 0; i < total1; i++) {
      if (i == total1 - 1) {
        train(true);
      } else {
        train(false);
      }
    }
    let total2 = 25;
    for (let i = 0; i < total2; i++) {
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
