import Spaceship from './spaceship.js';
import Starfield from './starfield.js';
import ExplosionParticles from './explosionParticles.js';
import { InitSoundManager, gSoundManager } from './soundManager.js';
import { showGameOver, hideGameOver } from './game_over_screen.js';
import { showTitleScreen, hideTitleScreen } from './title.js';
import { showLoadingScreen, hideLoadingScreen } from './loading.js';
import { 
    destroyAllGameObjects, 
    checkPowerUpCollisions, 
    checkPlayerCollisions, 
    checkBonusCollisions, 
    checkCollisions,
    updateAsteroids,
    updateBullets,
    updateBonuses,
    updatePowerUps,
    getAsteroids,
    getScore,
    setScore,
    setLives,
    setCurrentWave,
    startNextWave,
    stopAllPowerUps,
    clearScoreMultiplier,
    addBattleUI,
    checkForNewBonusesAndPowerUps
} from './battle.js';

// Game States
const STATE_BOOT = 'boot';
const STATE_TITLE = 'title';
const STATE_BATTLE = 'battle';
let gGameState = STATE_TITLE;
let gPixiAPp = null;
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
    gPixiAPp = new PIXI.Application();
    await gPixiAPp.init({
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
    document.body.appendChild(gPixiAPp.canvas);

    // Initialize debug mode
    initDebugMode();

    // Keyboard Input Handling
    document.addEventListener('keydown', (event) => {
        handleKeyPressForGameState(event);
    });

    document.addEventListener('keyup', (event) => {

        handleKeyReleaseForGameState(event);
    });

    switchToGameState(STATE_BOOT);

    gPixiAPp.ticker.add(() => {
        updateGameState();

    });



    // Game Loop
}

// Start the game
initGame().catch(console.error); 



// STATE MACHINE FUNCTIONS OF WHOLE GAME


function switchToGameState(newState) {
    console.log(`switchToGameState ${gGameState} ---> ${newState}`);
    exitCurrentState();
    enterNewState(newState);
    gGameState = newState;
}

function exitCurrentState() {
    switch(gGameState) {
        case STATE_TITLE:
            exitTitleState();
            break;
        case STATE_BATTLE:  
            exitBattleState();
            break;
            case STATE_BOOT:
                exitBootState();
                break;
        default:
            console.error('Invalid game state to exit:', gGameState);
    }
}

function enterNewState(newState) {
      switch(newState) {
        case STATE_TITLE:
            enterTitleState();
            break;
        case STATE_BATTLE:
            enterBattleState();
            break;
        case STATE_BOOT:
            enterBootState();
            break;
        default:
            console.error('Invalid game state to enter:', newState);
    }
}


function updateGameState() {
       switch(gGameState) {
        case STATE_TITLE:
            updateTitleState();
            break;
        case STATE_BATTLE:
            updateBattleState();
            break;
        case STATE_BOOT:
            updateBootState();
            break;
    }
}

function updateTitleState() {
    // No update logic for title state
}   



function updateBattleState() {
    if(gGameOver) return;
    gPlayer.update();
    gStarfield.update(gPlayer.velocity);
    
    // Check for new bonuses and power-ups
    checkForNewBonusesAndPowerUps(gPixiAPp);
    
    // Update debug display only when debug mode is on
    if (gDebugMode) {
        const rotationDegrees = (gPlayer.sprite.rotation * 180 / Math.PI).toFixed(1);
        const posX = gPlayer.sprite.x.toFixed(1);
        const posY = gPlayer.sprite.y.toFixed(1);
        gDebugText.text = `Rotation: ${rotationDegrees}°\nPosition: (${posX}, ${posY})`;
    }
    
    // Update explosion particles
    gExplosionParticles.update();
    
    updateAsteroids();
    updateBullets();
    updateBonuses();
    updatePowerUps();
    checkCollisions(gPixiAPp, gExplosionParticles);
    checkBonusCollisions(gPixiAPp);
    const playerState = checkPlayerCollisions(gPixiAPp, gPlayer, gGameOver, gExplosionParticles, showGameOver);
    gGameOver = playerState.gameOver;
    const powerUpState = checkPowerUpCollisions(gPixiAPp, gPlayer);
    if(checkWave() === true) { // true means wave is over
        startNextWave(gPixiAPp);

    }
}



function enterBootState() {
    // Initialize game assets and settings
    InitSoundManager(SOUND_CONFIG);
    // Show loading screen
    showLoadingScreen(gPixiAPp);
    
}
function updateBootState() {
    // No update logic for boot state
    const loaded = true;
    if(loaded) {
        switchToGameState(STATE_TITLE);
    }
}

function exitBootState() {

    hideLoadingScreen(gPixiAPp);
}


function enterTitleState() {
    showTitleScreen(gPixiAPp);

}

function enterBattleState() {
    startBattle();
}


function exitTitleState() {
    hideTitleScreen(gPixiAPp);
}

function exitBattleState() {
    hideGameOver(gPixiAPp);
}


// INPUT PER SCREEN

function handleBattleKeyPress(event) {

    // Handle game restart if game is over
    if (gGameOver && event.key === ' ') {
        restartBattle();
        return;
    }
    
    // Don't process input if player is teleporting or game is over
    if (gPlayer.isTeleporting || gGameOver) return;

    // Only process game controls if in battle state
    switch (event.key) {
        case 'ArrowLeft':
            gPlayer.isRotatingLeft = true;
            break;
        case 'ArrowRight':
            gPlayer.isRotatingRight = true;
            break;
        case 'ArrowUp':
            gPlayer.isMovingForward = true;
            gSoundManager.startThrust();  // Start engine sound
            break;
        case ' ':
            gPlayer.actionFire(gSoundManager);
            break;
        case 'Shift':
            gPlayer.tryTeleport(gPixiAPp, gSoundManager);
            break;
        case 'd':
        case 'D':
            gDebugMode = !gDebugMode;
            gDebugText.visible = gDebugMode;
            break;
        case 'g':
        case 'G':
            if (gDebugMode) {
                console.log('CHEAT:Goto Game Over');
                gGameOver = true;
                gSoundManager.stopAll();
                gSoundManager.play('spaceshipExplode');
                gSoundManager.play('gameOver');
                // Create cyan explosion at ship's position
                gExplosionParticles.createExplosion(gPlayer.sprite.x, gPlayer.sprite.y, 0x55FFFF);
                
                // Show game over screen
                showGameOver(gPixiAPp, getScore());
            }
            break;
        case 'b':
        case 'B':
            if (gDebugMode) {
                console.log('CHEAT:Destroy all game objects');
                destroyAllGameObjects(gPixiAPp);
            }
            break;
    }
}

function handleBattleKeyRelease(event) {
    // Only process game controls if in battle state
    switch (event.key) {
        case 'ArrowLeft':
            gPlayer.isRotatingLeft = false;
            break;
        case 'ArrowRight':
            gPlayer.isRotatingRight = false;
            break;
        case 'ArrowUp':
            gPlayer.isMovingForward = false;
            gSoundManager.stopThrust();  // Stop engine sound
            break;
    }
}

function handleTitleKeyPress(event) {
}

function handleTitleKeyRelease(event) {
    if (event.key === ' ') {
        switchToGameState(STATE_BATTLE);
    }
}

function handleKeyPressForGameState(event) {

    switch(gGameState) {
        case STATE_TITLE:
            handleTitleKeyPress(event);
            break;
        case STATE_BATTLE:
            handleBattleKeyPress(event);
            break;
            default:
                console.error('Invalid game state to handle key press:', gGameState);
    }
}

function handleKeyReleaseForGameState(event) {

    switch(gGameState) {
        case STATE_TITLE:
            handleTitleKeyRelease(event);
            break;
        case STATE_BATTLE:
            handleBattleKeyRelease(event);
            break;
            default:
                console.error('Invalid game state to handle key press:', gGameState);
    }
}

let gPlayer = null;
let gStarfield = null;
let gExplosionParticles = null;
let gGameOver = false;
function startBattle() {

    // Create starfield before other game objects
    gStarfield = new Starfield(gPixiAPp);
    gExplosionParticles = new ExplosionParticles(gPixiAPp);


    // Game State Variables
    gPlayer = new Spaceship(gPixiAPp);
    gPlayer.sprite.visible = false; // Hide player initially
    gGameOver = false;
    
    // UI Elements


    // Initialize battle UI
    addBattleUI(gPixiAPp);

    // Show player
    gPlayer.sprite.visible = true;
    
    // Set game state to battle
    gGameState = STATE_TITLE;
    
    // Reset game state
    gGameOver = false;
    stopAllPowerUps();
    setScore(0);
    setLives(3);
    clearScoreMultiplier();
    
    // Clear any existing game elements
    destroyAllGameObjects(gPixiAPp);
    
    // Reset player position
    gPlayer.resetLocation();

    // Start first wave
    setCurrentWave(0);
    startNextWave(gPixiAPp);
}

function restartBattle() {
    // Hide game over screen
    hideGameOver(gPixiAPp);
    
    // Set game state to title
    gGameState = STATE_TITLE;
    
    // Show title screen
    showTitleScreen(gPixiAPp, startBattle);
}
    // Update Functions
function checkWave() {
    const asteroids = getAsteroids();
    if (asteroids.length === 0) {
        return true;
    }
    return false;
}



let gDebugMode = false;
let gDebugText = null;
function initDebugMode() {
    gDebugMode = false;


    // Add debug text for rotation and position (using CGA bright green)
    gDebugText = new PIXI.Text({
        text: 'Debug Info',
        style: { 
            fill: 0x55FF55,  // CGA bright green
            fontSize: 14
        }
    });
    gDebugText.x = 10;
    gDebugText.y = 40;
    gDebugText.visible = gDebugMode;
    gPixiAPp.stage.addChild(gDebugText);
}