import Matrix from './matrix';

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

test('mapping with static map', () => {
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

test('mapping with instance map', () => {
  let m = new Matrix(3, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  m.data[2] = [7, 8, 9];
  m.map(elem => elem * 10);
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

test('error handling of matrix product when columns of A don\'t match rows of B.', () => {
  //Replace console.log with a jest mock so we can see if it has been called
  global.console.log = jest.fn(); 

  let m1 = new Matrix(1, 2);
  let m2 = new Matrix(3, 4);
  Matrix.multiply(m1, m2);

  //Check if the mock console.log has been called 
  expect(global.console.log).toHaveBeenCalledWith('Columns of A must match rows of B.') 
});

test('printing', () => {
  //Replace console.table with a jest mock so we can see if it has been called
  global.console.table = jest.fn(); 

  let m1 = new Matrix(2, 3);
  m1.randomize();
  m1.print();

  //Check if the mock console.table has been called 
  expect(global.console.table).toHaveBeenCalledWith(m1.data) 
});

test('matrix from array', () => {
  let array = [1, 2, 3];
  let m = Matrix.fromArray(array);
  expect(m).toEqual({
    rows: 3,
    cols: 1,
    data: [
      [1],
      [2],
      [3]
    ]
  });
});

test('matrix to array', () => {
  let m = new Matrix(3, 3);
  m.data[0] = [1, 2, 3];
  m.data[1] = [4, 5, 6];
  m.data[2] = [7, 8, 9];

  let array = m.toArray();
  expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
});