const diagonalIndexes = [
  [0, 4],
  [1, 5, 8, 12],
  [2, 6, 9, 13, 16, 20],
  [3, 7, 10, 14, 17, 21, 24, 28],
  [11, 15, 18, 22, 25, 29],
  [19, 23, 26, 30],
  [27, 31],
  [2, 7, 11],
  [1, 6, 10, 15, 19],
  [0, 5, 9, 14, 18, 23, 27],
  [4, 8, 13, 17, 22, 26, 31],
  [12, 16, 21, 25, 30],
  [20, 24, 29],
];

let checkerBoxCount = 64;
let game;

let boardEl = document.getElementById("board");
const msgEl = document.getElementById("message");
const resetButton = document.querySelector("button");

class Cell {
  constructor(domElement, idx) {
    this.domElement = domElement;
    this.index = idx;
    this.isKing = false;
    this.selected = 0;
    this.openSpaceIndexes = null;
    this.jumpSpaceIndexes = null;
    this.setRow(idx);
    this.deselect();
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
    } else if (idx < 28) {
      row = 6;
      value = 2;
    } else if (idx < 32) {
      row = 7;
      value = 2;
    }
    let movePositive = row < 3 ? true : false;
    let moveNegative = row > 4 ? true : false;
    this.movePositive = value === null ? false : movePositive;
    this.moveNegative = value === null ? false : moveNegative;
    this.row = row;
    this.value = value;
  }

  static renderLookup = {
    1: "#1571ea",
    2: "#ea8e15",
    null: "black",
  };

  render() {
    this.domElement.style.backgroundColor = Cell.renderLookup[this.value];
  }

  deselect() {
    this.selected = 0;
    this.domElement.classList.remove("selected-border");
  }

  select() {
    this.selected = 1;
    this.domElement.classList.add("selected-border");
  }
}

class ImageCell extends Cell {
  // additional parameters must always be defined
  // after the parameters of the superclass

  constructor(domElement, value) {
    // always initialize the superclass first
    super(domElement, value);
    // set this subclass properties here:
    // this.domElement.style.animationDuration = `${secondsPerRotation}s`
  }

  static renderLookup = {
    1: "https://i.imgur.com/UlaDUh1.png",
    2: "https://i.imgur.com/1DfePxg.png",
    "1-king": "https://i.imgur.com/JeOdUvc.png",
    "2-king": "https://i.imgur.com/uh8hHLa.png",
    null: "black",
  };

  // Override the inherited render method
  render() {
    if (this.value) {
      if (this.isKing) {
        this.domElement.style.backgroundImage = `url(${ImageCell.renderLookup[this.value + "-king"]
          })`;
      } else {
        this.domElement.style.backgroundImage = `url(${ImageCell.renderLookup[this.value]
          })`;
      }
    } else {
      this.domElement.style.backgroundImage = "";
    }
  }
}

class CheckerGame {
  // code to define the properties and methods of this class
  constructor(boardElement, messageElement) {
    // add properties to the new obj
    this.boardElement = boardElement;
    this.messageElement = messageElement;
    this.selectedPlayer;
    this.playerOneCountKilled = 0;
    this.playerTwoCountKilled = 0;
    this.firstRowindexes = [0, 1, 2, 3];
    this.lastRowindexes = [28, 29, 30, 31];
    // Will want to use the map method later
    // create an array instead of NodeList
    this.blackCellEls = [...boardElement.querySelectorAll("div")];
    // Attach a delegated event listener
    this.boardElement.addEventListener("click", (evt) => {
      // obtain index of square
      const idx = this.blackCellEls.indexOf(evt.target);
      // Logical guards
      this.cellClicked(idx);
    });
    // Arrow function is necessary to ensure 'this'
    // is set to the game object
  }

  play() {
    // initialize the game's state
    // instance methods have 'this' set to
    // the actual instance (game obj)
    this.turn = 1;
    this.winner = null;
    // we'll come back to this later
    this.blackCells = this.blackCellEls.map(
      (el, idx) => new ImageCell(el, idx)
    );
    // render the game
    this.render();
  }

  checkWinner() {
    if (this.playerOneCountKilled === 12 || this.playerTwoCountKilled === 12) {
      this.winner = this.turn;
    }
  }

  render() {
    // square objs are responsible for rendering themselves
    this.blackCells.forEach((cell) => cell.render());
    this.renderMessage();
  }

  renderMessage() {
    if (this.winner === "T") {
      messageEl.innerText = "It's a tie!";
    } else if (this.winner) {
      this.messageElement.innerHTML = `Congratulation! ${this.turn}'s Wins`;
    } else {
      this.messageElement.innerHTML = `Player ${this.turn}'s Turn`;
    }
  }

  deselect() {
    this.blackCells.forEach((cell) => cell.deselect());
  }

  move() { }

  cellClicked(idx) {
    if (
      // didn't click <div> in grid
      idx === -1
    )
      return;

    if (
      this.blackCells[idx].value !== null &&
      this.turn === this.blackCells[idx].value
    ) {
      this.deselect();
      this.blackCells[idx].select();
      this.findOpenSpaces(idx);
      this.findJumpSpaces(idx);
      this.selectedPlayer = this.blackCells[idx];
    } else if (
      this.blackCells[idx].value === null &&
      this.selectedPlayer &&
      this.selectedPlayer.openSpaceIndexes.includes(idx)
    ) {
      this.isPlayerKing(idx);
      this.blackCells[this.selectedPlayer.index].value = null;
      this.blackCells[idx].value = this.turn;
      this.blackCells[idx].movePositive = this.selectedPlayer.movePositive;
      this.blackCells[idx].moveNegative = this.selectedPlayer.moveNegative;
      this.blackCells[idx].isKing = this.selectedPlayer.isKing;
      this.turn = this.turn === 1 ? 2 : 1;
      this.deselect();
      this.selectedPlayer = null;
    } else if (
      this.blackCells[idx].value === null &&
      this.selectedPlayer &&
      this.selectedPlayer.jumpSpaceIndexes.includes(idx) &&
      this.blackCells[this.selectedPlayer.jumpOppIndexes[idx]].value !== null &&
      this.blackCells[this.selectedPlayer.jumpOppIndexes[idx]].value !== this.turn
    ) {
      this.isPlayerKing(idx);
      this.blackCells[this.selectedPlayer.index].value = null;
      this.blackCells[idx].value = this.turn;
      this.blackCells[idx].movePositive = this.selectedPlayer.movePositive;
      this.blackCells[idx].moveNegative = this.selectedPlayer.moveNegative;
      this.blackCells[idx].isKing = this.selectedPlayer.isKing;
      this.blackCells[this.selectedPlayer.jumpOppIndexes[idx]].value = null;
      if (this.turn === 1) {
        this.playerTwoCountKilled += 1;
      } else {
        this.playerOneCountKilled += 1;
      }

      this.deselect();
      this.checkWinner();
      this.selectedPlayer = null;
      if (this.winner === null) {
         this.turn = this.turn === 1 ? 2 : 1;
      }
    }

    this.render();
  }

  findOpenSpaces(idx) {
    let indexes = [];
    if (this.blackCells[idx].movePositive) {
      let diagonalIndexes = this.getDiagonalIndexes(idx, 1);
      if (diagonalIndexes.length > 0) {
        for (let i = 0; i < diagonalIndexes.length; i++) {
           if (diagonalIndexes[i] < 32 && this.blackCells[diagonalIndexes[i]].value === null) {
              indexes.push(diagonalIndexes[i]);
            }
        }
      }
    }
    if (this.blackCells[idx].moveNegative) {
      let diagonalIndexes = this.getDiagonalIndexes(idx, -1);
      if (diagonalIndexes.length > 0) {
        for (let i = 0; i < diagonalIndexes.length; i++) {
           if (diagonalIndexes[i] < 32 && this.blackCells[diagonalIndexes[i]].value === null) {
              indexes.push(diagonalIndexes[i]);
            }
        }
      }
    }

    this.blackCells[idx].openSpaceIndexes = indexes;
  }

  findJumpSpaces(idx) {
    
    let indexes = [];
    let jumpOppIndexes = {};
    if (this.blackCells[idx].movePositive) {
      let jumpIndexes = this.getJumpDiagonalIndexes(idx, 1, 2);
      if (jumpIndexes.length > 0) {
        for (let i = 0; i < jumpIndexes.length; i++) {
            if (jumpIndexes[i].length === 2 && 
               jumpIndexes[i][0] < 32 && jumpIndexes[i][1] < 32 && 
               this.blackCells[jumpIndexes[i][0]].value !== this.turn &&
               this.blackCells[jumpIndexes[i][1]].value === null) {
            
                indexes.push(jumpIndexes[i][1]);
                jumpOppIndexes[jumpIndexes[i][1]] = jumpIndexes[i][0];
        } 
        }
      }
    }
    if (this.blackCells[idx].moveNegative) {
      let jumpIndexes = this.getJumpDiagonalIndexes(idx, -1, -2);
      if (jumpIndexes.length > 0) {
        for (let i = 0; i < jumpIndexes.length; i++) {
            if (jumpIndexes[i].length === 2 && 
               jumpIndexes[i][0] >= 0 && jumpIndexes[i][1] >= 0 && 
               this.blackCells[jumpIndexes[i][0]].value !== this.turn &&
               this.blackCells[jumpIndexes[i][1]].value === null) {
            
                indexes.push(jumpIndexes[i][1]);
                jumpOppIndexes[jumpIndexes[i][1]] = jumpIndexes[i][0];
        } 
        }
      }
    }

    this.blackCells[idx].jumpSpaceIndexes = indexes;
    this.blackCells[idx].jumpOppIndexes = jumpOppIndexes;
  }

  isPlayerKing(idx) {
    if (this.lastRowindexes.includes(idx) && this.selectedPlayer.value === 1) {
      this.selectedPlayer.isKing = true;
      this.selectedPlayer.moveNegative = true;
    }
    if (this.firstRowindexes.includes(idx) && this.selectedPlayer.value === 2) {
      this.selectedPlayer.isKing = true;
      this.selectedPlayer.movePositive = true;
    }
  }

  toString() { }

  static about() { }

  getDiagonalIndexes(idx, add) {
    let indexes = [];
    for (let i = 0; i < diagonalIndexes.length; i++) {
      for(let j = 0; j < diagonalIndexes[i].length; j++) {
        if (idx === diagonalIndexes[i][j]) {
          if (diagonalIndexes[i][j + add] >= 0 || diagonalIndexes[i][j + add] < 32) {
             indexes.push(diagonalIndexes[i][j + add]);
           j = diagonalIndexes[i].length;
          }
        }
        if (indexes.length === 2) {
          return indexes;
        }
      }
    }
    return indexes;
  }

  getJumpDiagonalIndexes(idx, one, two) {
    let indexes = [];
    for (let i = 0; i < diagonalIndexes.length; i++) {
      for(let j = 0; j < diagonalIndexes[i].length; j++) {
        if (idx === diagonalIndexes[i][j]) {
          if (diagonalIndexes[i][j + one] >= 0 || diagonalIndexes[i][j + one] < 32 || 
             diagonalIndexes[i][j + two] >= 0 || diagonalIndexes[i][j + two] < 32) {
            let arr = [];
             arr.push(diagonalIndexes[i][j + one]);
             arr.push(diagonalIndexes[i][j + two]);
            indexes.push(arr);
          }
        }
      }
    }
    return indexes;
  }
}

function howToPlay() {
  msgEl.textContent =
    "Player1 to play first.Players move diagonally forward. If there is an opponent diagonally in front of your player you can capture with a jump if the following diagonal square is free. If your player gets to the far side of the board it becomes a king and the player can move backwards too.Game is won when one side captures all the opponent’s players or the other side is unable to move.";
}

/*----- functions -----*/
initialize();

resetButton.addEventListener("click", initialize);

function initialize() {
  boardEl.replaceChildren();
  initializeBoard();
  game = new CheckerGame(boardEl, msgEl);
  game.play();
}

function initializeBoard() {
  let row = 0;

  for (let i = 0; i < checkerBoxCount; i++) {
    if (i % 8 === 0) {
      row = row + 1;
    }
    let divEl = document.createElement("div");
    if (i % 2 == 1 && row % 2 === 1) {
      divEl.style.backgroundColor = "black";
      boardEl.appendChild(divEl);
    } else if (i % 2 == 0 && row % 2 === 0) {
      divEl.style.backgroundColor = "black";
      boardEl.appendChild(divEl);
    } else {
      const spanEl = document.createElement("span");
      boardEl.appendChild(spanEl);
    }
  }
}
