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
   * @param {NeuralNetwork|Array|...Integer} args (Rest parameters)
   */
  constructor(...args) {

    if(args.length === 1 && args[0] instanceof NeuralNetwork) {

      let layers = [];

      for(let layer of args[0].layers) {
        layers.push(layer.nodes);
      }

      this._build(layers, args[0].learningRate);

      for(let i = 0; i < this.connections.length; i++) {
        this.connections[i].weights = args[0].connections[i].weights.copy();
        this.connections[i].bias    = args[0].connections[i].bias.copy();
      }

    } else if(args.length === 1 && Array.isArray(args[0])) {

      this._build(args[0]);

    } else if(args.length === 3 && Number.isInteger(args[0]) &&
      Array.isArray(args[1]) && Number.isInteger(args[2])) {

      let layers = [];

      layers.push(args[0]);

      for(let arg of args[1]) {
        layers.push(arg);
      }

      layers.push(args[2]);

      this._build(layers);

    } else if(args.length >= 3) {

      this._build(args);

    } else {

      throw new Error('Invalid arguments. Read the documentation!');
    }
  }

  // PRIVATE
  _build(layers, learningRate = 0.1) {

    if(!Array.isArray(layers)) {
      throw new Error('Must be array of nodes.');
    } else if(!layers.every( value => Number.isInteger(value) )) {
      throw new Error('All arguments must be integer.');
    }

    this.learningRate = learningRate;
    this.activationFunction = sigmoid;

    this.layers = [];
    this.connections = [];

    for(let nodes of layers) {
      this.layers.push({
        nodes: nodes
      });
    }

    for(let i = 0; i < this.layers.length - 1; i++) {
      let primaryNodes   = this.layers[i].nodes,
          secondaryNodes = this.layers[i+1].nodes;
      this.connections.push({
        weights: new Matrix(secondaryNodes, primaryNodes).randomize(),
        bias: new Matrix(secondaryNodes, 1).randomize()
      });
    }
  }

  _walk(inputs) {

    this.inputs = inputs;

    for(let i = 0; i < this.connections.length; i++) {
      this.layers[i+1].results = Matrix.multiply(
        this.connections[i].weights,
        i === 0 ? this.inputs : this.layers[i].results
      )
      .add(this.connections[i].bias)
      .map(this.activationFunction.func);
    }

    return this.outputs;
  }

  // PUBLIC
  train(inputs, targets) {

    this._walk(inputs);

    // TODO: Handle errors
    if(targets.length !== this.outputsNodes) {
      throw new Error('ERROR: Target array size.');
    }

    // Backpropagation
    for(let i = this._outputsIndex; i > 0; i--) {

      if(i === this._outputsIndex) {

        this.layers[i].errors = Matrix.subtract(
          Matrix.fromArray(targets),
          this.outputs
        );

      } else {

        this.layers[i].errors = Matrix.multiply(
          Matrix.transpose(
            this.connections[i].weights
          ),
          this.layers[i+1].errors
        );
      }

      let gradients = Matrix.map(
        this.layers[i].results,
        this.activationFunction.dfunc
      )
      .multiply(this.layers[i].errors)
      .multiply(this.learningRate);

      let deltas = Matrix.multiply(
        gradients,
        Matrix.transpose(i === 1 ? this.inputs : this.layers[i-1].results)
      );

      this.connections[i-1].weights.add(deltas);
      this.connections[i-1].bias.add(gradients);
    }
  }

  predict(inputs) {
    return this._walk(inputs).toArray();
  }

  copy() {
    return new NeuralNetwork(this);
  }

  serialize() {
    let nn = this.copy();
    delete nn._activationFunction;

    for(let layer of nn.layers) {
      delete layer.matrix;
      delete layer.results;
      delete layer.errors;
    }

    return JSON.stringify(nn);
  }

  mutate(rate) {

    if(Number(rate) !== rate || !(0 < rate && rate <= 1)) {
      throw new Error('Mutate rate must be a number > 0 and <= 1.');
    }

    let mutate = value => {
      if(Math.random() < rate) {
        return Math.random() * 1000 - 1;
      } else {
        return value;
      }
    };

    for(let connection of this.connections) {
      connection.weights.map(mutate);
      connection.bias.map(mutate);
    }
  }

  // SETTERS
  set inputs(inputs) {

    if(!Array.isArray(inputs)) {
      throw new Error('Inputs must be array.');
    } else if(inputs.length !== this.inputsNodes) {
      throw new Error('Inputs size.');
    } else if(!inputs.every( val => true )) { // TODO: Check if is float number
      throw new Error('Inputs value must be a number.');
    }

    this.layers[this._inputsIndex].matrix = Matrix.fromArray(inputs);
  }

  set learningRate(rate) {

    if(Number(rate) !== rate) {
      throw new Error('Learning rate must be a number');
    }

    this._learningRate = rate;
  }

  set activationFunction(func) {

    if(!func instanceof ActivationFunction) {
      throw new Error('Activation function must be a instance of ActivationFunction.');
    }

    this._activationFunction = func;
  }

  // GETTERS
  get _inputsIndex() {
    return 0;
  }

  get _outputsIndex() {
    return this.layers.length - 1;
  }

  get inputsNodes() {
    return this.layers[this._inputsIndex].nodes;
  }

  get inputs() {
    return this.layers[this._inputsIndex].matrix;
  }

  get outputsNodes() {
    return this.layers[this._outputsIndex].nodes;
  }

  get outputs() {
    return this.layers[this._outputsIndex].results;
  }

  get learningRate() {
    return this._learningRate;
  }

  get activationFunction() {
    return this._activationFunction;
  }

  // STATIC
  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }

    let args = [null];

    for(let layer of data.layers) {
      args.push(layer.nodes);
    }

    let nn = new (Function.prototype.bind.apply(this, args));

    nn.learningRate = data._learningRate;

    for(let i = 0; i < nn.connections.length; i++) {
      nn.connections[i].weights = Matrix.deserialize(data.connections[i].weights);
      nn.connections[i].bias    = Matrix.deserialize(data.connections[i].bias);
    }

    return nn;
  }
}
