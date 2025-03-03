# Asteroids Game

A modern implementation of the classic Asteroids arcade game using JavaScript and PixiJS.

## Description

This is a web-based version of the classic Asteroids game where players control a spaceship to destroy asteroids and avoid collisions. The game features:

- Smooth spaceship controls with rotation and thrust
- Shooting mechanics
- Asteroid splitting mechanics
- Score tracking
- Lives system
- Game over state

## Technologies Used

- HTML5
- JavaScript (ES6+)
- PixiJS for rendering
- ES Modules for code organization

## How to Play

- Use Arrow keys to control the spaceship:
  - ↑ (Up Arrow) for thrust
  - ← (Left Arrow) to rotate left
  - → (Right Arrow) to rotate right
- Press Spacebar to shoot
- Avoid colliding with asteroids
- Destroy asteroids to score points:
  - Large asteroids: 20 points
  - Medium asteroids: 50 points
  - Small asteroids: 100 points

## Setup

1. Clone the repository
2. Serve the files using a local web server (required for ES modules)
   ```bash
   # Using Python 3
   python -m http.server 8000
   # OR using Node.js http-server
   npx http-server
   ```
3. Open your browser and navigate to `http://localhost:8000`

## Project Structure

- `index.html` - Main HTML file
- `game.js` - Main game logic and initialization
- `spaceship.js` - Spaceship class implementation
- `bullet.js` - Bullet class implementation
- `asteroid.js` - Asteroid class implementation

## License

MIT License 