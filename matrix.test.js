import { Matrix } from './matrix';

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

test('product test',()=>{
  let m = new Matrix(1, 3);
  m.data[0] = [1,2,3];
  let n = new Matrix(3, 1);
  n.data[0] = [1];
  n.data[1] = [2];
  n.data[2] = [3];
  let mn = Matrix.multiply(m, n);
  expect(mn).toEqual({
    rows: 1,
    cols: 1,
    data: [
      [14]
    ]
  });
});
