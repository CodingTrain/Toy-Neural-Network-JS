// let m = new Matrix(3,2);


class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++)
        m.data[i][j] = this.data[i][j];
    return m;
  }

  static fromArray(arr) {
    return new Matrix(arr.length, 1).map((e, i) => arr[i]);
  }

  static subtract(a, b) {
    if (a.rows !== b.rows || a.cols !== b.cols)
      throw new TypeError('Matrix dimensions do not match');

    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++)
        arr.push(this.data[i][j]);
    return arr;
  }

  randomize() {
    return this.map(e => Math.random() * 2 - 1);
  }

  add(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols)
        throw new TypeError('Matrix dimensions do not match');
      
      return this.map((e, i, j) => e + n.data[i][j]);
    } else
      return this.map(e => e + n);
    
  }

  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows)
      throw new TypeError('Matrix `a` columns do not match matrix `b` rows');

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) sum += a.data[i][k] * b.data[k][j];
        return sum;
      });
  }

  multiply(n) {
    if (n instanceof Matrix) {
      if (this.rows !== n.rows || this.cols !== n.cols)
        throw new TypeError('Matrix dimensions must match');

      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else // Scalar product
      return this.map(e => e * n);
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    return this;
  }

  static map(matrix, func) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => func(matrix.data[i][j], i, j));
  }

   print(decimalPoints = 3) {
    
    let text = '';
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (j !== 0) text += ' ';
        if (this.data[i][j] > 0) text += ' ';
        
        text += this.data[i][j].toFixed(decimalPoints);
        
        if (j !== this.cols - 1) text += ' ';
      }
      text += '\n';
    }
    if (typeof window.chrome === 'object')
      console.log('%c' + text, 'font-size: 12px; border-left: 1px solid black; border-right: 1px solid black; padding: 4px 8px; color: #333333; margin: 5px;');
    else
      console.log(text);
    
    return this;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data === 'string')
      data = JSON.parse(data);
      
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }
}

if (typeof module !== 'undefined')
  module.exports = Matrix;
