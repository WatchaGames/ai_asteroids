import Bullet from './bullet.js';
import Spaceship from './spaceship.js';
import Asteroid from './asteroid.js';
import Starfield from './starfield.js';
import EngineParticles from './engineParticles.js';
import ExplosionParticles from './explosionParticles.js';
import SoundManager from './soundManager.js';
import Bonus from './bonus.js';
import PowerUp from './powerUp.js';

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
    bonus: 0.5,  // Add bonus sound
    powerUp: 0.5,  // Add power-up sound
    powerDouble: 0.5,  // Add rear bullet power-up sound
    powerQuad: 0.5     // Add quad fire power-up sound
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
    const powerUps = [];
    let score = 0;
    let lives = 3;
    let gameOver = false;
    let debugMode = false;
    let lastBonusSpawn = 0;
    let lastPowerUpSpawn = 0;
    const BONUS_SPAWN_INTERVAL = 10000; // Spawn bonus every 10 seconds
    const POWER_UP_SPAWN_INTERVAL = 15000; // Spawn power-up every 15 seconds
    let rearBulletActive = false;
    let rearBulletTimer = null;
    let quadFireActive = false;
    let quadFireTimer = null;
    let scoreMultiplier = 1;
    let scoreMultiplierTimer = null;

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

    // Add multiplier text
    const multiplierText = new PIXI.Text({
        text: '',
        style: { 
            fill: 0xFFFF00,
            fontSize: 16,
            fontWeight: 'bold'
        }
    });
    multiplierText.x = 10;
    multiplierText.y = 35;
    multiplierText.visible = false;
    app.stage.addChild(multiplierText);

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
                if (quadFireActive) {
                    // Shoot in all four directions
                    const angles = [
                        player.sprite.rotation,           // Forward
                        player.sprite.rotation + Math.PI, // Backward
                        player.sprite.rotation + Math.PI/2, // Right
                        player.sprite.rotation - Math.PI/2  // Left
                    ];
                    
                    angles.forEach(angle => {
                        const bullet = new Bullet(app, player.sprite.x, player.sprite.y, angle);
                        bullets.push(bullet);
                        soundManager.play('shoot');
                    });
                } else if (rearBulletActive) {
                    // Shoot forward and backward
                    const bullet = new Bullet(app, player.sprite.x, player.sprite.y, player.sprite.rotation);
                    bullets.push(bullet);
                    soundManager.play('shoot');
                    
                    const rearBullet = new Bullet(app, player.sprite.x, player.sprite.y, player.sprite.rotation + Math.PI);
                    bullets.push(rearBullet);
                    soundManager.play('shoot');
                } else {
                    // Normal forward shot
                    const bullet = new Bullet(app, player.sprite.x, player.sprite.y, player.sprite.rotation);
                    bullets.push(bullet);
                    soundManager.play('shoot');
                }
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

    function updatePowerUps() {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            if (powerUps[i].update()) {
                powerUps.splice(i, 1);
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
        
        let points = 0;
        if (asteroid.sizeLevel === 'large') {
            points = 20;
            const newAsteroids = asteroid.split();
            asteroids.push(...newAsteroids);
        } else if (asteroid.sizeLevel === 'medium') {
            points = 50;
            const newAsteroids = asteroid.split();
            asteroids.push(...newAsteroids);
        } else if (asteroid.sizeLevel === 'small') {
            points = 100;
        }
        
        // Apply score multiplier
        score += points * scoreMultiplier;
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
                    // Remove bullet and bonus without adding points
                    app.stage.removeChild(bullet.sprite);
                    bullets.splice(i, 1);
                    
                    // Store bonus position before destroying
                    const startX = bonus.sprite.x;
                    const startY = bonus.sprite.y;
                    const targetX = 10; // Score text X position
                    const targetY = 10; // Score text Y position
                    bonus.destroy();
                    bonuses.splice(j, 1);
                    
                    // Clear any existing multiplier timer
                    if (scoreMultiplierTimer) {
                        clearTimeout(scoreMultiplierTimer);
                    }
                    
                    // Activate score multiplier
                    scoreMultiplier = 2;
                    multiplierText.text = 'Score x2!';
                    multiplierText.visible = true;
                    
                    // Set timer to deactivate after 10 seconds
                    scoreMultiplierTimer = setTimeout(() => {
                        scoreMultiplier = 1;
                        multiplierText.visible = false;
                    }, 10000);
                    
                    // Play bonus sound
                    soundManager.play('bonus_double');
                    
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
                    
                    return; // Exit the function to prevent further collision checks
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

    function checkPowerUpCollisions() {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const powerUp = powerUps[i];
            const dx = player.sprite.x - powerUp.sprite.x;
            const dy = player.sprite.y - powerUp.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < player.radius + powerUp.radius) { // Use power-up's radius
                // Handle power-up collection
                switch(powerUp.type) {
                    case 'rearBullet':
                        // Clear any existing timer
                        if (rearBulletTimer) {
                            clearTimeout(rearBulletTimer);
                        }
                        // Activate rear bullet power-up
                        rearBulletActive = true;
                        // Set timer to deactivate after 10 seconds
                        rearBulletTimer = setTimeout(() => {
                            rearBulletActive = false;
                        }, 10000);
                        // Play rear bullet power-up sound
                        soundManager.play('power_double');
                        break;
                    case 'quadFire':
                        // Clear any existing timer
                        if (quadFireTimer) {
                            clearTimeout(quadFireTimer);
                        }
                        // Activate quad fire power-up
                        quadFireActive = true;
                        // Set timer to deactivate after 10 seconds
                        quadFireTimer = setTimeout(() => {
                            quadFireActive = false;
                        }, 10000);
                        // Play quad fire power-up sound
                        soundManager.play('power_quad');
                        break;
                }
                
                // Remove power-up
                powerUp.destroy();
                powerUps.splice(i, 1);
            }
        }
    }

    // Game Loop
    app.ticker.add(() => {
        if (!gameOver) {
            player.update();
            starfield.update(player.velocity);
            
            // Spawn bonus and power-up periodically
            const currentTime = Date.now();
            if (currentTime - lastBonusSpawn > BONUS_SPAWN_INTERVAL) {
                bonuses.push(new Bonus(app));
                lastBonusSpawn = currentTime;
            }
            
            if (currentTime - lastPowerUpSpawn > POWER_UP_SPAWN_INTERVAL) {
                // Randomly choose between power-up types
                const powerUpType = Math.random() < 0.5 ? 'rearBullet' : 'quadFire';
                console.log('Spawning power-up:', powerUpType); // Debug log
                powerUps.push(new PowerUp(app, powerUpType));
                lastPowerUpSpawn = currentTime;
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
            updatePowerUps();
            checkCollisions();
            checkBonusCollisions();
            checkPlayerCollisions();
            checkWave();
            checkPowerUpCollisions();
        }
    });
}

// Start the game
initGame().catch(console.error); 