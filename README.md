# Memory Game with 3D Flip Animations

A classic Memory (Concentration) card-matching game enhanced with smooth 3D flip animations, sound effects, and a timer/move counter system.

## Features

- 🎴 Smooth 3D card flip animations
- 📱 Responsive grid layout (adapts to desktop/mobile)
- 🎮 Multiple difficulty levels (Easy, Medium, Hard)
- ⏱️ Move counter and timer
- 🔊 Sound effects and haptic feedback
- 🏆 Local leaderboard system
- 🎉 Victory animations with confetti
- 💾 Score persistence using localStorage

## Tech Stack

- HTML5 / CSS3 / JavaScript
- GSAP 3 for enhanced animations
- Tailwind CSS for styling
- canvas-confetti for victory effects
- Howler.js for audio management

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Select difficulty level and start playing!

## How to Play

1. Click on any card to reveal its icon
2. Try to find the matching pair by clicking another card
3. If the cards match, they stay face up
4. If they don't match, they flip back after a short delay
5. Complete the game by matching all pairs
6. Try to achieve the best time and fewest moves!

## Development

The project uses a simple structure:
* **index.html** pins down the overall structure: it includes the header (title, timer, moves), the difficulty selection buttons, the grid container (where cards go), and the victory modal. It also pulls in all the external libraries via CDN (Tailwind, GSAP, Howler, etc.) and finally loads our three custom scripts.

* **css/styles.css** handles everything you see visually:

  * The 3D card styles and front/back faces.
  * Responsive rules so the grid shrinks or rearranges on smaller screens.
  * Animations like the pulse when you match a pair and the fade-in for the victory modal.

* **js/game.js** is where the “brain” of the game lives. It:

  * Defines the available watch brands and associates each with an icon.
  * Randomly selects pairs depending on the chosen difficulty.
  * Keeps track of flipped cards, matched pairs, moves, and time.
  * Handles the core logic of checking for matches, updating the move counter, and ending the game when done.

* **js/ui-effects.js** is all about making things look and feel nice:

  * Flips cards using GSAP’s `rotationY` tween.
  * Triggers a quick pulse on matched cards.
  * Manages showing/hiding the victory modal, including the confetti blast.

* **js/sounds.js** wraps Howler.js so we can play short audio clips:

  * A flip sound every time you turn over a card.
  * A match chime when you find the right pair.
  * A “wrong” buzz if your pair doesn’t match.
  * A victory fanfare when you finish the game.

* **assets/icons/** contains the luxury watch logos—one file per brand.

* **assets/sounds/** holds the MP3 files for each of the four sound effects.

## License

Feel free to use and modify for your own projects! 