function setup() {
  let nn = new NeuralNetwork(2, 2, 2);
  let inputs = [1, 0];
  let targets = [1, 0];
  //let output = nn.feedforward(input);

  nn.train(inputs, targets);



  //console.log(output);
}
