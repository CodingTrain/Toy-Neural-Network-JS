# Alen
# @000alen

from json import loads, dumps
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
		if type(data) == type(str()):
			data = loads(data)
		matrix = Matrix(data.rows, data.cols)
		matrix.data = data.data
		return matrix
