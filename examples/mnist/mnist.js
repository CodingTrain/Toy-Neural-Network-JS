function loadMNIST(callback) {
  let mnist = {};
  let files = {
    train_images: 'train-images-idx3-ubyte',
    train_labels: 'train-labels-idx1-ubyte',
    test_images: 't10k-images-idx3-ubyte',
    test_labels: 't10k-labels-idx1-ubyte',
  };
  return Promise.all(Object.keys(files).map(async file => {
    mnist[file] = await loadFile(files[file])
  }))
    .then(() => callback(mnist));
}

async function loadFile(file) {
  let buffer = await fetch(file).then(r => r.arrayBuffer());
  let headerCount = 4;
  let headerView = new DataView(buffer, 0, 4 * headerCount);
  let headers = new Array(headerCount).fill().map((_, i) => headerView.getUint32(4 * i, false));

  // Get file type from the magic number
  let type, dataLength;
  if(headers[0] == 2049) {
    type = 'label';
    dataLength = 1;
    headerCount = 2;
  } else if(headers[0] == 2051) {
    type = 'image';
    dataLength = headers[2] * headers[3];
  } else {
    throw new Error("Unknown file type " + headers[0])
  }

  let data = new Uint8Array(buffer, headerCount * 4);
  if(type == 'image') {
    dataArr = [];
    for(let i = 0; i < headers[1]; i++) {
      dataArr.push(data.subarray(dataLength * i, dataLength * (i + 1)));
    }
    return dataArr;
  }
  return data;
}
