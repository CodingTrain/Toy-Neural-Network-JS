// Other techniques for learning

class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);


class NeuralNetwork {
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    // this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    // this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    // this.weights_ih.randomize();
    // this.weights_ho.randomize();

    // Replacing with deeplearn
    this.weights_ih = dl.randomNormal([this.hidden_nodes, this.input_nodes]);
    this.weights_ho = dl.randomNormal([this.output_nodes, this.hidden_nodes]);
    this.bias_h = dl.randomNormal([this.hidden_nodes, 1]);
    this.bias_o = dl.randomNormal([this.output_nodes, 1]);

    this.setLearningRate();

    this.setActivationFunction();

  }

  predict(input_array) {

    // Generating the Hidden Outputs
    // let inputs = Matrix.fromArray(input_array);
    let inputs = dl.tensor2d(input_array, [input_array.length, 1]);

    // let hidden = Matrix.multiply(this.weights_ih, inputs);
    let hidden = dl.matMul(this.weights_ih, inputs);

    // hidden.add(this.bias_h);
    hidden = dl.add(hidden, this.bias_h);

    // activation function!
    // hidden.map(this.activation_function.func);
    hidden = dl.sigmoid(hidden);

    // Generating the output's output!
    // let output = Matrix.multiply(this.weights_ho, hidden);
    let outputs = dl.matMul(this.weights_ho, hidden);
    // output.add(this.bias_o);
    outputs = dl.add(outputs, this.bias_o);
    // output.map(this.activation_function.func);
    outputs = dl.sigmoid(outputs);

    // Sending back to the caller!
    return outputs.getValues();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = dl.scalar(learning_rate);
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  train(input_array, target_array) {
    // Generating the Hidden Outputs
    // let inputs = Matrix.fromArray(input_array);
    let inputs = dl.tensor2d(input_array, [input_array.length, 1]);

    // let hidden = Matrix.multiply(this.weights_ih, inputs);
    let hidden = dl.matMul(this.weights_ih, inputs);
    // hidden.add(this.bias_h);
    hidden = dl.add(hidden, this.bias_h);
    // activation function!
    // hidden.map(this.activation_function.func);
    hidden = dl.sigmoid(hidden);

    // Generating the output's output!
    // let output = Matrix.multiply(this.weights_ho, hidden);
    let outputs = dl.matMul(this.weights_ho, hidden);
    // output.add(this.bias_o);
    outputs = dl.add(outputs, this.bias_o);
    // output.map(this.activation_function.func);
    outputs = dl.sigmoid(outputs);

    // Convert array to matrix object
    // let targets = Matrix.fromArray(target_array);
    let targets = dl.tensor2d(target_array, [target_array.length, 1]);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = dl.sub(targets, outputs);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    // let gradients = Matrix.map(outputs, this.activation_function.dfunc);

    // TODO: use deeplearn.js gradient functions
    let gradients = dl.mul(outputs, dl.sub(dl.scalar(1), outputs));


    // gradients.multiply(output_errors);
    // gradients.multiply(this.learning_rate);
    gradients = dl.mul(gradients, output_errors).mul(this.learning_rate);

    // Calculate deltas
    // let hidden_T = Matrix.transpose(hidden);
    // let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);
    let hidden_T = dl.transpose(hidden);
    let weight_ho_deltas = dl.matMul(gradients, hidden_T);

    // Adjust the weights by deltas
    // this.weights_ho.add(weight_ho_deltas);
    this.weights_ho = dl.add(this.weights_ho, weight_ho_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    // this.bias_o.add(gradients);
    this.bias_o = dl.add(this.bias_o, gradients);

    // Calculate the hidden layer errors
    // let who_t = Matrix.transpose(this.weights_ho);
    // let hidden_errors = Matrix.multiply(who_t, output_errors);
    let who_t = dl.transpose(this.weights_ho);
    let hidden_errors = dl.matMul(who_t, output_errors);

    // Calculate hidden gradient
    // let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    let hidden_gradient = dl.mul(hidden, dl.sub(dl.scalar(1), hidden));

    // hidden_gradient.multiply(hidden_errors);
    // hidden_gradient.multiply(this.learning_rate);
    hidden_gradient = dl.mul(hidden_gradient, hidden_errors).mul(this.learning_rate);

    // Calcuate input->hidden deltas
    // let inputs_T = Matrix.transpose(inputs);
    // let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);
    let inputs_T = dl.transpose(inputs);
    let weight_ih_deltas = dl.matMul(hidden_gradient, inputs_T);

    //this.weights_ih.add(weight_ih_deltas);
    this.weights_ih = dl.add(this.weights_ih, weight_ih_deltas);

    // Adjust the bias by its deltas (which is just the gradients)
    // this.bias_h.add(hidden_gradient);
    this.bias_h = dl.add(this.bias_h, hidden_gradient);

    // outputs.print();
    // targets.print();
    // error.print();
  }

  // serialize() {
  //   return JSON.stringify(this);
  // }
  //
  // static deserialize(data) {
  //   if (typeof data == 'string') {
  //     data = JSON.parse(data);
  //   }
  //   let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
  //   nn.weights_ih = Matrix.deserialize(data.weights_ih);
  //   nn.weights_ho = Matrix.deserialize(data.weights_ho);
  //   nn.bias_h = Matrix.deserialize(data.bias_h);
  //   nn.bias_o = Matrix.deserialize(data.bias_o);
  //   nn.learning_rate = data.learning_rate;
  //   return nn;
  // }

}