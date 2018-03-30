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

  _walk(inputArray) {

    if(inputArray.length !== this.inputLayer.nodes) {
      throw new Error('ERROR: Input array size.');
    }

    // Convert input to array
    this.inputLayer.matrix = Matrix.fromArray(inputArray);

    // Walk
    for(let i = 0; i < this.hiddenLayers.length; i++) {
      this.hiddenLayers[i].matrix = Matrix.multiply(
        this.weightLayers[i],
        i == 0 ? this.inputLayer.matrix : this.hiddenLayers[i-1].matrix
      )
      .add(this.hiddenLayers[i].bias)
      .map(this.activationFunction.func);
    }

    let lastHiddenIndex = this.hiddenLayers.length - 1;
    let lastWeightIndex = this.weightLayers.length - 1;

    this.outputLayer.matrix = Matrix.multiply(
      this.weightLayers[lastWeightIndex],
      this.hiddenLayers[lastHiddenIndex].matrix
    )
    .add(this.outputLayer.bias)
    .map(this.activationFunction.func);

    return this.outputLayer.matrix;
  }

  predict(inputArray) {
    return this._walk(inputArray).toArray();
  }

  setLearningRate(learningRate = 0.1) {
    this.learningRate = learningRate;
  }

  setActivationFunction(func = sigmoid) {
    this.activationFunction = func;
  }

  train(inputArray, targetArray) {

    this._walk(inputArray);

    if(targetArray.length !== this.outputLayer.nodes) {
      throw new Error('ERROR: Target array size.');
    }

    let lastHiddenIndex = this.hiddenLayers.length - 1;
    let lastWeightIndex = this.weightLayers.length - 1;

    // Convert array to matrix object
    let targets = Matrix.fromArray(targetArray);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    this.outputLayer.errors = Matrix.subtract(
      targets,
      this.outputLayer.matrix
    );

    // OUTPUT LAYER -> HIDDEN LAYERS
    // Calculate gradient
    this.outputLayer.gradients = Matrix.map(
      this.outputLayer.matrix,
      this.activationFunction.dfunc
    )
    .multiply(this.outputLayer.errors)
    .multiply(this.learningRate);

    this.weightLayers[lastWeightIndex].add(
      Matrix.multiply(
        this.outputLayer.gradients,
        Matrix.transpose(
          this.hiddenLayers[lastHiddenIndex].matrix
        )
      )
    );
    this.outputLayer.bias.add(this.outputLayer.gradients);

    // HIDDEN LAYERS -> INPUT LAYER
    for(let i = lastHiddenIndex; i >= 0; i--) {

      this.hiddenLayers[i].errors = Matrix.multiply(
        Matrix.transpose(this.weightLayers[i+1]),
        i == lastHiddenIndex ? this.outputLayer.errors : this.hiddenLayers[i+1].errors
      );

      this.hiddenLayers[i].gradients = Matrix.map(
        this.hiddenLayers[i].matrix,
        this.activationFunction.dfunc
      )
      .multiply(this.hiddenLayers[i].errors)
      .multiply(this.learningRate);

      this.weightLayers[i].add(
        Matrix.multiply(
          this.hiddenLayers[i].gradients,
          Matrix.transpose(
            i == 0 ? this.inputLayer.matrix : this.hiddenLayers[i-1].matrix
          )
        )
      );
      this.hiddenLayers[i].bias.add(this.hiddenLayers[i].gradients);
    }
  }

  serialize() {
    return JSON.stringify(this);
  }

  // TODO: convert to multi-hidden layers
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

  // TODO: convert to multi-hidden layers
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
