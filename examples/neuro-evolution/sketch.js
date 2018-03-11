let brain;

function setup() {
  noCanvas();
  brain = new NeuralNetwork(2, 4, 1);
  console.log(brain);
  let child = brain.copy();
  child.mutate(0.01);
  // child.mutate();


}
