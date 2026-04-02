class BombSquadGame {
    constructor() {
        this.boardSize = 9;
        this.maxBombs = 3;
        
        // State
        this.state = {
            phase: 'menu', // menu, p1_place, p2_place, p1_turn, p2_turn, game_over
            p1Bombs: [], // array of indices
            p2Bombs: [],
            p1Strikes: 0,
            p2Strikes: 0,
            p1Guesses: [], // indices
            p2Guesses: [],
            currentPlacementBombs: [] // temporary holding during placement
        };

        this.screens = {
            mainMenu: document.getElementById('screen-main-menu'),
            passDevice: document.getElementById('screen-pass-device'),
            turnNotice: document.getElementById('screen-turn-notice'),
            board: document.getElementById('screen-board'),
            gameOver: document.getElementById('screen-game-over')
        };

        this.initGrid();
    }

    initGrid() {
        const grid = document.getElementById('game-grid');
        grid.innerHTML = '';
        for (let i = 0; i < this.boardSize; i++) {
            const square = document.createElement('div');
            square.className = 'grid-square';
            square.dataset.index = i;
            square.addEventListener('click', () => this.handleSquareClick(i));
            grid.appendChild(square);
        }
    }

    switchScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        if (this.screens[screenName]) {
            setTimeout(() => {
                this.screens[screenName].classList.add('active');
            }, 50); // slight delay for smooth transition
        }
    }

    startGame() {
        this.state.p1Bombs = [];
        this.state.p2Bombs = [];
        this.state.p1Strikes = 0;
        this.state.p2Strikes = 0;
        this.state.p1Guesses = [];
        this.state.p2Guesses = [];
        
        this.setupPassDevice('p1_place', 'Player 1', 'Player 1, it\'s time to hide your bombs.', 'p1-color');
    }

    setupPassDevice(nextPhase, title, desc, colorClass) {
        this.state.phase = nextPhase;
        
        const pt = document.getElementById('pass-title');
        const pd = document.getElementById('pass-desc');
        const pb = document.getElementById('pass-btn');
        const wrap = document.querySelector('.pass-icon');

        pt.innerText = title;
        pd.innerText = desc;
        
        // Update color
        wrap.className = `icon-wrap pass-icon ${colorClass}`;
        
        this.switchScreen('passDevice');
    }

    acknowledgePass() {
        if (this.state.phase === 'p1_place') {
            this.startPlacement('Player 1', 'p1-color');
        } else if (this.state.phase === 'p2_place') {
            this.startPlacement('Player 2', 'p2-color');
        }
    }

    startPlacement(playerName, colorClass) {
        this.state.currentPlacementBombs = [];
        document.getElementById('board-player-pill').className = `player-pill ${colorClass}`;
        document.getElementById('board-player-pill').innerText = playerName;
        document.getElementById('board-status').innerText = 'Hide 3 Bombs';
        document.getElementById('bomb-count-val').innerText = '0/3';
        document.getElementById('bomb-counter').classList.remove('hidden');
        document.getElementById('health-bars').classList.add('hidden');
        document.getElementById('board-action-btn').classList.add('hidden');

        this.resetGridUI();

        this.switchScreen('board');
    }

    resetGridUI() {
        const squares = document.querySelectorAll('.grid-square');
        squares.forEach(sq => {
            sq.className = 'grid-square';
            sq.innerHTML = '';
        });
    }

    handleSquareClick(index) {
        if (this.state.phase === 'p1_place' || this.state.phase === 'p2_place') {
            this.handlePlacementClick(index);
        } else if (this.state.phase === 'p1_turn' || this.state.phase === 'p2_turn') {
            this.handleGuessClick(index);
        }
    }

    handlePlacementClick(index) {
        const idx = this.state.currentPlacementBombs.indexOf(index);
        if (idx > -1) {
            // Remove bomb
            this.state.currentPlacementBombs.splice(idx, 1);
            document.querySelector(`.grid-square[data-index="${index}"]`).classList.remove('selected-bomb');
            document.querySelector(`.grid-square[data-index="${index}"]`).innerHTML = '';
        } else {
            // Add bomb
            if (this.state.currentPlacementBombs.length < this.maxBombs) {
                this.state.currentPlacementBombs.push(index);
                const sq = document.querySelector(`.grid-square[data-index="${index}"]`);
                sq.classList.add('selected-bomb');
                sq.innerHTML = '💣';
            }
        }

        document.getElementById('bomb-count-val').innerText = `${this.state.currentPlacementBombs.length}/${this.maxBombs}`;
        
        const btn = document.getElementById('board-action-btn');
        if (this.state.currentPlacementBombs.length === this.maxBombs) {
            btn.classList.remove('hidden');
            btn.innerText = "Confirm Placement";
        } else {
            btn.classList.add('hidden');
        }
    }

    boardAction() {
        if (this.state.phase === 'p1_place') {
            this.state.p1Bombs = [...this.state.currentPlacementBombs];
            this.setupPassDevice('p2_place', 'Player 2 Mode', 'Player 2, it\'s time to hide your bombs.', 'p2-color');
        } else if (this.state.phase === 'p2_place') {
            this.state.p2Bombs = [...this.state.currentPlacementBombs];
            this.setupTurnNotice('p1_turn', 'Player 1', 'p1-color');
        } else if (this.state.phase === 'p1_turn') {
            this.setupTurnNotice('p2_turn', 'Player 2', 'p2-color');
        } else if (this.state.phase === 'p2_turn') {
            this.setupTurnNotice('p1_turn', 'Player 1', 'p1-color');
        }
    }

    setupTurnNotice(nextPhase, playerName, colorClass) {
        this.state.phase = nextPhase;
        const ind = document.getElementById('turn-player-indicator');
        ind.className = `player-indicator ${colorClass}`;
        ind.innerText = playerName;
        
        this.switchScreen('turnNotice');
    }

    acknowledgeTurn() {
        const isP1Turn = this.state.phase === 'p1_turn';
        const colorClass = isP1Turn ? 'p1-color' : 'p2-color';
        const oppName = isP1Turn ? "P2's Board" : "P1's Board";
        const playerName = isP1Turn ? 'Player 1' : 'Player 2';

        document.getElementById('board-player-pill').className = `player-pill ${colorClass}`;
        document.getElementById('board-player-pill').innerText = playerName;
        document.getElementById('board-status').innerText = `Guessing on ${oppName}`;
        
        document.getElementById('bomb-counter').classList.add('hidden');
        document.getElementById('health-bars').classList.remove('hidden');
        document.getElementById('board-action-btn').classList.add('hidden');
        
        this.updateHealthBars();
        this.resetGridUI();
        this.repaintGuesses();

        this.switchScreen('board');
    }

    updateHealthBars() {
        const renderStrikes = (containerId, strikes) => {
            const slots = document.getElementById(containerId).children;
            for (let i = 0; i < 3; i++) {
                if (i < strikes) {
                    slots[i].classList.add('filled');
                } else {
                    slots[i].classList.remove('filled');
                }
            }
        };
        renderStrikes('p1-strikes', this.state.p1Strikes);
        renderStrikes('p2-strikes', this.state.p2Strikes);
    }

    repaintGuesses() {
        const isP1Turn = this.state.phase === 'p1_turn';
        const guesses = isP1Turn ? this.state.p1Guesses : this.state.p2Guesses;
        const enemyBombs = isP1Turn ? this.state.p2Bombs : this.state.p1Bombs;

        guesses.forEach(g => {
            const sq = document.querySelector(`.grid-square[data-index="${g}"]`);
            if (enemyBombs.includes(g)) {
                sq.classList.add('revealed-bomb');
                sq.innerHTML = '💣';
            } else {
                sq.classList.add('revealed-safe');
                sq.innerHTML = '✓';
            }
        });
    }

    handleGuessClick(index) {
        const isP1Turn = this.state.phase === 'p1_turn';
        const guesses = isP1Turn ? this.state.p1Guesses : this.state.p2Guesses;
        const enemyBombs = isP1Turn ? this.state.p2Bombs : this.state.p1Bombs;

        // Prevent double clicking
        if (guesses.includes(index)) return;
        
        // Prevent clicking when action button is visible
        if (!document.getElementById('board-action-btn').classList.contains('hidden')) return;

        guesses.push(index);
        const sq = document.querySelector(`.grid-square[data-index="${index}"]`);

        let hitBomb = false;
        if (enemyBombs.includes(index)) {
            // Hit a bomb
            sq.classList.add('revealed-bomb');
            sq.innerHTML = '💣';
            if (isP1Turn) this.state.p1Strikes++;
            else this.state.p2Strikes++;
            hitBomb = true;
        } else {
            // Safe
            sq.classList.add('revealed-safe');
            sq.innerHTML = '✓';
        }

        this.updateHealthBars();

        // Check lose condition
        if (this.state.p1Strikes >= 3 || this.state.p2Strikes >= 3) {
            setTimeout(() => this.triggerGameOver(), 1000);
            return;
        }

        // Show Next Turn button
        const btn = document.getElementById('board-action-btn');
        btn.classList.remove('hidden');
        btn.innerText = "End Turn";
    }

    triggerGameOver() {
        this.state.phase = 'game_over';
        const p1Lost = this.state.p1Strikes >= 3;
        
        document.getElementById('winner-text').innerText = p1Lost ? 'PLAYER 2 WINS' : 'PLAYER 1 WINS';
        document.getElementById('winner-text').className = `title main-title ${p1Lost ? 'p2-color-text' : 'p1-color-text'}`;
        document.getElementById('loser-text').innerText = p1Lost ? 'Player 1 hit 3 bombs.' : 'Player 2 hit 3 bombs.';

        this.drawMiniBoards();
        this.switchScreen('gameOver');
    }

    drawMiniBoards() {
        const draw = (id, bombs) => {
            const grid = document.getElementById(id);
            grid.innerHTML = '';
            for (let i = 0; i < this.boardSize; i++) {
                const cell = document.createElement('div');
                cell.className = 'mini-cell';
                if (bombs.includes(i)) cell.classList.add('bomb');
                else cell.classList.add('safe');
                grid.appendChild(cell);
            }
        };
        draw('mini-grid-1', this.state.p1Bombs);
        draw('mini-grid-2', this.state.p2Bombs);
    }

    resetGame() {
        this.switchScreen('mainMenu');
    }
}

// Initialize
const game = new BombSquadGame();
