class Visualization {
    constructor(nn) {
        if(typeof p5 !== 'function') {
            throw new Error('Need to include p5js');
        } else if(!nn instanceof NeuralNetwork) {
            throw new Error('Need a instance of NeuralNetwork');
        }

        let layers = [];

        for(let layer of nn.layers) {
            layers.push(layer.nodes);
        }

        console.log('Visualization',layers);

        // this.graphics = createGraphics();
    }
}