
// log of RBG values and targets
// violet rgb(169, 47, 246) - compliment yellow rgb(249, 247, 82)
// indego rgb(0, 14, 155) - compliemnt orange rgb(232, 178, 61)
// red rgb(226, 48, 34) - compliment blue rgb(0, 29, 242)
// green rgb(116, 247, 75) - compliment magenta rgb(233, 55, 182)

let nn;
let training_data;
let lr_slider;
let inputs = [];
let colours = [];
let offset = 50;
let xOffset = 120;
let yOffset = 120;
let TRAINING_CYCLES = 10;

function setup() {
  createCanvas(490, 580);

  //normalise RGB values between 0 and 1
  training_data = [
    {
      inputs: [
                map(169,0,255,0,1), map(47,0,255,0,1), map(246,0,255,0,1),
                map(0,0,255,0,1), map(14,0,255,0,1), map(155,0,255,0,1),
                map(256,0,255,0,1), map(48,0,255,0,1), map(34,0,255,0,1),
                map(116,0,255,0,1), map(247,0,255,0,1), map(75,0,255,0,1)
              ],
      targets: [
                map(249,0,255,0,1), map(247,0,255,0,1), map(82,0,255,0,1),
                map(232,0,255,0,1), map(178,0,255,0,1), map(61,0,255,0,1),
                map(0,0,255,0,1), map(29,0,255,0,1), map(242,0,255,0,1),
                map(233,0,255,0,1), map(55,0,255,0,1), map(182,0,255,0,1)
              ]
    }
  ];

  //set initial random values
  for (let i = 0; i < 12; i++){
    inputs.push(Math.random() * 1);
  }

  //create nn
  nn = new NeuralNetwork(12, 48, 12);
}

function draw() {
  background(51);
  nn.learning_rate = 0.1;
  fill(255);
  textSize(18);
  text("Colour",xOffset-offset, offset);
  text("Target",xOffset*2-offset, offset);
  text("Result",xOffset*3-offset, offset);

  //training nn
  for (let i = 0; i < TRAINING_CYCLES; i++) {
     let data = training_data[0];
     nn.train(data.inputs, data.targets);
  }

  //predict outputs
  let output = nn.predict([...inputs]);

  //covert outsputs to rbg values
  for (let i = 0; i < output.length; i ++){
    colours[i] = output[i]*255|0;
  }

   //draw orignal colour rectangles
   fill(169, 47, 246)
   rect(xOffset-offset,60,100,100)
   fill(255);
   textSize(12);
   text(`RGB 169, 47, 246`, xOffset-offset, 175)
 
   fill(0, 14, 155)
   rect(xOffset-offset,180,100,100)
   fill(255);
   textSize(12);
   text(`RGB 0, 14, 155`, xOffset-offset, 295)
 
   fill(226, 48, 34)
   rect(xOffset-offset,300,100,100)
   fill(255);
   textSize(12);
   text(`RGB 226, 48, 34`, xOffset-offset, 415)
 
   fill(116, 247, 75)
   rect(xOffset-offset,420,100,100)
   fill(255);
   textSize(12);
   text(`RGB 116, 247, 75`, xOffset-offset, 535)

  //draw target colour rectangles
   fill(249, 247, 82)
   rect(xOffset*2-offset,60,100,100)
   fill(255);
   textSize(12);
   text(`RGB 249, 247, 82`, xOffset*2-offset, 175)
 
   fill(232, 178, 61)
   rect(xOffset*2-offset,180,100,100)
   fill(255);
   textSize(12);
   text(`RGB 232, 178, 61`, xOffset*2-offset, 295)
 
   fill(0, 29, 242)
   rect(xOffset*2-offset,300,100,100)
   fill(255);
   textSize(12);
   text(`RGB 0, 29, 242`, xOffset*2-offset, 415)
 
   fill(233, 55, 182)
   rect(xOffset*2-offset,420,100,100)
   fill(255);
   textSize(12);
   text(`RGB 233, 55, 182`, xOffset*2-offset, 535)

  //draw target rectangles
  fill(colours[0], colours[1], colours[2])
  rect(xOffset*3-offset,60,100,100)
  fill(255);
  textSize(12);
  text(`RGB ${colours[0]}, ${colours[1]}, ${colours[2]}`, xOffset*3-offset, 175)

  fill(colours[3], colours[4], colours[5])
  rect(xOffset*3-offset,180,100,100)
  fill(255);
  textSize(12);
  text(`RGB ${colours[3]}, ${colours[4]}, ${colours[5]}`, xOffset*3-offset, 295)

  fill(colours[6], colours[7], colours[8])
  rect(xOffset*3-offset,300,100,100)
  fill(255);
  textSize(12);
  text(`RGB ${colours[6]}, ${colours[7]}, ${colours[8]}`, xOffset*3-offset, 415)

  fill(colours[9], colours[10], colours[11])
  rect(xOffset*3-offset,420,100,100)
  fill(255);
  textSize(12);
  text(`RGB ${colours[9]}, ${colours[10]}, ${colours[11]}`, xOffset*3-offset, 535)
}
