# Alen
# @000alen

from nn import *
from random import choice


training_data = [
	{
		"inputs": [0, 0],
		"outputs": [0]
	},
	{
		"inputs": [0, 1],
		"outputs": [1]
	},
	{
		"inputs": [1, 0],
		"outputs": [1]
	},
	{
		"inputs": [1, 1],
		"outputs": [0]
	}
]


def start():
	global nn, training_data
	nn = NeuronalNetwork(2, 4, 1)


def update():
	global nn, training_data
	for i in range(1000):
		data = choice(training_data)
		nn.train(data["inputs"], data["outputs"])
	
	item0 = input("input1: ")
	item1 = input("input2: ")

	prediction = nn.predict([item0, item1])
	print "prediction: " + str(prediction)


if __name__ == "__main__":
	start()
	while True:
		update()
