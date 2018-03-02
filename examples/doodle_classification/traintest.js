function trainEpoch(training) {
  shuffle(training, true);
  //console.log(training);
  // Train for one epoch
  for (let i = 0; i < training.length; i++) {
    let data = training[i];
    let inputs = Array.from(data).map(x => x / 255);
    let label = training[i].label;
    let targets = [0, 0, 0];
    targets[label] = 1;
    // console.log(inputs);
    // console.log(targets);
    nn.train(inputs, targets);
  }
}

function testAll(testing) {

  let correct = 0;
  // Train for one epoch
  for (let i = 0; i < testing.length; i++) {
    // for (let i = 0; i < 1; i++) {
    let data = testing[i];
    let inputs = Array.from(data).map(x => x / 255);
    let label = testing[i].label;
    let guess = nn.predict(inputs);

    let m = max(guess);
    let classification = guess.indexOf(m);
    // console.log(guess);
    // console.log(classification);
    // console.log(label);

    if (classification === label) {
      correct++;
    }
  }
  let percent = 100 * correct / testing.length;
  return percent;

}
