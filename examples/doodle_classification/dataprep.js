function prepareData(category, data, label) {
  category.training = [];
  category.testing = [];
  for (let i = 0; i < totalData; i++) {
    let offset = i * len;
    let threshold = floor(0.8 * totalData);
    if (i < threshold) {
      category.training[i] = data.bytes.subarray(offset, offset + len);
      category.training[i].label = label;
    } else {
      category.testing[i - threshold] = data.bytes.subarray(offset, offset + len);
      category.testing[i - threshold].label = label;
    }
  }
}
