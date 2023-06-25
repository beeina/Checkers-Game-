let checkerBox = 64;

let boardEl = document.getElementById("board");
const msgEl = document.getElementById('message');
const resetButton = document.querySelector('button');

resetButton.addEventListener("click", initialize);

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
