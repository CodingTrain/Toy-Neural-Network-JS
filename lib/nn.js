// Other techniques for learning

class ActivationFunction {
    constructor(func, dfunc, use_X_values = false) {
        this.func = func;
        this.dfunc = dfunc;
        this.use_X_values = use_X_values;
    }
}

// Range (0, 1)
let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
);

// Range (-1, 1)
let tanh = new ActivationFunction(
    x => Math.tanh(x),
    y => 1 - (y * y)
);

// Range (-PI/2, PI/2)
let arctan = new ActivationFunction(
    x => Math.atan(x),
    y => 1 / ((y * y) + 1),
    use_X_values = true
);

// Range (-1, 1)
let softsign = new ActivationFunction(
    x => x / (1 + Math.abs(x)),
    y => 1 / Math.pow((Math.abs(y) + 1), 2),
    use_X_values = true
);

// Range [0, INFINITY)
let relu = new ActivationFunction(
    x => x < 0 ? 0 : x,
    y => y < 0 ? 0 : 1,
    use_X_values = true
);

// Range (-INFINITY, INFINITY)
let leaky_relu = new ActivationFunction(
    x => x < 0 ? 0.01 * x : x,
    y => y < 0 ? 0.01 : 1,
    use_X_values = true
);

// Range (0, INFINITY)
let softplus = new ActivationFunction(
    x => Math.log(1 + Math.exp(x)),
    y => 1 / (1 + Math.exp(-y)),
    use_X_values = true
);

// Range (0, 1]
let gaussian = new ActivationFunction(
    x => Math.exp(-1 * (x * x)),
    y => -2 * y * Math.exp(-1 * (y * y)),
    use_X_values = true
);


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
        this.setLearningRate();

        this.activation_function = sigmoid;
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

    setLearningRate(learning_rate = 0.1) {
        this.learning_rate = learning_rate;
    }

    setActivationFunction(func) {
        this.activation_function = func;
        // console.log(func);
    }

    train(input_array, target_array) {
        // Generating the Hidden Outputs
        let inputs = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        // Create Copy of hidden matrix if needed.
        let xHidden;
        if (this.activation_function.use_X_values) {
            xHidden = Matrix.duplicate(hidden)
        }
        // activation function!
        hidden.map(this.activation_function.func);

        // Generating the output's output!
        let outputs = Matrix.multiply(this.weights_ho, hidden);
        outputs.add(this.bias_o);
        // Create Copy of outputs matrix if needed.
        let xOutputs;
        if (this.activation_function.use_X_values) {
            xOutputs = Matrix.duplicate(outputs)
        }
        outputs.map(this.activation_function.func);

        // Convert array to matrix object
        let targets = Matrix.fromArray(target_array);

        // Calculate the error
        // ERROR = TARGETS - OUTPUTS
        let output_errors = Matrix.subtract(targets, outputs);

        // let gradient = outputs * (1 - outputs);
        // Calculate gradient

        let gradients;
        if (this.activation_function.use_X_values) {
            gradients = Matrix.map(xOutputs, this.activation_function.dfunc);
        } else {
            gradients = Matrix.map(outputs, this.activation_function.dfunc);
        }
        gradients.multiply(output_errors);
        gradients.multiply(this.learning_rate);


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
        let hidden_gradient;
        if (this.activation_function.use_X_values) {
            hidden_gradient = Matrix.map(xHidden, this.activation_function.dfunc);
        } else {
            hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
        }
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
}