let checkerBoxCount = 64;
let game;

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
        // Will want to use the map method later
        // create an array instead of NodeList
        this.blackCellEls = [...boardElement.querySelectorAll("div")];
        // Attach a delegated event listener
        this.boardElement.addEventListener("click", (evt) => {
            // obtain index of square
            const idx = this.blackCellEls.indexOf(evt.target);
            // Logical guards
            if (
                // didn't click <div> in grid
                idx === -1) return;

            if (this.blackCells[idx].value !== null && this.turn === this.blackCells[idx].value) {
                this.deselect();
                this.blackCells[idx].select();
            }

            this.render();
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
        // render the game
        this.render();
    }

    render() {
        // square objs are responsible for rendering themselves
        this.blackCells.forEach(cell => cell.render());
        this.messageElement.innerHTML = `Player ${this.turn === 1 ? 1 : 2}'s Turn`
    }

    getWinner() {

    }

    deselect() {
        this.blackCells.forEach(cell => cell.deselect());
    }

    move() {
    }

    findOpenSpaces() {

    }

    findJumpSpaces() {

    }

    isPlayerKing() {

    }

    toString() {

    }

    static about() {

    }
}
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
