import Bullet from './bullet.js';
import Spaceship from './spaceship.js';
import Asteroid from './asteroid.js';
import Starfield from './starfield.js';
import EngineParticles from './engineParticles.js';
import ExplosionParticles from './explosionParticles.js';
import SoundManager from './soundManager.js';
import Bonus from './bonus.js';

// Sound configuration
const SOUND_CONFIG = {
    thrust: 0.2,        // Reduced from 0.5
    shoot: 0.3,
    explosionLarge: 0.4,
    explosionMedium: 0.4,
    explosionSmall: 0.4,
    gameOver: 0.6,
    teleport: 0.3,    // Add teleport sound
    spaceshipExplode: 0.5,  // Add spaceship explosion sound
    bonus: 0.5  // Add bonus sound
};

async function initGame() {
    // Initialize PixiJS Application
    const app = new PIXI.Application();
    await app.init({
        width: 800,
        height: 600,
        background: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundAlpha: 1,
        powerPreference: "high-performance"
    });

    // Initialize PixiJS
    document.body.appendChild(app.canvas);

    // Create starfield before other game objects
    const starfield = new Starfield(app);
    const engineParticles = new EngineParticles(app);
    const explosionParticles = new ExplosionParticles(app);
    const soundManager = new SoundManager(SOUND_CONFIG);

    // Game State Variables
    const player = new Spaceship(app);
    const asteroids = [];
    const bullets = [];
    const bonuses = [];
    let score = 0;
    let lives = 3;
    let gameOver = false;
    let debugMode = false;
    let lastBonusSpawn = 0;
    const BONUS_SPAWN_INTERVAL = 10000; // Spawn bonus every 10 seconds

    // UI Elements
    const scoreText = new PIXI.Text({
        text: 'Score: 0',
        style: { fill: 0xFFFFFF }
    });
    scoreText.x = 10;
    scoreText.y = 10;
    app.stage.addChild(scoreText);

    const livesText = new PIXI.Text({
        text: 'Lives: 3',
        style: { fill: 0xFFFFFF }
    });
    livesText.x = app.screen.width - 100;
    livesText.y = 10;
    app.stage.addChild(livesText);

    // Add debug text for rotation and position (using CGA bright green)
    const debugText = new PIXI.Text({
        text: 'Debug Info',
        style: { 
            fill: 0x55FF55,  // CGA bright green
            fontSize: 14
        }
    });
    debugText.x = 10;
    debugText.y = 40;
    debugText.visible = debugMode;
    app.stage.addChild(debugText);

    // Add bonus text for multiplier
    const bonusText = new PIXI.Text({
        text: '',
        style: { 
            fill: 0xFFFF00,
            fontSize: 24,
            fontWeight: 'bold'
        }
    });
    bonusText.x = app.screen.width / 2;
    bonusText.y = 50;
    bonusText.anchor.set(0.5);
    bonusText.visible = false;
    app.stage.addChild(bonusText);

    // Initialize Asteroids
    for (let i = 0; i < 5; i++) {
        asteroids.push(new Asteroid(app, 30, 'large'));
    }

    // Keyboard Input Handling
    document.addEventListener('keydown', (event) => {
        // Don't process input if player is teleporting
        if (player.isTeleporting) return;

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
                if(!player.isTeleporting) {
                    // Get random position within screen bounds (with padding)
                    const padding = 50;  // Keep away from edges
                    const newX = padding + Math.random() * (app.screen.width - 2 * padding);
                    const newY = padding + Math.random() * (app.screen.height - 2 * padding);
                    player.teleport(newX, newY);
                    soundManager.play('teleport');  // Use generic play function
                }
                break;
            case 'd':
            case 'D':
                debugMode = !debugMode;
                debugText.visible = debugMode;
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        // Don't process input if player is teleporting
        if (player.isTeleporting) return;

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

    function updateBonuses() {
        for (let i = bonuses.length - 1; i >= 0; i--) {
            if (bonuses[i].update()) {
                bonuses.splice(i, 1);
            }
        }
    }

    function destroyAsteroid(asteroid, index) {
        // Create explosion based on asteroid size
        const explosionColors = {
            large: 0xAA5500,  // Brown for large asteroids
            medium: 0x555555, // Dark gray for medium asteroids
            small: 0xAAAAAA   // Light gray for small asteroids
        };

        // Create explosion with size-dependent parameters
        const explosionSize = {
            large: 30,    // Larger explosion for big asteroids
            medium: 20,   // Medium explosion
            small: 10     // Smaller explosion
        };

        // Create the explosion effect with size
        explosionParticles.createExplosion(
            asteroid.sprite.x,
            asteroid.sprite.y,
            explosionColors[asteroid.sizeLevel],
            explosionSize[asteroid.sizeLevel]
        );

        // Play explosion sound
        soundManager.playExplosion(asteroid.sizeLevel);
        
        // Remove asteroid and update score
        asteroid.destroy();
        asteroids.splice(index, 1);
        
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

    function checkBonusCollisions() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            for (let j = bonuses.length - 1; j >= 0; j--) {
                const bonus = bonuses[j];
                const dx = bullet.sprite.x - bonus.sprite.x;
                const dy = bullet.sprite.y - bonus.sprite.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 15) { // Collision radius for bonus
                    // Remove bullet and bonus
                    app.stage.removeChild(bullet.sprite);
                    bullets.splice(i, 1);
                    
                    // Store bonus position before destroying
                    const startX = bonus.sprite.x;
                    const startY = bonus.sprite.y;
                    const targetX = 10; // Score text X position
                    const targetY = 10; // Score text Y position
                    bonus.destroy();
                    bonuses.splice(j, 1);
                    
                    // Double the score
                    score *= 2;
                    scoreText.text = 'Score: ' + score;
                    
                    // Play bonus sound
                    soundManager.play('bonus');
                    
                    // Show bonus text at bonus location
                    bonusText.text = 'x2!';
                    bonusText.x = startX;
                    bonusText.y = startY;
                    bonusText.visible = true;
                    bonusText.alpha = 1;
                    
                    // Animate text flying to score
                    let startTime = Date.now();
                    const flyToScore = () => {
                        const elapsed = Date.now() - startTime;
                        if (elapsed < 1000) { // Animation duration increased to 1 second
                            // Calculate progress (0 to 1)
                            const progress = elapsed / 1000;
                            // Move position
                            bonusText.x = startX + (targetX - startX) * progress;
                            bonusText.y = startY + (targetY - startY) * progress;
                            // Fade out
                            bonusText.alpha = 1 - progress;
                            requestAnimationFrame(flyToScore);
                        } else {
                            bonusText.visible = false;
                        }
                    };
                    flyToScore();
                    
                    break; // Bullet can only hit one bonus
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
                    soundManager.stopAll();
                    soundManager.play('spaceshipExplode');
                    soundManager.play('gameOver');
                    // Create cyan explosion at ship's position
                    explosionParticles.createExplosion(player.sprite.x, player.sprite.y, 0x55FFFF);
                    const gameOverText = new PIXI.Text({
                        text: 'Game Over',
                        style: { fill: 0xFFFFFF, fontSize: 48 }
                    });
                    gameOverText.x = app.screen.width / 2 - gameOverText.width / 2;
                    gameOverText.y = app.screen.height / 2 - gameOverText.height / 2;
                    app.stage.addChild(gameOverText);
                } else {
                    // Create cyan explosion at ship's position before respawning
                    explosionParticles.createExplosion(player.sprite.x, player.sprite.y, 0x55FFFF);
                    soundManager.play('spaceshipExplode');
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
            
            // Spawn bonus periodically
            const currentTime = Date.now();
            if (currentTime - lastBonusSpawn > BONUS_SPAWN_INTERVAL) {
                bonuses.push(new Bonus(app));
                lastBonusSpawn = currentTime;
            }
            
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
            explosionParticles.update();  // Update explosion particles
            
            updateAsteroids();
            updateBullets();
            updateBonuses();
            checkCollisions();
            checkBonusCollisions();
            checkPlayerCollisions();
            checkWave();
        }
    });
}

// Start the game
initGame().catch(console.error); 