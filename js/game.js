// Memory game with luxury watch theme
// Created by a watch enthusiast who loves coding :)

// Game settings
const LEVELS = {
    easy: { rows: 3, cols: 4, desc: "Quick game - 6 pairs" },
    medium: { rows: 4, cols: 4, desc: "Standard game - 8 pairs" },
    hard: { rows: 4, cols: 5, desc: "Challenge mode - 10 pairs" }
};

// Watch collection - hand-picked from the finest watchmakers
const WATCHES = [
    // German excellence
    { 
        brand: 'A. Lange & Söhne',
        img: 'assets/icons/A. Lange & Söhne.png',
        country: 'Germany',
        est: 1845
    },
    // Swiss legends
    {
        brand: 'IWC Schaffhausen',
        img: 'assets/icons/IWC Schaffhausen.png',
        country: 'Switzerland',
        est: 1868
    },
    {
        brand: 'Vacheron Constantin', // oldest watchmaker still in operation
        img: 'assets/icons/Vacheron Constantin.png',
        country: 'Switzerland',
        est: 1755
    },
    {
        brand: 'Jaeger-LeCoultre',
        img: 'assets/icons/Jaeger-LeCoultre.png',
        country: 'Switzerland',
        est: 1833
    },
    {
        brand: 'Patek Philippe',
        img: 'assets/icons/Patek Philippe.png',
        country: 'Switzerland',
        est: 1839
    },
    {
        brand: 'Ulysse Nardin',
        img: 'assets/icons/Ulysse Nardin.png',
        country: 'Switzerland',
        est: 1846
    },
    {
        brand: 'Breguet',
        img: 'assets/icons/Breguet.png',
        country: 'Switzerland',
        est: 1775
    },
    {
        brand: 'Blancpain',
        img: 'assets/icons/Blancpain.png',
        country: 'Switzerland',
        est: 1735
    },
    {
        brand: 'Rolex', // everyone knows this one
        img: 'assets/icons/Rolex.png',
        country: 'Switzerland',
        est: 1905
    },
    {
        brand: 'Audemars Piguet',
        img: 'assets/icons/Audemars Piguet.png',
        country: 'Switzerland',
        est: 1875
    }
];

class MemoryGame {
    constructor() {
        // Game state vars
        this.cards = [];
        this.flipped = [];
        this.matches = 0;
        this.moves = 0;
        this.gameOn = false;
        this.timer = null;
        this.seconds = 0;
        this.level = 'medium'; // default level
        this.busy = false;

        // Cache DOM elements
        this.board = document.getElementById('game-grid');
        this.moveDisplay = document.getElementById('moves');
        this.clock = document.getElementById('timer');
        this.levelBtns = document.querySelectorAll('.difficulty-btn');
        this.resetBtn = document.getElementById('play-again');

        // Wire up event listeners
        this.levelBtns.forEach(btn => {
            btn.onclick = () => {
                let level = btn.dataset.difficulty;
                let desc = LEVELS[level].desc;
                this.showHint(btn, `${level}: ${desc}`);
                this.changeLevel(level);
            };
        });
        
        this.resetBtn.onclick = () => this.reset();

        // Load high scores
        this.loadScores();
    }

    // Show a quick hint about game modes
    showHint(el, text) {
        let hint = document.createElement('div');
        hint.className = 'tooltip';
        hint.textContent = text;
        el.appendChild(hint);
        setTimeout(() => hint.remove(), 2000);
    }

    // Switch difficulty level
    changeLevel(level) {
        this.level = level;
        this.reset();
    }

    // Set up cards for new game
    setupCards() {
        let config = LEVELS[this.level];
        let pairs = (config.rows * config.cols) / 2;
        let picks = WATCHES.slice(0, pairs);
        
        // Double up the cards and give them IDs
        this.cards = [...picks, ...picks].map((watch, idx) => ({
            id: idx,
            brand: watch.brand,
            img: watch.img,
            flipped: false,
            matched: false,
            info: `${watch.brand} (${watch.est})`
        }));

        // Good old Fisher-Yates shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // Put cards on the board
    renderBoard() {
        let config = LEVELS[this.level];
        this.board.style.gridTemplateColumns = `repeat(${config.cols}, 180px)`;
        this.board.innerHTML = '';

        this.cards.forEach(card => {
            let el = document.createElement('div');
            el.className = 'card';
            el.dataset.id = card.id;
            
            // Each card has front/back faces
            el.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img 
                            src="${card.img}" 
                            alt="${card.brand}" 
                            class="brand-logo" 
                            title="${card.info}"
                        >
                    </div>
                    <div class="card-back"></div>
                </div>
            `;

            // Handle clicks
            el.onclick = () => this.flipCard(card, el);
            this.board.appendChild(el);
        });
    }

    // Handle card flips
    async flipCard(card, el) {
        // Ignore if game is busy or card is already handled
        if (this.busy || card.flipped || card.matched) return;
        
        // Start timer on first move
        if (!this.gameOn) {
            this.startTimer();
        }

        // Flip the card
        card.flipped = true;
        fx.flip(el, true);
        sounds.play('flip');
        
        this.flipped.push({ card, el });

        // Check for matches
        if (this.flipped.length === 2) {
            this.moves++;
            this.moveDisplay.textContent = `Moves: ${this.moves}`;
            this.busy = true;

            let [first, second] = this.flipped;
            
            if (first.card.brand === second.card.brand) {
                await this.pairMatched(first, second);
            } else {
                await this.pairMissed(first, second);
            }
        }
    }

    // Handle matching pairs
    async pairMatched(first, second) {
        first.card.matched = second.card.matched = true;
        this.matches++;

        // Show match effects
        await fx.match(first.el, second.el);
        sounds.play('match');

        this.flipped = [];
        this.busy = false;

        // Check for win
        if (this.matches === this.cards.length / 2) {
            this.victory();
        }
    }

    // Handle mismatched pairs
    async pairMissed(first, second) {
        // Show mismatch effects
        await fx.wrong(first.el, second.el);
        sounds.play('wrong');

        // Flip back after delay
        setTimeout(() => {
            first.card.flipped = second.card.flipped = false;
            fx.flip(first.el, false);
            fx.flip(second.el, false);
            this.flipped = [];
            this.busy = false;
        }, 1000);
    }

    // Start game timer
    startTimer() {
        this.gameOn = true;
        this.timer = setInterval(() => {
            this.seconds++;
            let min = Math.floor(this.seconds / 60);
            let sec = this.seconds % 60;
            this.clock.textContent = 
                `Time: ${min}:${sec.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Handle victory
    victory() {
        clearInterval(this.timer);
        
        let stars = this.ratePerformance();
        this.updateScores();
        
        // Victory celebration
        sounds.play('victory');
        fx.victory();
        fx.stars(stars);
        
        // Show final score
        let score = document.getElementById('final-score');
        let time = this.clock.textContent.slice(6);
        let msg = this.getEndMessage(stars);
        score.innerHTML = `
            <p>${msg}</p>
            <p>Time: ${time}</p>
            <p>Moves: ${this.moves}</p>
        `;
    }

    // Get end game message
    getEndMessage(stars) {
        // Fun messages based on performance
        if (stars === 3) return "Amazing! You're a natural! 🏆";
        if (stars === 2) return "Great job! Getting better! ⌚";
        return "Well done! Keep practicing! 🌟";
    }

    // Rate player's performance
    ratePerformance() {
        let config = LEVELS[this.level];
        let total = config.rows * config.cols;
        
        // Rating thresholds based on move count
        let limits = {
            3: total * 0.7,  // 3 stars: very efficient
            2: total * 1.2,  // 2 stars: decent
            1: total * 1.8   // 1 star: completed
        };

        for (let [stars, limit] of Object.entries(limits)) {
            if (this.moves >= limit) return Number(stars);
        }
        return 3; // Perfect game
    }

    // Load saved scores
    loadScores() {
        let scores = JSON.parse(localStorage.getItem('memoryScores')) || {
            easy: {},
            medium: {},
            hard: {}
        };

        // Update score display
        Object.entries(scores).forEach(([level, score]) => {
            let display = document.getElementById(`${level}-best`);
            if (score.time && score.moves) {
                let min = Math.floor(score.time / 60);
                let sec = score.time % 60;
                display.textContent = 
                    `Best: ${min}:${sec.toString().padStart(2, '0')} in ${score.moves} moves`;
            }
        });
    }

    // Update high scores
    updateScores() {
        let scores = JSON.parse(localStorage.getItem('memoryScores')) || {
            easy: {},
            medium: {},
            hard: {}
        };

        let current = scores[this.level];
        
        // Update if better score
        if (!current.time || this.seconds < current.time) {
            current.time = this.seconds;
        }
        if (!current.moves || this.moves < current.moves) {
            current.moves = this.moves;
        }

        localStorage.setItem('memoryScores', JSON.stringify(scores));
        this.loadScores();
    }

    // Reset game
    reset() {
        // Clear old game state
        clearInterval(this.timer);
        this.cards = [];
        this.flipped = [];
        this.matches = 0;
        this.moves = 0;
        this.seconds = 0;
        this.gameOn = false;
        this.busy = false;

        // Reset displays
        this.moveDisplay.textContent = 'Moves: 0';
        this.clock.textContent = 'Time: 00:00';

        // Hide victory screen
        fx.hideVictory();

        // Start fresh
        this.setupCards();
        this.renderBoard();
    }
}

// Start it up!
document.addEventListener('DOMContentLoaded', () => {
    let game = new MemoryGame();
    game.changeLevel('medium'); // Start with medium difficulty
}); 
