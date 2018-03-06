function prepareData(category, data, label) {
  category.training = [];
  category.testing = [];
  for (let i = 0; i < totalData; i++) {
    let offset = i * len;
    let threshold = floor(0.8 * totalData);

    // Pull Request INFO :
    // Make the normalisation once for every images
    if (i < threshold) {
      category.training[i] = Array.from(data.bytes.subarray(offset, offset + len)).map(x => x / 255);
      category.training[i].label = label;
    } else {
      category.testing[i - threshold] = Array.from(data.bytes.subarray(offset, offset + len)).map(x => x / 255);
      category.testing[i - threshold].label = label;
    }
  }
}
