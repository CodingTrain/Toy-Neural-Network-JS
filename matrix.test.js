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

test('adding matrix to matrix', () => {
  let m1 = new Matrix(3, 3);
  m1.data[0] = [1, 2, 3];
  m1.data[1] = [4, 5, 6];
  m1.data[2] = [7, 8, 9];
  
  let m2 = new Matrix(3,3);
  m1.data[0] = [7, 5, 1];
  m1.data[1] = [0, 5, 9];
  m1.data[2] = [4, 2, 9];
  
  expect(m).toEqual({
    rows: 3,
    cols: 3,
    data: [
      [8, 7, 4],
      [4, 10, 15],
      [11, 10, 18]
    ]
  });
});
