const NeuralNetwork = require('./nn')

let brain = new NeuralNetwork(2, 2, 1)
test('can create a neural network', () => {
    expect(brain).toBeDefined()
})

test('can predict something', () => {
    let guess = brain.predict([0.5, 0.5]);
    expect(guess).toHaveLength(1);
    expect(guess[0]).toBeGreaterThanOrEqual(0);
    expect(guess[0]).toBeLessThanOrEqual(1);
})

test('can train without crashing', () => {
    let input = [0.5, 0.5]
    let guess = brain.predict(input);
    brain.train(input, [0.5]);
    let secondGuess = brain.predict(input);
    expect(guess[0]).not.toEqual(secondGuess[0]);
})
