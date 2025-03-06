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
    updatePowerUps,
    getAsteroids,
    addAsteroids,
    clearAsteroids,
    addBullet,
    addBonus,
    addPowerUp,
    getScore,
    setScore,
    getLives,
    setLives,
    getCurrentWave,
    setCurrentWave,
    incrementWave,
    startNextWave,
    getRearBulletActive,
    getQuadFireActive,
    stopAllPowerUps,
    getScoreMultiplier,
    setScoreMultiplier,
    getScoreMultiplierTimer,
    setScoreMultiplierTimer,
    clearScoreMultiplier
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
    let gameOver = false;
    let debugMode = false;
    let lastBonusSpawn = 0;
    let lastPowerUpSpawn = 0;
    const BONUS_SPAWN_INTERVAL = 10000; // Spawn bonus every 10 seconds
    const POWER_UP_SPAWN_INTERVAL = 15000; // Spawn power-up every 15 seconds

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


    function restartGame() {
        // Reset game state
        gameOver = false;
        stopAllPowerUps();
        setScore(0);
        setLives(3);
        setCurrentWave(0);
        clearScoreMultiplier();
        scoreText.text = 'Score: 0';
        livesText.text = 'Lives: 3';
        waveText.text = 'Wave 1';
        
        // Clear existing game elements
        destroyAllGameObjects(app);
        
        // Remove game over screen
        hideGameOver(app);
        
        // Reset player position
        player.sprite.x = app.screen.width / 2;
        player.sprite.y = app.screen.height / 2;
        player.velocity = { x: 0, y: 0 };
        player.sprite.rotation = 0;

        startNextWave(app);
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
                console.log('Space pressed, calling actionFire');
                console.log('Player object:', player);
                console.log('actionFire method:', player.actionFire);
                player.actionFire(soundManager);
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
                    console.log('CHEAT:Goto Game Over');
                    gameOver = true;
                    soundManager.stopAll();
                    soundManager.play('spaceshipExplode');
                    soundManager.play('gameOver');
                    // Create cyan explosion at ship's position
                    explosionParticles.createExplosion(player.sprite.x, player.sprite.y, 0x55FFFF);
                    
                    // Show game over screen
                    showGameOver(app, getScore());
                }
                break;
            case 'b':
            case 'B':
                if (debugMode) {
                    console.log('CHEAT:Destroy all game objects');
                    destroyAllGameObjects(app);
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
        const asteroids = getAsteroids();
        if (asteroids.length === 0) {
            const newWaveIndex = startNextWave(app);
            waveText.text = 'Wave ' + newWaveIndex;
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
                addBonus(app);
                lastBonusSpawn = currentTime;
            }
            
            if (currentTime - lastPowerUpSpawn > POWER_UP_SPAWN_INTERVAL) {
                // Randomly choose between power-up types
                const powerUpType = Math.random() < 0.5 ? 'rearBullet' : 'quadFire';
                console.log('Spawning power-up:', powerUpType); // Debug log
                addPowerUp(app, powerUpType);
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
            checkCollisions(app, explosionParticles, soundManager, getScoreMultiplier(), scoreText);
            checkBonusCollisions(app, soundManager, getScoreMultiplier(), getScoreMultiplierTimer(), multiplierText, bonusText);
            const playerState = checkPlayerCollisions(app, player, gameOver, soundManager, explosionParticles, showGameOver);
            livesText.text = 'Lives: ' + getLives();
            gameOver = playerState.gameOver;
            checkWave();
            const powerUpState = checkPowerUpCollisions(app, player, soundManager);
            checkWave();
        }
    });
}

// Start the game
initGame().catch(console.error); 