import Bullet from './bullet.js';
import Spaceship from './spaceship.js';
import Asteroid from './asteroid.js';
import Starfield from './starfield.js';
import EngineParticles from './engineParticles.js';
import SoundManager from './soundManager.js';

// Sound configuration
const SOUND_CONFIG = {
    thrust: 0.2,        // Reduced from 0.5
    shoot: 0.3,
    explosionLarge: 0.4,
    explosionMedium: 0.4,
    explosionSmall: 0.4,
    gameOver: 0.6,
    teleport: 0.3    // Add teleport sound
};

async function initGame() {
    // Initialize PixiJS Application
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundAlpha: 1,
        powerPreference: "high-performance",
        hello: true,
        forceCanvas: false
    });

    // Initialize PixiJS
    await app.init();
    document.body.appendChild(app.canvas);

    // Create starfield before other game objects
    const starfield = new Starfield(app);
    const engineParticles = new EngineParticles(app);
    const soundManager = new SoundManager(SOUND_CONFIG);  // Pass sound configuration

    // Game State Variables
    const player = new Spaceship(app);
    const asteroids = [];
    const bullets = [];
    let score = 0;
    let lives = 3;
    let gameOver = false;
    let debugMode = false;  // Debug mode state

    // UI Elements
    const scoreText = new PIXI.Text('Score: 0', { fill: 0xFFFFFF });
    scoreText.x = 10;
    scoreText.y = 10;
    app.stage.addChild(scoreText);

    const livesText = new PIXI.Text('Lives: 3', { fill: 0xFFFFFF });
    livesText.x = app.screen.width - 100;
    livesText.y = 10;
    app.stage.addChild(livesText);

    // Add debug text for rotation and position (using CGA bright green)
    const debugText = new PIXI.Text('Debug Info', { 
        fill: 0x55FF55,  // CGA bright green
        fontSize: 14
    });
    debugText.x = 10;
    debugText.y = 40;  // Position below score
    debugText.visible = debugMode;  // Initially hidden
    app.stage.addChild(debugText);

    // Initialize Asteroids
    for (let i = 0; i < 5; i++) {
        asteroids.push(new Asteroid(app, 30, 'large'));
    }

    // Keyboard Input Handling
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                player.isRotatingLeft = true;
                break;
            case 'ArrowRight':
                player.isRotatingRight = true;
                break;
            case 'ArrowUp':
                player.isMovingForward = true;
                soundManager.startThrust();  // Start engine sound
                break;
            case ' ':
                const bullet = new Bullet(app, player.sprite.x, player.sprite.y, player.sprite.rotation);
                bullets.push(bullet);
                soundManager.play('shoot');  // Use generic play function
                break;
            case 'Shift':
                // Get random position within screen bounds (with padding)
                const padding = 50;  // Keep away from edges
                const newX = padding + Math.random() * (app.screen.width - 2 * padding);
                const newY = padding + Math.random() * (app.screen.height - 2 * padding);
                player.teleport(newX, newY);
                soundManager.play('teleport');  // Use generic play function
                break;
            case 'd':
            case 'D':
                debugMode = !debugMode;
                debugText.visible = debugMode;
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                player.isRotatingLeft = false;
                break;
            case 'ArrowRight':
                player.isRotatingRight = false;
                break;
            case 'ArrowUp':
                player.isMovingForward = false;
                soundManager.stopThrust();  // Stop engine sound
                break;
        }
    });

    // Update Functions
    function updateAsteroids() {
        asteroids.forEach(asteroid => asteroid.update());
    }

    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i].update()) {
                bullets.splice(i, 1);
            }
        }
    }

    function destroyAsteroid(asteroid, index) {
        asteroid.destroy();
        asteroids.splice(index, 1);
        
        soundManager.playExplosion(asteroid.sizeLevel);  // Play explosion sound
        
        if (asteroid.sizeLevel === 'large') {
            score += 20;
            const newAsteroids = asteroid.split();
            asteroids.push(...newAsteroids);
        } else if (asteroid.sizeLevel === 'medium') {
            score += 50;
            const newAsteroids = asteroid.split();
            asteroids.push(...newAsteroids);
        } else if (asteroid.sizeLevel === 'small') {
            score += 100;
        }
        
        scoreText.text = 'Score: ' + score;
    }

    function checkCollisions() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            for (let j = asteroids.length - 1; j >= 0; j--) {
                const asteroid = asteroids[j];
                const dx = bullet.sprite.x - asteroid.sprite.x;
                const dy = bullet.sprite.y - asteroid.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < bullet.radius + asteroid.radius) {
                    app.stage.removeChild(bullet.sprite);
                    bullets.splice(i, 1);
                    destroyAsteroid(asteroid, j);
                    break; // Bullet can only hit one asteroid
                }
            }
        }
    }

    function checkPlayerCollisions() {
        if (gameOver) return;
        for (let asteroid of asteroids) {
            const dx = player.sprite.x - asteroid.sprite.x;
            const dy = player.sprite.y - asteroid.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < player.radius + asteroid.radius) {
                lives--;
                livesText.text = 'Lives: ' + lives;
                if (lives <= 0) {
                    gameOver = true;
                    soundManager.stopAll();  // Stop all sounds
                    soundManager.play('gameOver');  // Use generic play function
                    const style = new PIXI.TextStyle({ fill: 0xFFFFFF, fontSize: 48 });
                    const gameOverText = new PIXI.Text('Game Over', style);
                    gameOverText.x = app.screen.width / 2 - gameOverText.width / 2;
                    gameOverText.y = app.screen.height / 2 - gameOverText.height / 2;
                    app.stage.addChild(gameOverText);
                } else {
                    player.sprite.x = app.screen.width / 2;
                    player.sprite.y = app.screen.height / 2;
                    player.velocity = { x: 0, y: 0 };
                }
                break;
            }
        }
    }

    function checkWave() {
        if (asteroids.length === 0) {
            const numAsteroids = 5 + Math.floor(score / 1000); // Increase difficulty
            for (let i = 0; i < numAsteroids; i++) {
                asteroids.push(new Asteroid(app, 30, 'large'));
            }
        }
    }

    // Game Loop
    app.ticker.add(() => {
        if (!gameOver) {
            player.update();
            starfield.update(player.velocity);
            
            // Update debug display only when debug mode is on
            if (debugMode) {
                const rotationDegrees = (player.sprite.rotation * 180 / Math.PI).toFixed(1);
                const posX = player.sprite.x.toFixed(1);
                const posY = player.sprite.y.toFixed(1);
                debugText.text = `Rotation: ${rotationDegrees}°\nPosition: (${posX}, ${posY})`;
            }
            
            // Update engine particles
            if (player.isMovingForward) {
                engineParticles.emit(player.sprite.x, player.sprite.y, player.sprite.rotation);
            }
            engineParticles.update();
            
            updateAsteroids();
            updateBullets();
            checkCollisions();
            checkPlayerCollisions();
            checkWave();
        }
    });
}

// Start the game
initGame().catch(console.error); 