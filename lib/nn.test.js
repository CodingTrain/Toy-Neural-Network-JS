//const Matrix = require('./matrix');
const {
  NeuralNetwork,
} = require('./nn');

test('XOR Feed forward 100 times (NN [2,4,1], lr = 0.1)', () => {
  const defaultNN = '{"input_nodes":2,"hidden_nodes":4,"output_nodes":1,"weights_ih":{"rows":4,"cols":2,"data":[[-0.67573921323278,-0.6631309040105413],[0.12043373460672324,0.9164706630341213],[0.8065050836856171,0.6200864007638192],[0.17026959573001887,0.8558180147448349]]},"weights_ho":{"rows":1,"cols":4,"data":[[0.25208907823805715,-0.15513622033337615,-0.7593404409594813,-0.2200931714640979]]},"bias_h":{"rows":4,"cols":1,"data":[[-0.35555433502368805],[0.5915246859082983],[0.7931155122071059],[-0.5196051276393758]]},"bias_o":{"rows":1,"cols":1,"data":[[0.16280502479816095]]},"learning_rate":0.1,"activation_function":{}}';

  const training_data = [{
      inputs: [0, 0],
      outputs: [0]
    },
    {
      inputs: [0, 1],
      outputs: [1]
    },
    {
      inputs: [1, 0],
      outputs: [1]
    },
    {
      inputs: [1, 1],
      outputs: [0]
    }
  ];

  const targetNN = '{"input_nodes":2,"hidden_nodes":4,"output_nodes":1,"weights_ih":{"rows":4,"cols":2,"data":[[-0.569756962028276,-0.5551249563852504],[0.12350867790872079,0.9117849077336435],[0.6448544388169963,0.37673042356680453],[0.15511871409391612,0.8289329770778586]]},"weights_ho":{"rows":1,"cols":4,"data":[[0.25671912531734464,0.02490177829691785,-0.537758005494704,-0.10072084075558174]]},"bias_h":{"rows":4,"cols":1,"data":[[-0.28493369112696326],[0.6027906492507047],[0.7374757365358221],[-0.5460077788408344]]},"bias_o":{"rows":1,"cols":1,"data":[[0.37380624852136013]]},"learning_rate":0.1,"activation_function":{}}';

  let nn = NeuralNetwork.deserialize(defaultNN);

  for (let i = 0; i < (training_data.length * 100); i++) {
    let index = i % training_data.length;
    let data = training_data[index];
    nn.train(data.inputs, data.outputs);
  }
  expect(nn.serialize()).toEqual(targetNN);
});
