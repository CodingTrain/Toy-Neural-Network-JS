# Toy-Neural-Network-JS ![Build Status](https://circleci.com/gh/CodingTrain/Toy-Neural-Network-JS.png?&style=shield&circle-token=:circle-token)

Neural Network JavaScript library for Coding Train tutorials

## To-Do List

* [x] Redo gradient descent video about
* [x] Delta weight formulas, connect to "mathematics of gradient" video
* [x] Implement gradient descent in library / with code
* [x] XOR coding challenge
* [x] MNIST coding challenge
* [ ] Support for saving / restoring network (see #50)
* [ ] Support for different activation functions (see #45)
* [ ] Support for neuro-evolution
    * [ ] play flappy bird (many players at once). 
    * [ ] play pong (many game simulations at once)
    * [ ] steering sensors (a la Jabril's forrest project!)
* [ ] Support for multiple hidden layers
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
