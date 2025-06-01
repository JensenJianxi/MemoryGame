// UI Effects Manager for the Luxury Watch Memory Game
// Handles all visual effects and animations to make the game more engaging

const fx = {
    // Flip a card over
    flip(card, show) {
        card.classList.toggle('flipped', show);
        
        // Add a bit of shine when card shows face
        if (show) {
            let shine = document.createElement('div');
            shine.className = 'card-shine';
            card.appendChild(shine);
            
            // Clean up after animation
            setTimeout(() => shine.remove(), 500);
        }
    },

    // Cards match animation
    async match(card1, card2) {
        // Add the glow effect
        card1.classList.add('matched');
        card2.classList.add('matched');

        // Sprinkle some sparkles
        this.addSparkles(card1);
        this.addSparkles(card2);

        // Wait for animations
        return new Promise(done => setTimeout(done, 800));
    },

    // Add sparkly effects to matched cards
    addSparkles(card) {
        // Create 5 sparkles at random positions
        for (let i = 0; i < 5; i++) {
            let spark = document.createElement('div');
            spark.className = 'sparkle';
            
            // Random position and timing
            spark.style.left = Math.random() * 100 + '%';
            spark.style.top = Math.random() * 100 + '%';
            spark.style.animationDelay = Math.random() * 300 + 'ms';
            
            card.appendChild(spark);
            
            // Clean up after animation
            setTimeout(() => spark.remove(), 1000);
        }
    },

    // Wrong match animation
    async wrong(card1, card2) {
        // Quick shake
        card1.classList.add('shake');
        card2.classList.add('shake');

        // Remove shake class when done
        setTimeout(() => {
            card1.classList.remove('shake');
            card2.classList.remove('shake');
        }, 500);

        return new Promise(done => setTimeout(done, 600));
    },

    // Show victory screen
    victory() {
        let modal = document.getElementById('victory-modal');
        modal.style.display = 'flex';
        
        // Fade in
        requestAnimationFrame(() => {
            modal.classList.add('visible');
        });

        // Add some confetti
        this.makeConfetti();

        // Add trophy with bounce
        let trophy = document.createElement('div');
        trophy.className = 'trophy';
        trophy.innerHTML = '🏆';
        modal.appendChild(trophy);
        
        setTimeout(() => trophy.classList.add('show'), 500);
    },

    // Create confetti particles
    makeConfetti() {
        // Add 100 pieces of confetti
        for (let i = 0; i < 100; i++) {
            let bit = document.createElement('div');
            bit.className = 'confetti';
            
            // Randomize each piece
            Object.assign(bit.style, {
                left: Math.random() * 100 + 'vw',
                animationDuration: (Math.random() * 3 + 2) + 's',
                animationDelay: Math.random() * 2 + 's',
                backgroundColor: this.pickConfettiColor()
            });
            
            document.body.appendChild(bit);
            
            // Clean up after animation
            setTimeout(() => bit.remove(), 5000);
        }
    },

    // Pick a random luxury color for confetti
    pickConfettiColor() {
        // Colors that match our luxury theme
        return [
            '#FFD700',  // gold
            '#C0C0C0',  // silver
            '#B87333',  // copper
            '#E5E4E2',  // platinum
            '#4B0082',  // royal purple
            '#00308F',  // navy
            '#800020'   // burgundy
        ][Math.floor(Math.random() * 7)];
    },

    // Hide victory screen
    hideVictory() {
        let modal = document.getElementById('victory-modal');
        modal.classList.remove('visible');
        
        // Clean up after fade out
        setTimeout(() => {
            modal.style.display = 'none';
            // Remove any leftover effects
            document.querySelectorAll('.confetti, .trophy')
                .forEach(el => el.remove());
        }, 300);
    },

    // Show star rating
    stars(count) {
        let container = document.getElementById('star-rating');
        container.innerHTML = '';

        // Add stars one by one
        for (let i = 0; i < 3; i++) {
            let star = document.createElement('span');
            star.className = 'star';
            star.textContent = i < count ? '⭐' : '☆';
            star.style.animationDelay = (i * 200) + 'ms';
            container.appendChild(star);
        }
    },

    // Show a tooltip
    tooltip(el, text) {
        let tip = document.createElement('div');
        tip.className = 'tooltip';
        tip.textContent = text;
        
        // Position above element
        let rect = el.getBoundingClientRect();
        tip.style.top = (rect.top - 30) + 'px';
        tip.style.left = (rect.left + rect.width/2) + 'px';
        
        document.body.appendChild(tip);
        
        // Fade in/out
        requestAnimationFrame(() => {
            tip.classList.add('show');
            setTimeout(() => {
                tip.classList.remove('show');
                setTimeout(() => tip.remove(), 300);
            }, 2000);
        });
    }
}; 