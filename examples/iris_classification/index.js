const NeuralNet = require("../../lib/nn");
const csv = require("csvtojson");
const fs = require("fs");
require("colors");

const LoggerType = Object.freeze({
  Error: 1,
  Warn: 2,
  Info: 3,
  Data: 4
});
function debug(text, type) {
  if (type) {
    if (type === LoggerType.Error) {
      process.stdout.write("ERROR: ".red);
      console.error(JSON.stringify(text) || text);
    } else if (type === LoggerType.Warn) {
      process.stdout.write("WARN: ".yellow);
      console.warn(JSON.stringify(text) || text);
    } else if (type === LoggerType.Info) {
      process.stdout.write("INFO: ".cyan);
      console.log(JSON.stringify(text) || text);
    } else if (type === LoggerType.Data) {
      process.stdout.write("DATA: ".green);
      console.log(JSON.stringify(text) || text);
    }
    return;
  }
  console.log(text);
}

const trainIP = [];
const trainOP = [];
const testIP = [];
const testOP = [];

const noOfInputs = 4;
const noOfOutputs = 3;
const nn = new NeuralNet.NeuralNetwork(noOfInputs, 5, noOfOutputs);

function outputArrGenerator(op, opSize) {
  let opArr = new Array(opSize);
  opArr.fill(0);
  op = parseInt(op, 10);
  opArr[op - 1] = 1;
  return opArr;
}

csv()
  .fromFile("./train.csv")
  .on("json", jsonObj => {
    const temp = Object.values(jsonObj);
    trainOP.push(temp.slice(temp.length - 1, temp.length));
    trainIP.push(temp.slice(0, temp.length - 1));
  })
  .on("done", error => {
    if (error) {
      throw error;
    }
    const epoch = 20000;
    for (let i = 0; i < epoch; i++) {
      const randomIndex = Math.floor(Math.random() * trainIP.length);
      nn.train(trainIP[randomIndex], outputArrGenerator(trainOP[randomIndex][0], noOfOutputs));
    }
    debug("Training Complete...", LoggerType.Info);
  });

const predVal = [];

csv()
  .fromFile("./test.csv")
  .on("json", jsonObj => {
    const temp = Object.values(jsonObj);
    testOP.push(temp.slice(temp.length - 1, temp.length));
    testIP.push(temp.slice(0, temp.length - 1));
  })
  .on("done", error => {
    if (error) {
      throw error;
    }
    debug(
      `|************************************|`,
      LoggerType.Info
    );
    debug(
      `| Predicted Class  |  Actual Class   |`,
      LoggerType.Info
    );
    debug(
      `|************************************|`,
      LoggerType.Info
    );
    for (let i = 0; i < testIP.length; i++) {
      predVal.push(nn.predict(testIP[i]));
      debug(
        `|         ${predVal[i].indexOf(Math.max(...predVal[i])) + 1}         |        ${testOP[i]}       |`,
        LoggerType.Info
      );      debug(
        `|------------------------------------|`,
        LoggerType.Info
      );
    }
    const modal = nn.serialize();
    fs.writeFile("./model.json", modal, err => {
      if (err) {
        debug(err, LoggerType.Error);
      }
    });
    debug("end", LoggerType.Info);
  });
