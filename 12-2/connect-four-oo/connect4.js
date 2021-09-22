const newGame = document.getElementById('newGame');
let game;
let p1;
let p2;
let currPlayer;
let numPlayers = 0;
const p1Color = document.getElementById('p1-color')
const p2Color = document.getElementById('p2-color')

class Game {
  constructor(HEIGHT, WIDTH) {
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
  }
  board = []
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    alert(msg);
  }
  handleClick(evt) {
    if (!this.gameOver) {
      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        this.gameOver = true;
        return this.endGame(`Player ${currPlayer.playerNum} (${currPlayer.color}) won!`);
      }

      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        this.gameOver = true;
        return this.endGame('Tie!');
      }

      // switch players
      if (currPlayer == p1) {
        currPlayer = p2;
      } else if (currPlayer == p2) {
        currPlayer = p1;
      }
    } else {
      alert('Click "New Game" to start a new game')
    }
  }
  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  gameOver = false
  reset() {
    this.gameOver = false;
    this.board = [];
    currPlayer = p1;
    const htmlBoard = document.getElementById('board');
    htmlBoard.innerHTML = "";
    this.makeBoard()
    this.makeHtmlBoard()
  }
}


class Player {
  constructor(color) {
    this.color = color
    numPlayers++
  }
  playerNum = numPlayers + 1
}



newGame.addEventListener('click', function () {
  if (game instanceof Game) {
    p1 = new Player(p1Color.value);
    p2 = new Player(p2Color.value);
    game.reset();
  } else {
    game = new Game(6, 7);  // assuming constructor takes height, width
    game.makeBoard();
    game.makeHtmlBoard();
    p1 = new Player(p1Color.value);
    p2 = new Player(p2Color.value);
    currPlayer = p1;
  }
})


