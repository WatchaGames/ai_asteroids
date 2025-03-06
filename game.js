import Bullet from './bullet.js';
import Spaceship from './spaceship.js';
import Asteroid from './asteroid.js';
import Starfield from './starfield.js';
import EngineParticles from './engineParticles.js';
import ExplosionParticles from './explosionParticles.js';
import SoundManager from './soundManager.js';
import Bonus from './bonus.js';
import PowerUp from './powerUp.js';
import { showGameOver, hideGameOver } from './game_over_screen.js';
import { palette10 } from './palette.js';
import { 
    spawnAsteroidsForWave, 
    destroyAllGameObjects, 
    checkPowerUpCollisions, 
    checkPlayerCollisions, 
    checkBonusCollisions, 
    destroyAsteroid, 
    checkCollisions,
    updateAsteroids,
    updateBullets,
    updateBonuses,
    updatePowerUps
} from './battle.js';

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
    let currentWave = 1; // Track current wave number

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

    // Add wave counter text
    const waveText = new PIXI.Text({
        text: 'Wave 1',
        style: { 
            fill: 0xFFFFFF,
            fontSize: 20,
            fontWeight: 'bold'
        }
    });
    waveText.x = app.screen.width / 2;
    waveText.y = 10;
    waveText.anchor.set(0.5); // Center the text
    app.stage.addChild(waveText);

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


    spawnAsteroidsForWave(score, currentWave);

    function restartGame() {
        // Reset game state
        gameOver = false;
        score = 0;
        lives = 3;
        currentWave = 1;
        scoreText.text = 'Score: 0';
        livesText.text = 'Lives: 3';
        waveText.text = 'Wave 1';
        
        // Clear existing game elements
        destroyAllGameObjects(app, asteroids, bullets, bonuses, powerUps);
        
        // Remove game over screen
        hideGameOver(app);
        
        // Reset player position
        player.sprite.x = app.screen.width / 2;
        player.sprite.y = app.screen.height / 2;
        player.velocity = { x: 0, y: 0 };
        player.sprite.rotation = 0;
        
        // Initialize new asteroids
        const newAsteroids = spawnAsteroidsForWave(app, score, currentWave);
        asteroids.push(...newAsteroids);
    }

    // Keyboard Input Handling
    document.addEventListener('keydown', (event) => {
        // Handle game restart if game is over
        if (gameOver && event.key === ' ') {
            restartGame();
            return;
        }
        
        // Don't process input if player is teleporting or game is over
        if (player.isTeleporting || gameOver) return;

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
                    });
                    soundManager.play('shoot');
                } else if (rearBulletActive) {
                    // Shoot forward and backward
                    const bullet = new Bullet(app, player.sprite.x, player.sprite.y, player.sprite.rotation);
                    bullets.push(bullet);
                    
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
            case 'g':
            case 'G':
                if (debugMode) {
                    gameOver = true;
                    soundManager.stopAll();
                    soundManager.play('spaceshipExplode');
                    soundManager.play('gameOver');
                    // Create cyan explosion at ship's position
                    explosionParticles.createExplosion(player.sprite.x, player.sprite.y, 0x55FFFF);
                    
                    // Show game over screen
                    showGameOver(app, score);
                }
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
    function checkWave() {
        if (asteroids.length === 0) {
            currentWave++;
            waveText.text = 'Wave ' + currentWave;
            const newAsteroids = spawnAsteroidsForWave(app, score, currentWave);
            asteroids.push(...newAsteroids);
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
            
            updateAsteroids(asteroids);
            updateBullets(bullets);
            updateBonuses(bonuses);
            updatePowerUps(powerUps);
            score = checkCollisions(app, bullets, asteroids, explosionParticles, soundManager, score, scoreMultiplier, scoreText);
            const bonusState = checkBonusCollisions(app, bullets, bonuses, soundManager, scoreMultiplier, scoreMultiplierTimer, multiplierText, bonusText);
            scoreMultiplier = bonusState.scoreMultiplier;
            scoreMultiplierTimer = bonusState.scoreMultiplierTimer;
            const playerState = checkPlayerCollisions(app, player, asteroids, lives, gameOver, soundManager, explosionParticles, showGameOver, score);
            lives = playerState.lives;
            gameOver = playerState.gameOver;
            livesText.text = 'Lives: ' + lives;
            checkWave();
            const powerUpState = checkPowerUpCollisions(app, player, powerUps, soundManager, rearBulletActive, quadFireActive, rearBulletTimer, quadFireTimer);
            rearBulletActive = powerUpState.rearBulletActive;
            quadFireActive = powerUpState.quadFireActive;
            rearBulletTimer = powerUpState.rearBulletTimer;
            quadFireTimer = powerUpState.quadFireTimer;
        }
    });
}

// Start the game
initGame().catch(console.error); 