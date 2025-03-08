import { InitSoundManager } from './soundManager.js';
import { showGameOver, hideGameOver } from './game_over_screen.js';
import { showTitleScreen, hideTitleScreen,updateTitleScreen,handleTitleKeyPress,handleTitleKeyRelease } from './title_screen.js';
import { showLoadingScreen, hideLoadingScreen } from './boot_screen.js';
import { STATE_BOOT, STATE_TITLE, STATE_BATTLE, STATE_GAME_OVER } from './globals.js';

import { 
    destroyAllGameObjects, 
    updateAsteroids,
    updateBullets,
    updateBonuses,
    updatePowerUps,
    getScore,
    removeBattleUI,
    startBattle,
    getStarfield,
    getExplosionParticles,
    getAsteroids,
    destroyAnyStarfield,
    destroyAnyExplosionParticles,
    destroyAnySpaceship,
    handleBattleKeyPress,
    handleBattleKeyRelease,
    initBattleDebug,
    updateBattleState
} from './battle_screen.js';

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
        let nextState =  handleKeyPressForGameState(event);
        if(nextState) {
            switchToGameState(nextState);
        }
    });

    document.addEventListener('keyup', (event) => {

        let nextState = handleKeyReleaseForGameState(event);
        if(nextState) {
            switchToGameState(nextState);
        }
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
    let nextState = null;
       switch(gGameState) {
        case STATE_BOOT:
            nextState = updateBootState();
            break;
        case STATE_TITLE:
            nextState = updateTitleState();
            break;
        case STATE_BATTLE:
            nextState = updateBattleState(gPixiAPp);
            break;
            case STATE_GAME_OVER:
            nextState = updateGameOverState();
                break;
    }
    if(nextState) {
        switchToGameState(nextState);
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
    let nextState = null;
    // No update logic for boot state
    const loaded = true;
    if(loaded) {
        nextState = STATE_TITLE;
    }
    return nextState;
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
    return null;
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
    initBattleDebug(gPixiAPp);
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
    let nextState = null;
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

function handleKeyPressForGameState(event) {
    let nextState = null;
    switch(gGameState) {
        case STATE_TITLE:
            nextState = handleTitleKeyPress(event);
            break;
        case STATE_BATTLE:
            nextState = handleBattleKeyPress(event, gPixiAPp);
            break;
        case STATE_GAME_OVER:
            nextState = handleGameOverKeyPress(event);
            break;
        default:
            console.error('Invalid game state to handle key press:', gGameState);
    }
    return nextState;
}

function handleKeyReleaseForGameState(event) {
    let nextState = null;
    switch(gGameState) {
        case STATE_TITLE:
            nextState = handleTitleKeyRelease(event);
            break;
        case STATE_BATTLE:
            nextState = handleBattleKeyRelease(event);
            break;
        case STATE_GAME_OVER:
            nextState = handleGameOverKeyRelease(event);
            break;
        default:
            console.error('Invalid game state to handle key press:', gGameState);
    }
    return nextState;
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