# Toy-Neural-Network-JS [![Build Status](https://circleci.com/gh/CodingTrain/Toy-Neural-Network-JS.png?&style=shield&circle-token=:circle-token)](https://circleci.com/gh/CodingTrain/Toy-Neural-Network-JS)

Neural Network JavaScript library for Coding Train tutorials

## Examples / Demos
Here are some demos running directly in the browser:
* [XOR problem](https://codingtrain.github.io/Toy-Neural-Network-JS/examples/xor/)
* [Handwritten digit recognition](https://codingtrain.github.io/Toy-Neural-Network-JS/examples/mnist/)

## To-Do List

* [x] Redo gradient descent video about
* [x] Delta weight formulas, connect to "mathematics of gradient" video
* [x] Implement gradient descent in library / with code
* [x] XOR coding challenge [live example](https://codingtrain.github.io/Toy-Neural-Network-JS/examples/xor/)
* [ ] MNIST coding challenge [live example](https://codingtrain.github.io/Toy-Neural-Network-JS/examples/mnist/)
    * redo this challenge
    * cover softmax activation, cross-entropy
    * graph cost function?
    * only use testing data
* [ ] Support for saving / restoring network (see [#50](https://github.com/CodingTrain/Toy-Neural-Network-JS/pull/50))
* [ ] Support for different activation functions (see [#45](https://github.com/CodingTrain/Toy-Neural-Network-JS/pull/45), [#62](https://github.com/CodingTrain/Toy-Neural-Network-JS/pull/62))
* [ ] Support for multiple hidden layers (see [#61](https://github.com/CodingTrain/Toy-Neural-Network-JS/pull/61))
* [ ] Support for neuro-evolution
    * [ ] play flappy bird (many players at once). 
    * [ ] play pong (many game simulations at once)
    * [ ] steering sensors (a la Jabril's forrest project!)
* [ ] Combine with ml5 / deeplearnjs

## Getting Started

If you're looking for the original source code to match the videos [visit this repo](https://github.com/CodingTrain/Rainbow-Code/tree/master/Courses/natureofcode/10.18-toy_neural_network)

### Prerequisites

You need to have the following installed:

1. Nodejs
2. NPM
3. Install the NodeJS dependencies via the following command:

```
npm install
```

### Installing

This Project doesn't require any additional Installing steps

### Documentation

* `NeuralNetwork` - The neural network class
  * `predict(input_array)` - Returns the output of a neural network
  * `train(input_array, target_array)` - Trains a neural network

## Running the tests

The Tests can either be checked via the automaticly running CircleCI Tests or you can also run `npm test` on your PC after you have done the Step "Prerequisites"

## Built With

* [Nodejs](https://nodejs.org/) - The code language used
* [CircleCI](https://circleci.com/) - Automated Test Service
* [Jest](https://facebook.github.io/jest/) - Testing Framework used

## Contributing

Please send PullRequests. These need to pass a automated Test first and after it will get reviewed and on that review either denied or accepted.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/CodingTrain/Toy-Neural-Network-JS/tags).

## Authors

* **shiffman** - *Initial work* - [shiffman](https://github.com/shiffman)

See also the list of [contributors](https://github.com/CodingTrain/Toy-Neural-Network-JS/contributors) who participated in this project.

## License

This project is licensed under the terms of the MIT license, see LICENSE.
