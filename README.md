# Snake Game

A responsive Snake game built with **vanilla HTML, CSS, and JavaScript**.  
Works on desktop (arrow keys) and mobile (swipe) with a high score saved in `localStorage`.

## Live Demo

Play it online: https://niicraymond.github.io/snake_game/

## Features

- Classic snake gameplay with emoji graphics (🐸 for the head, 🟢 for the body, 🍎 for food)  
- Responsive canvas that scales to the viewport (caps size on desktop)  
- Keyboard controls (arrow keys)  
- Touch swipe support for mobile  
- High score tracking stored locally in the browser  

## Getting Started

### Requirements

- Any modern browser (desktop or mobile)  
- No server required; can be opened directly or hosted (e.g., GitHub Pages)

### Running Locally

1. Clone or download the repository.  
2. Open the HTML file in your browser

## Gameplay

- Eat the 🍎 to grow longer. Each apple increases your score by 1.  
- Don’t run into the walls or your own body—doing so ends the game.  
- High score is saved between sessions.

## High Score

The game remembers your highest score locally. On game over:
- If you beat your previous high score, it’s updated and celebrated.  
- Otherwise you’re shown your current score and the stored high score.

To reset the high score manually (open browser console):
```js
localStorage.removeItem("snakeHighScore");
