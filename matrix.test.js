const Matrix = require('./matrix');

test('adding scalar to matrix', () => {
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

test('subtracting two matrices elementwise', () => {
  let m1 = new Matrix(3, 3);
  m1.data[0] = [1, 2, 3];
  m1.data[1] = [4, 5, 6];
  m1.data[2] = [7, 8, 9];
  let m2 = new Matrix(3, 3);
  m2.data[0] = [9, 8, 7];
  m2.data[1] = [6, 5, 4];
  m2.data[2] = [3, 2, 1];
  let result = Matrix.subtract(m1, m2);
  expect(result).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [-8, -6, -4],
      [-2,  0,  2],
      [ 4,  6,  8]
    ]
  });
});

test('adding two matrices elementwise', () => {
  let m1 = new Matrix(3, 3);
  m1.data[0] = [1, 2, 3];
  m1.data[1] = [4, 5, 6];
  m1.data[2] = [7, 8, 9];
  let m2 = new Matrix(3, 3);
  m2.data[0] = [1, 2, 3];
  m2.data[1] = [4, 5, 6];
  m2.data[2] = [7, 8, 9];
  m1.add(m2);
  expect(m1).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [2, 4, 6],
      [8, 10, 12],
      [14, 16, 18]
    ]
  });
});

test('multiplying matrix with scalar', () => {
  let m = new Matrix(3, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  m.data[2] = [7, 8, 9];
  m.multiply(10);
  expect(m).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90]
    ]
  });
});

test('mapping a matrix using static map', () => {
  let m = new Matrix(3, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  m.data[2] = [7, 8, 9];
  let mapped = Matrix.map(m, elem => elem * 10);
  expect(mapped).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90]
    ]
  });
});

test('mapping a matrix using member map', () => {
  let m = new Matrix(3, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  m.data[2] = [7, 8, 9];
  m.map( elem => elem * 10);
  expect(m).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90]
    ]
  });
});

test('transposing a matrix using static transpose', () => {
  let m = new Matrix(3, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  m.data[2] = [7, 8, 9];
  let transposed = Matrix.transpose(m);
  expect(transposed).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
    ]
  });
});

test('multiplying 2 matrices using static multiply', () => {
  let m1 = new Matrix(2, 4);
  m1.data[0] = [1, 4, 6, 10];
  m1.data[1] = [2, 7, 5, 3];
  let m2 = new Matrix(4, 3);
  m2.data[0] = [1, 4, 6];
  m2.data[1] = [2, 7, 5];
  m2.data[2] = [9, 0, 11];
  m2.data[3] = [3, 1, 0];
  let product = Matrix.multiply(m1, m2);
  expect(product).toEqual({
    rows: 2,
    cols: 3,
    data: [
      [93, 42, 92],
      [70, 60, 102]
    ]
  });
});

test('multiplying 2 matrices elementwise using member multiply', () => {
  let m1 = new Matrix(3, 3);
  m1.data[0] = [1, 4, 6];
  m1.data[1] = [2, 7, 5];
  m1.data[2] = [3, 5, 7];
  let m2 = new Matrix(3, 3);
  m2.data[0] = [0, 3, 6];
  m2.data[1] = [2, 7, 4];
  m2.data[2] = [9, 0, 11];
  m1.multiply(m2);
  expect(m1).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [0, 12, 36], 
      [4, 49, 20], 
      [27, 0, 77]
    ]
  });
});