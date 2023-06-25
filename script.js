let checkerBox = 64;

let boardEl = document.getElementById("board");
const msgEl = document.getElementById('message');
const resetButton = document.querySelector('button');

resetButton.addEventListener("click", initialize);

class Cell {
    constructor(domElement, idx) {
      this.domElement = domElement;
      this.index = idx;
      this.setRow(idx);
    }
  
    setRow(idx) {
      let row;
      let value = 1;
      if (idx < 4) {
        row = 0;
      } else if (idx < 8) {
        row = 1;
      } else if (idx < 12) {
        row = 2;
      } else if (idx < 16) {
        row = 3;
        value = null;
      } else if (idx < 20) {
        row = 4;
        value = null;
      } else if (idx < 24) {
        row = 5;
        value = 2;
      } else if (idx < 30) {
        row = 6;
        value = 2;
      } else if (idx < 32) {
        row = 7;
        value = 2;
      }
  
      this.row = row;
      this.value = value;
    }
  
    static renderLookup = {
      "1": "#1571ea",
      "2": "#ea8e15",
      "null": "black"
    }
  
    render() {
      this.domElement.style.backgroundColor = Cell.renderLookup[this.value];
    }
  }
  
function initialize() {
  initializeBoard();
}

function initializeBoard() {
  let row = 0;

  for (let i = 0; i < 64; i++) {

    if (i % 8 === 0) {
      row = row + 1;
    }
    let spanEl = document.createElement("span");
    let divEl = document.createElement("div");
    if (i % 2 == 1 && row % 2 === 1) {
      divEl.style.backgroundColor = 'black';
      boardEl.appendChild(divEl);
    } else if (i % 2 == 0 && row % 2 === 0) {
      divEl.style.backgroundColor = 'black';
      boardEl.appendChild(divEl);
    } else {
      boardEl.appendChild(spanEl);
    }
  }
}
