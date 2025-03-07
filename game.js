import Spaceship from './spaceship.js';
import Starfield from './starfield.js';
import ExplosionParticles from './explosionParticles.js';
import { InitSoundManager, gSoundManager } from './soundManager.js';
import { showGameOver, hideGameOver } from './game_over_screen.js';
import { showTitleScreen, hideTitleScreen,updateTitleScreen } from './title_screen.js';
import { showLoadingScreen, hideLoadingScreen } from './boot_screen.js';
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
    getScore,
    startNextWave,
    removeBattleUI,
    checkForNewBonusesAndPowerUps,
    startBattle,
    getPlayer,
    getStarfield,
    getExplosionParticles,
    getAsteroids,
    destroyAnyStarfield,
    destroyAnyExplosionParticles,
    destroyAnySpaceship
} from './battle_screen.js';

// Game States
const STATE_BOOT = 'boot';
const STATE_TITLE = 'title';
const STATE_BATTLE = 'battle';
const STATE_GAME_OVER = 'gameover';

let gGameState = STATE_BOOT; // debut


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
                case STATE_GAME_OVER:
                    exitGameOverState();
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
        case STATE_GAME_OVER:
            enterGameOverState();
            break;
        default:
            console.error('Invalid game state to enter:', newState);
    }
}


function updateGameState() {
       switch(gGameState) {
        case STATE_BOOT:
            updateBootState();
            break;
        case STATE_TITLE:
            updateTitleState();
            break;
        case STATE_BATTLE:
            updateBattleState();
            break;
            case STATE_GAME_OVER:
                updateGameOverState();
                break;
    }
}





/* 
██████╗  ██████╗  ██████╗ ████████╗
██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝
██████╔╝██║   ██║██║   ██║   ██║   
██╔══██╗██║   ██║██║   ██║   ██║   
██████╔╝╚██████╔╝╚██████╔╝   ██║   
╚═════╝  ╚═════╝  ╚═════╝    ╚═╝   
 */                                   

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


/* 
████████╗██╗████████╗██╗     ███████╗
╚══██╔══╝██║╚══██╔══╝██║     ██╔════╝
   ██║   ██║   ██║   ██║     █████╗  
   ██║   ██║   ██║   ██║     ██╔══╝  
   ██║   ██║   ██║   ███████╗███████╗
   ╚═╝   ╚═╝   ╚═╝   ╚══════╝╚══════╝
                                     
 */
function enterTitleState() {
    showTitleScreen(gPixiAPp);

}
function updateTitleState() {
    // No update logic for title state
    // here we wait for the player to press space to start the game
    updateTitleScreen();
}   

function exitTitleState() {
    hideTitleScreen(gPixiAPp);
}

/* 
██████╗  █████╗ ████████╗████████╗██╗     ███████╗
██╔══██╗██╔══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝
██████╔╝███████║   ██║      ██║   ██║     █████╗  
██╔══██╗██╔══██║   ██║      ██║   ██║     ██╔══╝  
██████╔╝██║  ██║   ██║      ██║   ███████╗███████╗
╚═════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝
 */                                                  

function enterBattleState() {
    startBattle(gPixiAPp);
}


function updateBattleState() {
    const player = getPlayer();
    const starfield = getStarfield();
    const explosionParticles = getExplosionParticles();

    
    player.update();
    starfield.update(player.velocity);
    
    // Check for new bonuses and power-ups
    checkForNewBonusesAndPowerUps(gPixiAPp);
    
    // Update debug display only when debug mode is on
    if (gDebugMode) {
        const rotationDegrees = (player.sprite.rotation * 180 / Math.PI).toFixed(1);
        const posX = player.sprite.x.toFixed(1);
        const posY = player.sprite.y.toFixed(1);
        gDebugText.text = `Rotation: ${rotationDegrees}°\nPosition: (${posX}, ${posY})`;
    }
    
    // Update explosion particles
    explosionParticles.update();
    
    updateAsteroids();
    updateBullets();
    updateBonuses();
    updatePowerUps();
    checkCollisions(gPixiAPp, explosionParticles);
    checkBonusCollisions(gPixiAPp);

    const powerUpState = checkPowerUpCollisions(gPixiAPp, player);
    if(checkWave() === true) { // true means wave is over
        startNextWave(gPixiAPp);
    }


    let playerIsDead = checkPlayerCollisions(gPixiAPp, player, explosionParticles);
    if(playerIsDead) {
        switchToGameState(STATE_GAME_OVER);
    }
}

function exitBattleState() {
    destroyAnySpaceship();

}

function checkWave() {
    const asteroids = getAsteroids();
    return asteroids.length === 0;  // Wave is over when no asteroids remain
}

/* 

 ██████╗  █████╗ ███╗   ███╗███████╗     ██████╗ ██╗   ██╗███████╗██████╗ 
██╔════╝ ██╔══██╗████╗ ████║██╔════╝    ██╔═══██╗██║   ██║██╔════╝██╔══██╗
██║  ███╗███████║██╔████╔██║█████╗      ██║   ██║██║   ██║█████╗  ██████╔╝
██║   ██║██╔══██║██║╚██╔╝██║██╔══╝      ██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗
╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗    ╚██████╔╝ ╚████╔╝ ███████╗██║  ██║
 ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝     ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝
                                                                          
 */

function enterGameOverState() {
    showGameOver(gPixiAPp, getScore());
}

function updateGameOverState() {

    let gStarfield = getStarfield();
    // garde le starfield en place
    gStarfield.update({x:0,y:0});
        
    // Update explosion particles
    let gExplosionParticles = getExplosionParticles();
    gExplosionParticles.update();
        
    updateAsteroids();
    updateBonuses();
    updatePowerUps();
}


function handleGameOverKeyPress(event) {
}

function handleGameOverKeyRelease(event) {
    if (event.key === ' ') {
        switchToGameState(STATE_TITLE);
    }
}


function exitGameOverState() {
    hideGameOver(gPixiAPp);
    destroyAllGameObjects(gPixiAPp);


    destroyAnyStarfield();
    destroyAnyExplosionParticles();
    destroyAnySpaceship();

    removeBattleUI(gPixiAPp);

}

// INPUT PER SCREEN

function handleBattleKeyPress(event) {

    let gPlayer = getPlayer();
    
    // Don't process input if player is teleporting or game is over
    if (gPlayer.isTeleporting) return;

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
                gSoundManager.stopAll();
                gSoundManager.play('spaceshipExplode');
                gSoundManager.play('gameOver');
                // Create cyan explosion at ship's position
                gExplosionParticles.createExplosion(gPlayer.sprite.x, gPlayer.sprite.y, 0x55FFFF);
                switchToGameState(STATE_GAME_OVER);
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
    let gPlayer = getPlayer();
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
        case STATE_GAME_OVER:
            handleGameOverKeyPress(event);
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
        case STATE_GAME_OVER:
            handleGameOverKeyRelease(event);
            break;
            default:
                console.error('Invalid game state to handle key press:', gGameState);
    }
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