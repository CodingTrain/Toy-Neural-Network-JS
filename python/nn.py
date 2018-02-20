# Alen
# @000alen

from json import loads, dumps
from math import exp, tanh
from matrix import *


class ActivationFunction:
	def __init__(self, func, dfunc):
		self.func = func
		self.dfunc = dfunc


sigmoid = ActivationFunction(
	lambda x, i, j: 1 / (1 + exp(-x)),
	lambda y, i, j: y * (1 - y)
)

tanh = ActivationFunction(
	lambda x, i, j: tanh(x),
	lambda y, i, j: 1 - (y ** 2)
)


class NeuronalNetwork:
	def __init__(self, input_nodes, hidden_nodes, output_nodes):
		self.input_nodes = input_nodes
		self.hidden_nodes = hidden_nodes
		self.output_nodes = output_nodes

		self.weights_ih = Matrix(self.hidden_nodes, self.input_nodes)
		self.weights_ho = Matrix(self.output_nodes, self.hidden_nodes)
		self.weights_ih.randomize()
		self.weights_ho.randomize()

		self.bias_h = Matrix(self.hidden_nodes, 1)
		self.bias_o = Matrix(self.output_nodes, 1)
		self.bias_h.randomize()
		self.bias_o.randomize()
		self.setLearningRate()

		self.setActivationFunction()

	def predict(self, input_array):
		inputs = Matrix.fromArray(input_array)
		hidden = Matrix.multiply(self.weights_ih, inputs)
		hidden.add(self.bias_h)

		hidden.map(self.activation_function.func)

		output = Matrix.multiply(self.weights_ho, hidden)
		output.add(self.bias_o)
		output.map(self.activation_function.func)

		return output.toArray()

	def setLearningRate(self, learning_rate = 0.1):
		self.learning_rate = learning_rate

	def setActivationFunction(self, func = sigmoid):
		self.activation_function = func

	def train(self, input_array, target_array):
		inputs = Matrix.fromArray(input_array)

		hidden = Matrix.multiply(self.weights_ih, inputs)
		hidden.add(self.bias_h)
		hidden.map(self.activation_function.func)

		outputs = Matrix.multiply(self.weights_ho, hidden)
		outputs.add(self.bias_o)
		outputs.map(self.activation_function.func)

		targets = Matrix.fromArray(target_array)

		output_errors = Matrix.subtract(targets, outputs)

		gradients = Matrix.map(outputs, self.activation_function.dfunc)
		gradients.multiply(output_errors)
		gradients.multiply(self.learning_rate)


		hidden_T = Matrix.transpose(hidden)
		weight_ho_deltas = Matrix.multiply(gradients, hidden_T)

		self.weights_ho.add(weight_ho_deltas)
		self.bias_o.add(gradients)

		who_t = Matrix.transpose(self.weights_ho)
		hidden_errors = Matrix.multiply(who_t, output_errors)

		hidden_gradient = Matrix.map(hidden, self.activation_function.dfunc)
		hidden_gradient.multiply(hidden_errors)
		hidden_gradient.multiply(self.learning_rate)

		inputs_T = Matrix.transpose(inputs)
		weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T)

		self.weights_ih.add(weight_ih_deltas)
		self.bias_h.add(hidden_gradient)

	def serialize(self):
		data = {
			"input_nodes": self.input_nodes,
			"hidden_nodes": self.hidden_nodes,
			"output_nodes": self.output_nodes,
			"weights_ih": self.weights_ih,
			"weights_ho": self.weights_ho,
			"bias_h": self.bias_h,
			"bias_o": self.bias_o,
			"learning_rate": self.learning_rate
		}
		return dumps(data)

	@staticmethod
	def deserialize(data):
		if type(data) == type(str()):		
			data = loads(data)
		nn = NeuralNetwork(data["input_nodes"], data["hidden_nodes"], data["output_nodes"])
		nn.weights_ih = Matrix.deserialize(data["weights_ih"])
		nn.weights_ho = Matrix.deserialize(data["weights_ho"])
		nn.bias_h = Matrix.deserialize(data["bias_h"])
		nn.bias_o = Matrix.deserialize(data["bias_o"])
		nn.learning_rate = data["learning_rate"]
		return nn
