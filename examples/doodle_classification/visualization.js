class Visualization {

    static _check(nn) {
        if(typeof p5 !== 'function') {
            throw new Error('Need to include p5js');
        } else if(!nn instanceof NeuralNetwork) {
            throw new Error('Need a instance of NeuralNetwork');
        }
    }

    static _getLayers(nn) {
        let layers = [];

        for(let layer of nn.layers) {
            layers.push(layer.nodes);
        }

        return layers;
    }

    static graphics(nn) {
        this._check(nn);

        let layers = this._getLayers(nn);

        let w = floor(layers.length * 20);
        let h = floor(layers[0] * 20);

        let graphics = createGraphics(w,h);

        console.log(graphics.width, graphics.height);

        return graphics;

    }
}