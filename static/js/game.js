class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameMode = 'ai';
        this.gameActive = true;
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
        
        this.initializeGame();
    }

    initializeGame() {
        this.cells = document.querySelectorAll('[data-cell]');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restartButton');
        this.vsAIButton = document.getElementById('vsAI');
        this.vsHumanButton = document.getElementById('vsHuman');

        this.cells.forEach(cell => {
            cell.addEventListener('click', this.handleClick.bind(this), { once: true });
        });

        this.restartButton.addEventListener('click', this.restartGame.bind(this));
        this.vsAIButton.addEventListener('click', () => this.setGameMode('ai'));
        this.vsHumanButton.addEventListener('click', () => this.setGameMode('human'));
    }

    handleClick(e) {
        const cell = e.target;
        const index = Array.from(this.cells).indexOf(cell);

        if (this.board[index] !== '' || !this.gameActive) return;

        this.makeMove(index);

        if (this.gameMode === 'ai' && this.gameActive) {
            setTimeout(() => {
                const aiMove = this.getBestMove();
                this.makeMove(aiMove);
            }, 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());
        
        if (this.checkWin()) {
            this.gameActive = false;
            this.statusDisplay.textContent = `Player ${this.currentPlayer} wins!`;
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            this.statusDisplay.textContent = "Game ended in a draw!";
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
        this.cells.forEach(cell => {
            cell.classList.remove('x', 'o');
            cell.removeEventListener('click', this.handleClick.bind(this));
            cell.addEventListener('click', this.handleClick.bind(this), { once: true });
        });
    }

    setGameMode(mode) {
        this.gameMode = mode;
        this.vsAIButton.classList.toggle('active', mode === 'ai');
        this.vsHumanButton.classList.toggle('active', mode === 'human');
        this.restartGame();
    }

    // AI implementation using Minimax algorithm
    getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        const scores = {
            X: -10,
            O: 10,
            tie: 0
        };

        // Check for terminal states
        if (this.checkWinForMinimax('O')) return scores.O - depth;
        if (this.checkWinForMinimax('X')) return scores.X + depth;
        if (this.checkDraw()) return scores.tie;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkWinForMinimax(player) {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === player;
            });
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
}); 