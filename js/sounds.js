// Game sounds manager
// Handles all the audio for better user feedback

const sounds = {
    // Our sound collection
    fx: {
        flip: new Audio('assets/sounds/card-flip.mp3'),
        match: new Audio('assets/sounds/match-chime.mp3'),
        wrong: new Audio('assets/sounds/wrong-note.mp3'),
        win: new Audio('assets/sounds/victory-fanfare.mp3'),
        hover: new Audio('assets/sounds/hover-tick.mp3')
    },

    // Set everything up
    init() {
        // Set nice volume levels
        this.fx.flip.volume = 0.4;  // subtle
        this.fx.match.volume = 0.5; // noticeable
        this.fx.wrong.volume = 0.3; // gentle
        this.fx.win.volume = 0.6;   // celebratory
        this.fx.hover.volume = 0.2; // very subtle

        // Add hover sounds to buttons and cards
        document.querySelectorAll('.difficulty-btn, .card')
            .forEach(el => {
                el.onmouseenter = () => this.play('hover');
            });

        // Set up mute toggle
        let muteBtn = document.getElementById('sound-toggle');
        if (muteBtn) {
            muteBtn.onclick = () => this.toggleMute();
            this.updateMuteButton();
        }

        // Load all sounds
        Object.values(this.fx).forEach(sound => {
            sound.load();
        });
    },

    // Play a sound with optional variation
    play(name, vary = false) {
        if (this.muted()) return;

        let sound = this.fx[name];
        if (!sound) return;

        // Make a copy so we can play overlapping sounds
        let instance = sound.cloneNode();
        
        if (vary) {
            // Add slight variation to make it sound more natural
            instance.playbackRate = 0.9 + Math.random() * 0.2;
        }

        // Try to add reverb for fancier sound
        try {
            this.addReverb(instance);
        } catch(e) {
            // Reverb failed, just play normal sound
            console.log('No reverb available:', e);
        }
        
        // Play the sound
        instance.play().catch(e => {
            console.log('Sound blocked:', e);
        });
    },

    // Add some reverb for fancier sound
    addReverb(audio) {
        let ctx = new (window.AudioContext || window.webkitAudioContext)();
        let source = ctx.createMediaElementSource(audio);
        let reverb = ctx.createConvolver();
        
        // Create a nice reverb effect
        let rate = 44100;
        let length = rate * 2; // 2 second reverb
        let decay = 0.1;
        let impulse = ctx.createBuffer(2, length, rate);
        
        // Fill both channels with reverb data
        for (let channel = 0; channel < 2; channel++) {
            let data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * 
                         Math.pow(1 - i / length, decay);
            }
        }
        
        // Hook it all up
        reverb.buffer = impulse;
        source.connect(reverb);
        reverb.connect(ctx.destination);
    },

    // Check if sound is muted
    muted() {
        return localStorage.getItem('gameMuted') === 'true';
    },

    // Toggle sound on/off
    toggleMute() {
        let muted = this.muted();
        localStorage.setItem('gameMuted', !muted);
        this.updateMuteButton();
        
        // Play test sound when unmuting
        if (!this.muted()) {
            this.play('hover');
        }
    },

    // Update mute button icon
    updateMuteButton() {
        let btn = document.getElementById('sound-toggle');
        if (!btn) return;

        let icon = btn.querySelector('i') || btn;
        icon.className = this.muted() ? 
            'fas fa-volume-mute' : 
            'fas fa-volume-up';
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    sounds.init();
}); 