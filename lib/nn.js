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
  /**
   * Constructor method.
   * 
   * The user can enter with parameters (integer) to create a new NeuralNetwork,
   * where: the first parameter represents the number of inputs, the second
   * (or more) parameter represents the number of hidden nodes and the last
   * parameter represents the number of outputs of the network.
   * The user can copy an instance of NeuralNetwork by passing the same as an
   * argument to the constructor.
   * 
   * @param {NeuralNetwork|...Integer} args (Rest parameters)
   */
  constructor(...args) {

    this.hiddenLayers = [];
    this.weightLayers = [];

    if (args.length === 1 && args[0] instanceof NeuralNetwork) {

      let nn = args[0];

      // INPUT LAYER
      this.inputLayer = {
        nodes: nn.inputLayer.nodes
      };

      // HIDDEN LAYERS
      for(let hidden of nn.hiddenLayers) {
        this.hiddenLayers.push({
          nodes: hidden.nodes,
          bias: hidden.bias.copy()
        });
      }

      // OUTPUT LAYER
      this.outputLayer = {
        nodes: nn.outputLayer.nodes,
        bias: nn.outputLayer.bias.copy()
      };

      // WEIGHTS CONNECTIONS
      for(let weight of nn.weightLayers) {
        this.weightLayers.push(
          weight.copy()
        );
      }

    } else if(args.length >= 3) {

      // CHECK ARGUMENTS
      if(!args.every( v => Number.isInteger(v) )) {
        throw new Error('All arguments must be integer.');
      }

      // INPUT LAYER
      this.inputLayer = {
        nodes: args[0]
      };

      let lastIndex = args.length-1;

      // HIDDEN LAYERS
      for(let i = 1; i < lastIndex; i++) {
        let nodes = args[i];
        this.hiddenLayers.push({
          nodes: nodes,
          bias: new Matrix(nodes, 1).randomize()
        });
      }

      // OUTPUT LAYER
      this.outputLayer = {
        nodes: args[lastIndex],
        bias: new Matrix(args[lastIndex], 1).randomize()
      };

      // WEIGHTS CONNECTIONS
      let connections = lastIndex;
      for(let i = 0; i < connections; i++) {
        let primaryNodes   = args[i],
            secondaryNodes = args[i+1];
        this.weightLayers.push(
          new Matrix(secondaryNodes, primaryNodes).randomize()
        );
      }

    } else {

      throw new Error('Invalid arguments. Read the documentation!');
    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();
  }

  predict(input_array) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    // Sending back to the caller!
    return output.toArray();
  }

  setLearningRate(learningRate = 0.1) {
    this.learningRate = learningRate;
  }

  setActivationFunction(func = sigmoid) {
    this.activationFunction = func;
  }

  train(inputArray, targetArray) {

    if(inputArray.length !== this.inputLayer.nodes ||
      targetArray.length !== this.outputLayer.nodes) {

      throw new Error('Array size error.');
    }

    // Generating the Hidden Outputs
    this.inputLayer.matrix = Matrix.fromArray(inputArray);

    let lastHiddenIndex;
    let lastWeightIndex;

    for(let i = 0; i < this.hiddenLayers.length; i++) {
      this.hiddenLayers[i].matrix = Matrix.multiply(
        this.weightLayers[i],
        i == 0 ? this.inputLayer.matrix : this.hiddenLayers[i-1].matrix
      )
      .add(this.hiddenLayers[i].bias)
      // activation function!
      .map(this.activationFunction.func);

      lastHiddenIndex = i;
      lastWeightIndex = i + 1;
    }

    // Generating the output's output!
    this.outputLayer.matrix = Matrix.multiply(
      this.weightLayers[lastWeightIndex],
      this.hiddenLayers[lastHiddenIndex].matrix
    )
    .add(this.outputLayer.bias)
    .map(this.activationFunction.func);

    // Convert array to matrix object
    let targets = Matrix.fromArray(targetArray);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let outputErrors = Matrix.subtract(targets, this.outputLayer.matrix);


    // OUTPUT LAYER -> HIDDEN LAYERS
    // Calculate gradient
    this.outputLayer.gradients = Matrix.map(
      this.outputLayer.matrix,
      this.activationFunction.dfunc
    )
    .multiply(outputErrors)
    .multiply(this.learningRate);

    this.weightLayers[lastWeightIndex].add(
      Matrix.multiply(
        this.outputLayer.gradients,
        Matrix.transpose(
          this.hiddenLayers[lastHiddenIndex]
        )
      )
    );
    this.outputLayer.bias.add(this.outputLayer.gradients);

    // HIDDEN LAYERS -> INPUT LAYER
    for(let i = lastHiddenIndex; i >= 0; i--) {

      let hiddenErrors = Matrix.multiply(
        Matrix.transpose(this.weightLayers[i+1]),
        outputErrors
      );

      this.hiddenLayers[i].gradients = Matrix.map(
        this.hiddenLayers[i].matrix,
        this.activationFunction.dfunc
      )
      .multiply(hiddenErrors)
      .multiply(this.learningRate);

      this.weightLayers[i].add(
        Matrix.multiply(
          this.hiddenLayers[i].gradients,
          Matrix.transpose(
            i == 0 ? this.inputLayer.matrix : this.hiddenLayers[i-1]
          )
        )
      );
      this.hiddenLayers[i].bias.add(this.hiddenLayers[i].gradients);
    }



    /*
    // Calculate deltas
    let hidden_T = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

    // Adjust the weights by deltas
    this.weights_ho.add(weight_ho_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);
    

    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    // Calcuate input->hidden deltas
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    this.weights_ih.add(weight_ih_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h.add(hidden_gradient);

    // outputs.print();
    // targets.print();
    // error.print();
    */
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  mutate(rate) {
    function mutate(val) {
      if (Math.random() < rate) {
        return Math.random() * 1000 - 1;
      } else {
        return val;
      }
    }
    this.weights_ih.map(mutate);
    this.weights_ho.map(mutate);
    this.bias_h.map(mutate);
    this.bias_o.map(mutate);
  }
}
