let Matrix = require("./matrix")

class NeuralNetwork {
  constructor(arr, lr) {
    this.nodes = arr
    this.lr = lr || 0.01
    this.activation = NeuralNetwork.sigmoid
    this.dactivation = NeuralNetwork.dsigmoid
    this.weights = []
    this.biases = []
    for (let i = 0; i < this.nodes.length - 1; i++) {
      this.weights.push(new Matrix(this.nodes[i + 1], this.nodes[i]).randomize())
    }
    for (let i = 1; i < this.nodes.length; i++) {
      this.biases.push(new Matrix(this.nodes[i], 1).randomize())
    }
  }
  static tanh(x) {
    var y = Math.tanh(x);
    return y;
  }
  static dtanh(x) {
    var y = 1 / (pow(Math.cosh(x), 2));
    return y;
  }
  static sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  static dsigmoid(y) {
    // return sigmoid(x) * (1s - sigmoid(x));
    return y * (1 - y);
  }
  query(input_arr) {
    let input = Matrix.fromArray(input_arr)
    for (let i = 0; i < this.weights.length; i++) {
      input = Matrix.multiply(this.weights[i], input)
      input.add(this.biases[i])
      input.map(this.activation)
    }
    return input.toArray()
  }
  learn(input_arr, target_arr) {
    let target = Matrix.fromArray(target_arr)
    let output = Matrix.fromArray(this.query(input_arr))
    let O = []
    let input = Matrix.fromArray(input_arr)
    for (let i = 0; i < this.weights.length; i++) {
      O.push(input)
      input = Matrix.multiply(this.weights[i], input)
      input.add(this.biases[i])
      input.map(this.activation)
    }
    let error = Matrix.subtract(target, output)
    let gradient = Matrix.map(output, this.dactivation)
    gradient.multiply(error)
    gradient.multiply(this.lr)
    for (let i = O.length - 1; i >= 0; i--) {
      let dw = Matrix.multiply(gradient, Matrix.transpose(O[i]))
      this.weights[i].add(dw)
      this.biases[i].add(gradient)
      error = Matrix.multiply(Matrix.transpose(this.weights[i]), error)
      gradient = Matrix.map(O[i], this.dactivation)
      gradient.multiply(error)
      gradient.multiply(this.lr)
    }
  }
  getModel() {
    let model = this
    let k = {
      nodes: model.nodes,
      lr: model.lr,
      activation: model.activation,
      dactivation: model.dactivation,
      weights: [],
      biases: []
    }
    for (let weight of model.weights) {
      let s = {
        rows: weight.rows,
        cols: weight.cols,
        data: []
      }
      for (let d of weight.data) {
        let a = []
        for (let l of d) {
          a.push(l)
        }
        s.data.push(a)
      }
      k.weights.push(s)
    }
    for (let bias of model.biases) {
      let s = {
        rows: bias.rows,
        cols: bias.cols,
        data: bias.data
      }
      k.biases.push(s)
    }
    return k
  }
  static formModel(model) {
    let nn = new NeuralNetwork(model.nodes, model.lr)
    nn.nodes = model.nodes
    nn.lr = model.lr
    nn.activation = model.activation
    nn.dactivation = model.dactivation
    for (let i = 0; i < nn.weights.length; i++) {
      nn.weights[i].rows = model.weights[i].rows
      nn.weights[i].cols = model.weights[i].cols
      for (let j = 0; j < model.weights[i].rows; j++) {
        for (let k = 0; k < model.weights[i].cols; k++) {
          nn.weights[i].data[j][k] = model.weights[i].data[j][k]
        }
      }
      nn.weights[i].rows = model.weights[i].rows
    }
    return nn
  }
  copy() {
    let model = this.getModel()
    return NeuralNetwork.formModel(model)
  }
  mutate(func) {
    for (let weight of this.weights) {
      weight.map(func)
    }
    for (let bias of this.biases) {
      bias.map(func)
    }
  }
  merge(net, ratio = 0.5){
    let r1 = 1- ratio
    let r2 = ratio
    for(let i=0; i<this.nodes.length; i++){
      if(this.nodes[i] != net.nodes[i]){
        console.error("Neural Networks can not be merged")
        return 
      }
    }
    this.lr = (this.lr*r1)+(net.lr*r2)
    for(let i=0; i<this.weights.length; i++){
      for (let j = 0; j < this.weights[i].rows; j++) {
        for (let k = 0; k < this.weights[i].cols; k++) {
          this.weights[i].data[j][k] = (this.weights[i].data[j][k]*r1)+(net.weights[i].data[j][k]*r2)
        }
      }
    }
    for (let i = 0; i < this.biases.length; i++) {
      for (let j = 0; j < this.biases[i].rows; j++) {
        for (let k = 0; k < this.biases[i].cols; k++) {
          this.biases[i].data[j][k] = (this.biases[i].data[j][k] * r1) + (net.biases[i].data[j][k] * r2)
        }
      }
    }
    return this
  }
  setActivation(activation, dactivation) {
    this.activation = activation
    this.dactivation = dactivation
  }
  setLearningRate(lr) {
    this.lr = lr
  }
}
if (typeof exports === 'object') module.exports = NeuralNetwork
