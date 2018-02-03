const Matrix = require('./matrix');

test('add scalar to matrix', () => {
  let m = new Matrix(3, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  m.data[2] = [7, 8, 9];
  m.add(1);
  expect(m).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [2, 3, 4],
      [5, 6, 7],
      [8, 9, 10]
    ]
  });
});

test('add matrix to other matrix', () => {
  let m = new Matrix(2, 2);
  m.data[0] = [1, 2];
  m.data[1] = [3, 4];
  let n = new Matrix(2, 2);
  n.data[0] = [10, 11];
  n.data[1] = [12, 13];
  m.add(n);
  expect(m).toEqual({
    rows: 2,
    cols: 2,
    data: [
      [11, 13],
      [15, 17]
    ]
  });
});

test('subtract matrix from other matrix', () => {
  let m = new Matrix(2, 2);
  m.data[0] = [10, 11];
  m.data[1] = [12, 13];
  let n = new Matrix(2, 2);
  n.data[0] = [1, 2];
  n.data[1] = [3, 4];
  let mMinusN = Matrix.subtract(m, n);
  expect(mMinusN).toEqual({
    rows: 2,
    cols: 2,
    data: [
      [9, 9],
      [9, 9]
    ]
  });
});

test('matrix product', () => {
  let m = new Matrix(2, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  let n = new Matrix(3, 2);
  n.data[0] = [7, 8];
  n.data[1] = [9, 10];
  n.data[2] = [11, 12];
  let mn = Matrix.multiply(m, n);
  expect(mn).toEqual({
    rows: 2,
    cols: 2,
    data: [
      [58, 64],
      [139, 154]
    ]
  });
});

test('hadamard product', () => {
  let m = new Matrix(3, 2);
  m.data[0] = [1, 2];
  m.data[1] = [3, 4];
  m.data[2] = [5, 6];
  let n = new Matrix(3, 2);
  n.data[0] = [7, 8];
  n.data[1] = [9, 10];
  n.data[2] = [11, 12];
  m.multiply(n);
  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: [
      [7, 16],
      [27, 40],
      [55, 72]
    ]
  });
});

test('scalar product', () => {
  let m = new Matrix(3, 2);
  m.data[0] = [1, 2];
  m.data[1] = [3, 4];
  m.data[2] = [5, 6];
  m.multiply(7);
  expect(m).toEqual({
    rows: 3,
    cols: 2,
    data: [
      [7, 14],
      [21, 28],
      [35, 42]
    ]
  });
});

test('transpose matrix - (1, 1)', () => {
  let m = new Matrix(1, 1);
  m.data[0] = [1]
  let mt = Matrix.transpose(m);
  expect(mt).toEqual({
    rows: 1,
    cols: 1,
    data: [
      [1]
    ]
  })
})

test('transpose matrix - (2, 3) to (3, 2)', () => {
  let m = new Matrix(2, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  let mt = Matrix.transpose(m);
  expect(mt).toEqual({
    rows: 3,
    cols: 2,
    data: [
      [1, 4],
      [2, 5],
      [3, 6]
    ]
  });
});

test('transpose matrix - (3, 2) to (2, 3)', () => {
  let m = new Matrix(3, 2);
  m.data[0] = [1, 2]
  m.data[1] = [3, 4]
  m.data[2] = [5, 6]
  let mt = Matrix.transpose(m);
  expect(mt).toEqual({
    rows: 2,
    cols: 3,
    data: [
      [1, 3, 5],
      [2, 4, 6]
    ]
  })
})

test('transpose matrix - (1, 5) to (5, 1)', () => {
  let m = new Matrix(1, 5);
  m.data[0] = [1, 2, 3, 4, 5]
  let mt = Matrix.transpose(m);
  expect(mt).toEqual({
    rows: 5,
    cols: 1,
    data: [
      [1],
      [2],
      [3],
      [4],
      [5]
    ]
  })
})

test('transpose matrix - (5, 1) to (1, 5)', () => {
  let m = new Matrix(5, 1);
  m.data[0] = [1];
  m.data[1] = [2];
  m.data[2] = [3];
  m.data[3] = [4];
  m.data[4] = [5];
  let mt = Matrix.transpose(m)
  expect(mt).toEqual({
    rows: 1,
    cols: 5,
    data: [
      [1, 2, 3, 4, 5]
    ]
  })
})