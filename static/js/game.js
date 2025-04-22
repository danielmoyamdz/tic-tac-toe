class TicTacToe {
    constructor() {
        this.boardSize = 3;
        this.board = [];
        this.currentPlayer = 'X';
        this.gameMode = 'ai';
        this.gameActive = true;
        this.winningCombinations = [];
        
        this.initializeGame();
    }

    initializeGame() {
        this.boardSizeSelect = document.getElementById('boardSize');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restartButton');
        this.vsAIButton = document.getElementById('vsAI');
        this.vsHumanButton = document.getElementById('vsHuman');
        this.boardElement = document.getElementById('board');

        this.boardSizeSelect.addEventListener('change', () => {
            this.boardSize = parseInt(this.boardSizeSelect.value);
            this.updateWinningCombinations();
            this.restartGame();
        });

        this.restartButton.addEventListener('click', this.restartGame.bind(this));
        this.vsAIButton.addEventListener('click', () => this.setGameMode('ai'));
        this.vsHumanButton.addEventListener('click', () => this.setGameMode('human'));

        this.updateWinningCombinations();
        this.createBoard();
    }

    updateWinningCombinations() {
        this.winningCombinations = [];
        
        // Rows
        for (let i = 0; i < this.boardSize; i++) {
            const row = [];
            for (let j = 0; j < this.boardSize; j++) {
                row.push(i * this.boardSize + j);
            }
            this.winningCombinations.push(row);
        }
        
        // Columns
        for (let i = 0; i < this.boardSize; i++) {
            const col = [];
            for (let j = 0; j < this.boardSize; j++) {
                col.push(j * this.boardSize + i);
            }
            this.winningCombinations.push(col);
        }
        
        // Diagonals
        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < this.boardSize; i++) {
            diagonal1.push(i * this.boardSize + i);
            diagonal2.push(i * this.boardSize + (this.boardSize - 1 - i));
        }
        this.winningCombinations.push(diagonal1);
        this.winningCombinations.push(diagonal2);
    }

    createBoard() {
        this.board = Array(this.boardSize * this.boardSize).fill('');
        this.boardElement.style.gridTemplateColumns = `repeat(${this.boardSize}, auto)`;
        this.boardElement.innerHTML = '';
        
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-cell', '');
            cell.addEventListener('click', this.handleClick.bind(this), { once: true });
            this.boardElement.appendChild(cell);
        }
    }

    handleClick(e) {
        const cell = e.target;
        const index = Array.from(this.boardElement.children).indexOf(cell);

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
        const cell = this.boardElement.children[index];
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        if (this.checkWin()) {
            this.gameActive = false;
            this.statusDisplay.textContent = `Player ${this.currentPlayer} wins!`;
            this.animateWinningCells();
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

    animateWinningCells() {
        const winningCombo = this.winningCombinations.find(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });

        if (winningCombo) {
            winningCombo.forEach(index => {
                const cell = this.boardElement.children[index];
                cell.classList.add('winning-cell');
            });
        }
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
        this.board = Array(this.boardSize * this.boardSize).fill('');
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
        this.createBoard();
    }

    setGameMode(mode) {
        this.gameMode = mode;
        this.vsAIButton.classList.toggle('active', mode === 'ai');
        this.vsHumanButton.classList.toggle('active', mode === 'human');
        this.restartGame();
    }

    getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < this.board.length; i++) {
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

        if (this.checkWinForMinimax('O')) return scores.O - depth;
        if (this.checkWinForMinimax('X')) return scores.X + depth;
        if (this.checkDraw()) return scores.tie;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
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
            for (let i = 0; i < board.length; i++) {
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