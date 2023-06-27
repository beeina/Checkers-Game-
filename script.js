const diagonalIndexes = [
    [0, 4],
    [0, 5, 9, 14, 18, 23, 27],
    [1, 5, 8, 12],
    [1, 6, 10, 15, 19],
    [2, 6, 9, 13, 16, 20],
    [2, 7, 11],
    [3, 7, 10, 14, 14, 17, 21, 24, 28],
    [4, 8, 13, 17, 22, 26, 31],
    [5, 8, 12],
    [5, 9, 14, 18, 23, 27],
    [6, 9, 13, 16, 20],
    [6, 10, 15, 19],
    [7, 10, 14, 17, 21, 24, 28],
    [7, 11],
    [8, 12],
    [8, 13, 17, 22, 26, 31]
]

let checkerBoxCount = 64;
let game;

let boardEl = document.getElementById("board");
const msgEl = document.getElementById('message');
const resetButton = document.querySelector('button');

class Cell {
    constructor(domElement, idx) {
        this.domElement = domElement;
        this.index = idx;
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
        } else if (idx < 30) {
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
        "1": "#1571ea",
        "2": "#ea8e15",
        "null": "black"
    }

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
        '1': 'https://i.imgur.com/UlaDUh1.png',
        '2': 'https://i.imgur.com/1DfePxg.png',
        'null': 'black'
    }

    // Override the inherited render method
    render() {
        if (this.value) {

            this.domElement.style.backgroundImage = `url(${ImageCell.renderLookup[this.value]})`;
        } else {
            this.domElement.style.backgroundImage = '';
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
        // Will want to use the map method later
        // create an array instead of NodeList
        this.blackCellEls = [...boardElement.querySelectorAll("div")];
        // Attach a delegated event listener
        this.boardElement.addEventListener("click", (evt) => {
            // obtain index of square
            const idx = this.blackCellEls.indexOf(evt.target);
            // Logical guards
            this.cellClicked(idx);

        })
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
        this.blackCells = this.blackCellEls.map((el, idx) =>
            new ImageCell(el, idx));
        // render the game
        this.render();
    }

    getWinner() {
    }

    render() {
        // square objs are responsible for rendering themselves
        this.blackCells.forEach(cell => cell.render());
        this.messageElement.innerHTML = `Player ${this.turn === 1 ? 1 : 2}'s Turn`

    }

    deselect() {
        this.blackCells.forEach(cell => cell.deselect());
    }

    move() {
    }

    cellClicked(idx) {
        if (
            // didn't click <div> in grid
            idx === -1) return;

        if (this.blackCells[idx].value !== null &&
            this.turn === this.blackCells[idx].value) {
            this.deselect();
            this.blackCells[idx].select();
            this.findOpenSpaces(idx);
            this.findJumpSpaces(idx);
            this.selectedPlayer = this.blackCells[idx];

        } else if (this.blackCells[idx].value === null &&
            this.selectedPlayer &&
            this.selectedPlayer.openSpaceIndexes.includes(idx)) {
            this.blackCells[this.selectedPlayer.index].value = null;
            this.blackCells[idx].value = this.turn;
            this.selectedPlayer = null;
            // this.turn = this.turn === 1 ? 2 : 1;
            this.deselect();
        }

        this.render();
    }

    findOpenSpaces(idx) {
        let indexes = [];
        if (this.blackCells[idx].movePositive) {
            if ((idx + 4) < 32 && this.blackCells[idx + 4].value === null) {
                indexes.push(idx + 4);
            }
            if ((idx + 5) < 32 && this.blackCells[idx + 5].value === null &&
                this.blackCells[idx].row % 2 === 0) {
                indexes.push(idx + 5);
            }
            if ((idx + 3) < 32 && this.blackCells[idx + 3].value === null &&
                this.blackCells[idx].row % 2 === 1) {
                indexes.push(idx + 3);
            }
        }
        if (this.blackCells[idx].moveNegative) {
            if ((idx - 4) >= 0 && this.blackCells[idx - 4].value === null) {
                indexes.push(idx - 4);
            }
            if ((idx - 5) >= 0 && this.blackCells[idx - 5].value === null &&
                this.blackCells[idx].row % 2 === 1) {
                indexes.push(idx - 5);
            }
            if ((idx - 3) >= 0 && this.blackCells[idx - 3].value === null &&
                this.blackCells[idx].row % 2 === 0) {
                indexes.push(idx - 3);
            }
        }


        this.blackCells[idx].openSpaceIndexes = indexes;
    }

    findJumpSpaces(idx) {

    }

    isPlayerKing() {

    }

    toString() {

    }

    static about() {

    }
}

/*----- functions -----*/
initialize();

resetButton.addEventListener("click", initialize);

function initialize() {
    initializeBoard();
    game = new CheckerGame(boardEl, msgEl);
    game.play()
}

function initializeBoard() {
    let row = 0;

    for (let i = 0; i < checkerBoxCount; i++) {

        if (i % 8 === 0) {
            row = row + 1;
        }
        let divEl = document.createElement("div");
        if (i % 2 == 1 && row % 2 === 1) {
            divEl.style.backgroundColor = 'black';
            boardEl.appendChild(divEl);
        } else if (i % 2 == 0 && row % 2 === 0) {
            divEl.style.backgroundColor = 'black';
            boardEl.appendChild(divEl);
        } else {
            const spanEl = document.createElement("span");
            boardEl.appendChild(spanEl);
        }
    }
}
