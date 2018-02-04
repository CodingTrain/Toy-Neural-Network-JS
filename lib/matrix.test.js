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

test('transpose matrix', () => {
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

test('map matrix to a new matrix', () => {
    let func() = multiply();
    let m = new Matrix(2, 3), result = new Matrix(2,3);
    m.data[0] = [1, 2, 3];
    m.data[1] = [4, 5, 6];
    
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        let val = m.data[i][j];
        result.data[i][j] = val.func(2);
      }
    };
  
 
    expect(result).toEqual({
        rows: 2,
        cols: 3,
        data: [
            [2,4,6],
            [8,10,12]
        ]
    });
});
