// NEXT TO DO
// REDO gradient descent video about
// delta weight formulas, connect to "mathematics of gradient" video
// Implment gradient descent in library / with code
// Talk about different activation function
// XOR coding challenge
// MNIST coding challenge

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(x) {
  let y = sigmoid(x);
  return y * (1 - y);
}

function alreadySigmoided(x) {
  return x * (1 - x);
}


class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();
  }

  feedforward(input_array) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(sigmoid);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid);

    // Sending back to the caller!
    return output.toArray();
  }

  train(inputs, targets) {
    //let outputs = this.feedforward(inputs);

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(sigmoid);

    // Generating the output's output!
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);

    // Convert array to matrix object
    targets = Matrix.fromArray(targets);

    let lr = 0.1;

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs);

    // Change hidden to output weights gradient descent
    let d_outputs = Matrix.map(outputs, alreadySigmoided);
    d_outputs.multiply(output_errors);
    d_outputs.multiply(lr);
    let hidden_T = Matrix.transpose(hidden);
    let delta_weights = Matrix.multiply(d_outputs, hidden_T);
    delta_weights.print()
    this.weights_ho.add(delta_weights);

    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);





    // outputs.print();
    // targets.print();
    // error.print();
  }

}
