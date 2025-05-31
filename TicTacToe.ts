import * as readline from 'readline';

class Move {
  constructor(public row: number, public col: number) {}
}

abstract class Player {
  constructor(public name: string, public symbol: string) {}
  abstract getMove(): Promise<Move>;
}

class HumanPlayer extends Player {
  async getMove(): Promise<Move> {
    const input = await ask(`${this.name} (${this.symbol}) - enter your move (e.g., 1a, 2c): `);
    const move = parseMove(input);
    if (!move) {
      console.log("Invalid format. Please use row(1-3) + column(a-c), like 2b.");
      return this.getMove();
    }
    return move;
  }
}

class Board {
  private grid: string[][];

  constructor() {
    this.grid = Array.from({ length: 3 }, () => Array(3).fill(' '));
  }

  print(): void {
    console.clear();
    console.log('\n    a   b   c');
    console.log('  +---+---+---+');
    this.grid.forEach((row, i) => {
      console.log(`${i + 1} | ${row.join(' | ')} |`);
      console.log('  +---+---+---+');
    });
  }

  isValidMove(row: number, col: number): boolean {
    return row >= 0 && row < 3 && col >= 0 && col < 3 && this.grid[row][col] === ' ';
  }

  applyMove(move: Move, symbol: string): void {
    this.grid[move.row][move.col] = symbol;
  }

  isFull(): boolean {
    return this.grid.every(row => row.every(cell => cell !== ' '));
  }

  checkWin(symbol: string): boolean {
    const lines = [
      ...this.grid,
      ...[0, 1, 2].map(i => this.grid.map(row => row[i])),
      this.grid.map((_, i) => this.grid[i][i]),
      this.grid.map((_, i) => this.grid[i][2 - i])
    ];
    return lines.some(line => line.every(cell => cell === symbol));
  }
}

class Game {
  private board = new Board();
  private players: Player[];
  private currentPlayerIndex = 0;

  constructor(player1: Player, player2: Player) {
    this.players = [player1, player2];
  }

  async start(): Promise<void> {
    while (true) {
      this.board.print();
      const player = this.players[this.currentPlayerIndex];
      const move = await player.getMove();

      if (!this.board.isValidMove(move.row, move.col)) {
        console.log("Invalid move. That cell is already taken or out of range.");
        continue;
      }

      this.board.applyMove(move, player.symbol);

      if (this.board.checkWin(player.symbol)) {
        this.board.print();
        console.log(`${player.name} (${player.symbol}) wins!`);
        break;
      }

      if (this.board.isFull()) {
        this.board.print();
        console.log("It's a draw!");
        break;
      }

      this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }

    rl.close();
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

function parseMove(input: string): Move | null {
  input = input.trim().toLowerCase();
  const rowMap: { [key: string]: number } = { '1': 0, '2': 1, '3': 2 };
  const colMap: { [key: string]: number } = { 'a': 0, 'b': 1, 'c': 2 };

  if (input.length !== 2) return null;

  const row = rowMap[input[0]];
  const col = colMap[input[1]];

  if (row === undefined || col === undefined) return null;

  return new Move(row, col);
}

async function main() {
  const player1 = new HumanPlayer("P1", "X");
  const player2 = new HumanPlayer("P2", "O");
  const game = new Game(player1, player2);
  await game.start();
}

main();
