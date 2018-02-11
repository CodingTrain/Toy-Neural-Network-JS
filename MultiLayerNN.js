function sigmoid(x) {
  return 1/(1+Math.exp(-x));
}

function derivSigmoid(x) {
  return x*(1-x);
}


function meanError(m) {
  let sum=0;
  for(let i=0;i<m.rows;i++) {
    for(let j=0;j<m.cols;j++) {
      sum+=m.data[i][j];
    }
  }
  return sum/m.rows;
}

class NeuralNetwork {
  constructor(numInput,numOutput) {
    this.input_nodes=numInput;
    this.output_nodes=numOutput;
    this.hiddenLayers=[];
    this.hiddenLayersConfig=[];
    this.hiddenLayers.push(numInput);
  }
  addHiddenLayer(numOfNeurons) {
    this.hiddenLayers.push(numOfNeurons);
    let layerConfig={
      layerBias:new Matrix(numOfNeurons,1),
      layerWeight:new Matrix(numOfNeurons,this.hiddenLayers[this.hiddenLayers.length-2]),
    };
    layerConfig.layerBias.randomize();
    layerConfig.layerWeight.randomize();
    this.hiddenLayersConfig.push(layerConfig);
  }
  config() {
    let outputLayerConfig={
      layerBias:new Matrix(this.output_nodes,1),
      layerWeight:new Matrix(this.output_nodes,this.hiddenLayers[this.hiddenLayers.length-1]),
    };
    outputLayerConfig.layerBias.randomize();
    outputLayerConfig.layerWeight.randomize();
    this.hiddenLayersConfig.push(outputLayerConfig);
  }
  predict(input) {
    let inputLayer=Matrix.fromArray(input);
    let layers=[];
    layers.push(inputLayer);
    for(let i=0;i<this.hiddenLayersConfig.length;i++) {
      let l=Matrix.multiply(this.hiddenLayersConfig[i].layerWeight,layers[i]);
      l.add(this.hiddenLayersConfig[i].layerBias);
      l.map(sigmoid);
      layers.push(l);
    }
    return layers[layers.length-1].toArray();
  }
  train(input,output,lr,itr) {
    let inputLayer=Matrix.fromArray(input);
    let outputLayer=Matrix.fromArray(output);
    let layers=[];
    //feedForward
    layers.push(inputLayer);
    for(let i=0;i<this.hiddenLayersConfig.length;i++) {
      let l=Matrix.multiply(this.hiddenLayersConfig[i].layerWeight,layers[i]);
      l.add(this.hiddenLayersConfig[i].layerBias);
      l.map(sigmoid);
      layers.push(l);
    }
    //calculate errors
    let outputError=Matrix.subtract(outputLayer,layers[layers.length-1]);
    let meanE=meanError(outputError);
    if(itr%10000===0) {
      console.log(abs(meanE));
    }
    //calculate errors for each layer except inputLayer
    let layerErrors=[];
    layerErrors.push(outputError);
    for(let i=1;i<this.hiddenLayersConfig.length;i++) {
      let tW=Matrix.transpose(this.hiddenLayersConfig[this.hiddenLayersConfig.length-i].layerWeight);
      let layerE=Matrix.multiply(tW,layerErrors[layerErrors.length-1]);
      layerErrors.push(layerE);
    }
    //calculate gradients
    let gradients=[];
    for(let i=0;i<layerErrors.length;i++) {
      let layer=layers[(layers.length-1)-i];
      let gradientLayer=Matrix.map(layer,derivSigmoid);
      gradientLayer.multiply(layerErrors[i]);
      gradientLayer.multiply(lr);
      gradients.push(gradientLayer);
    }
    layers.splice(layers.length-1,1);
    //calculate deltaWeights
    let deltaWeights=[];
    for(let i=0;i<layers.length;i++) {
      let deltaWeight=Matrix.multiply(gradients[(gradients.length-1)-i],Matrix.transpose(layers[i]));
      deltaWeights.push(deltaWeight);
    }
    gradients.reverse();
    //change weights and biases
    for(let i=0;i<this.hiddenLayersConfig.length;i++) {
      this.hiddenLayersConfig[i].layerBias.add(gradients[i]);
      this.hiddenLayersConfig[i].layerWeight.add(deltaWeights[i]);
    }

  }
}
