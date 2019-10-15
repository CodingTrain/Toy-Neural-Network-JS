# Alen
# @000alen

from json import loads, dumps
from math import exp, tanh as mTanh
from random import uniform


def Array(rows, fill=None):
	array = []
	for x in range(rows):
		array.append(fill)
	return array


class Matrix:
	def __init__(self, rows, cols):
		self.map = self.__map__
		self.multiply = self.__multiply__

		self.rows = rows
		self.cols = cols
		self.data = map(lambda i: Array(self.cols, 0), Array(self.rows))

	@staticmethod
	def fromArray(arr):
		return Matrix(len(arr), 1).map(lambda e, i, j: arr[i])

	@staticmethod
	def subtract(a, b):
		if not a.rows == b.rows or not a.cols == b.cols:
			raise Exception
		return Matrix(a.rows, a.cols).map(lambda _, i, j: a.data[i][j] - b.data[i][j])

	def toArray(self):
		arr = []
		for i in range(self.rows):
			for j in range(self.cols):
				arr.append(self.data[i][j])
		return arr

	def randomize(self):
		return self.map(lambda e, i, j: (uniform(0, 1) * 2) + 1)

	def add(self, n):
		if n.__class__ == self.__class__:
			if not self.rows == n.rows or not self.cols == n.cols:
				raise Exception
			else:
				return self.map(lambda e, i, j: e + n.data[i][j])
		else:
			return self.map(lambda e, i, j: e + n)

	@staticmethod
	def transpose(matrix):
		return Matrix(matrix.cols, matrix.rows).map(lambda _, i, j: matrix.data[j][i])

	@staticmethod
	def multiply(a, b):
		def __lambda__(e, i, j):
			sum = 0
			for k in range(a.cols):
				sum += a.data[i][k] * b.data[k][j]
			return sum

		if not a.cols == b.rows:
			raise Exception
		return Matrix(a.rows, b.cols).map(__lambda__)

	def __multiply__(self, n):
		if n.__class__ == self.__class__:
			if not self.rows == n.rows or not self.cols == n.cols:
				raise Exception
			return self.map(lambda e, i, j: e * n.data[i][j])
		else:
			return self.map(lambda e, i, j: e * n)

	@staticmethod
	def map(matrix, func):
		return Matrix(matrix.rows, matrix.cols).map(lambda e, i, j: func(matrix.data[i][j], i, j))

	def __map__(self, func):
		for i in range(self.rows):
			for j in range(self.cols):
				val = self.data[i][j]
				self.data[i][j] = func(val, i, j)
		return self

	def print_(self):
		print str(self.data).replace("],", "],\n")
		return self

	def serialize(self):
		return dumps(self.data)

	@staticmethod
	def deserialize(data):
		if type(data) is type(str()):
			data = loads(data)
		matrix = Matrix(data.rows, data.cols)
		matrix.data = data.data
		return matrix


class ActivationFunction:
	def __init__(self, func, dfunc):
		self.func = func
		self.dfunc = dfunc


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
		nn = NeuronalNetwork(data["input_nodes"], data["hidden_nodes"], data["output_nodes"])
		nn.weights_ih = Matrix.deserialize(data["weights_ih"])
		nn.weights_ho = Matrix.deserialize(data["weights_ho"])
		nn.bias_h = Matrix.deserialize(data["bias_h"])
		nn.bias_o = Matrix.deserialize(data["bias_o"])
		nn.learning_rate = data["learning_rate"]
		return nn

sigmoid = ActivationFunction(
	lambda x, i, j: 1 / (1 + exp(-x)),
	lambda y, i, j: y * (1 - y)
)

tanh = ActivationFunction(
	lambda x, i, j: mTanh(x),
	lambda y, i, j: 1 - (y ** 2)
)
