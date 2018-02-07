// let m = new Matrix(3,2);


class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
  }

  static fromArray(arr) {
    return new Matrix(arr.length, 1).map((e, i) => arr[i]);
  }

  static subtract(a, b) {
    // Return a new Matrix a-b
    return new Matrix(a.rows, a.cols)
      .map((_, i, j) => a.data[i][j] - b.data[i][j]);
  }

  toArray() {
    let arr = [];
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        arr.push(this.data[i][j]);
      }
    }
    return arr;
  }

  randomize() {
    return this.map(e => Math.random() * 2 - 1);
  }

  add(n) {
    if (n instanceof Matrix) {
      return this.map((e, i, j) => e + n.data[i][j]);
    } else {
      return this.map(e => e + n);
    }
  }

  static transpose(matrix) {
    return new Matrix(matrix.cols, matrix.rows)
      .map((_, i, j) => matrix.data[j][i]);
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log('Columns of A must match rows of B.')
      return;
    }

    return new Matrix(a.rows, b.cols)
      .map((e, i, j) => {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        return sum;
      });
  }

  multiply(n) {
    if (n instanceof Matrix) {
      // hadamard product
      return this.map((e, i, j) => e * n.data[i][j]);
    } else {
      // Scalar product
      return this.map(e => e * n);
    }
  }

  map(func) {
    // Apply a function to every element of matrix
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.data[i][j];
        this.data[i][j] = func(val, i, j);
      }
    }
    return this;
  }

  static map(matrix, func) {
    // Apply a function to every element of matrix
    return new Matrix(matrix.rows, matrix.cols)
      .map((e, i, j) => func(matrix.data[i][j], i, j));
  }

  print() {
    console.table(this.data);
    return this;
  }
  
  // Visualize the matrix in the browser window
  // if idSelector is passed, the matrix is displayed in the table with the given id
  visualize(idSelector) {
    let table;
    if (idSelector) {
      if (typeof idSelector !== 'string') {
        console.error('Invalid argument type (expected string, received ' + typeof idSelector + ')');
        return;
      }
      // select table by id, otherwise create new table if not exists
      table = document.getElementById(idSelector);
      if (table === null) {
        table = document.createElement('table');
        table.id = idSelector;
        document.body.appendChild(table);
      }
      table.innerHTML = ''; // clear
      table.setAttribute('title', 'id: ' + idSelector);
    } else {
      // append table without id to body
      table = document.createElement('table');
      document.body.appendChild(table);
    }
    table.className = 'vis-matrix';
    table.style.margin = '40px';
    table.style.padding = '4px 10px';
    table.style.borderLeft = '2px solid black';
    table.style.borderRight = '2px solid black';
    table.style.borderRadius = '20px';
    this.data.forEach((el, iRow) => {
      let row = document.createElement('tr');
      el.forEach((el, iCol) => {
        let cell = document.createElement('td');
        cell.innerHTML = el;
        cell.setAttribute('title', '[' + iRow + ',' + iCol + ']');
        cell.style.padding = '3px 8px';
        cell.style.textAlign = 'center';
        cell.style.color = 'black';
        row.appendChild(cell);
      })
      table.appendChild(row);
    });
  }
}

if (typeof module !== 'undefined') {
  module.exports = Matrix;
}
