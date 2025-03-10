import { InitSoundManager } from './soundManager.js';
import { showGameOver, hideGameOver } from './game_over_screen.js';
import { showTitleScreen, hideTitleScreen,updateTitleScreen,handleTitleKeyPress,handleTitleKeyRelease } from './title_screen.js';
import { showLoadingScreen, hideLoadingScreen } from './boot_screen.js';
import { 
    STATE_BOOT, 
    STATE_TITLE, 
    STATE_BATTLE, 
    STATE_GAME_OVER, 
    STATE_SECTOR_SELECT,
    getCurrentGameState,
    setGameState,
    getCurrentSectorIndex,
    setCurrentSectorIndex,
    getCurrentMissionNumber,
    setCurrentMissionNumber,
} from './globals.js';


import { LoadFonts } from './fonts.js';

import { showSectorSelect,
    hideSectorSelect,
    updateSectorSelect,
    getSelectedSectorIndex,
    handleSectorSelectKeyPress,
    handleSectorSelectKeyRelease
} from './sector_select_screen.js';

import { 
    destroyAllGameObjects, 
    updateAsteroids,
    updateBullets,
    updateBonuses,
    updatePowerUps,
    startBattleInCurrentSelectedSector,
    getStarfield,
    getExplosionParticles,
    destroyAnyStarfield,
    destroyAnyExplosionParticles,
    destroyAnySpaceship,
    handleBattleKeyPress,
    handleBattleKeyRelease,
    initBattleDebug,
    updateBattleState,
    removeBattleDebug
} from './battle_screen.js';


import { getScore,addInventoryUI, removeInventoryUI, InitInventory } from './inventory_ui.js';


let GAME_DEBUG = false;

// Game state variables

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


    await LoadFonts();

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
        let nextState = updateGameState();
        if(nextState) {
            switchToGameState(nextState);
        }
    });


    // Game Loop
}

// Start the game
initGame().catch(console.error); 







// STATE MACHINE FUNCTIONS OF WHOLE GAME


function switchToGameState(newState) {
    if(GAME_DEBUG)console.log(`switchToGameState ${getCurrentGameState()} ---> ${newState}`);
    exitCurrentState();
    enterNewState(newState);
    setGameState(newState);
}

function exitCurrentState() {
    switch(getCurrentGameState()) {
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
        case STATE_SECTOR_SELECT:
            exitSectorSelectState();
            break;
        default:
            console.error('Invalid game state to exit:', getCurrentGameState());
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
        case STATE_SECTOR_SELECT:
            enterSectorSelectState();
            break;
        default:
            console.error('Invalid game state to enter:', newState);
    }
}


function updateGameState() {
    let nextState = null;
    switch(getCurrentGameState()) {
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
        case STATE_SECTOR_SELECT:
            nextState = updateSectorSelect();
            break;
    }
    return nextState;
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
    addInventoryUI(gPixiAPp);
    InitInventory();
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
    startBattleInCurrentSelectedSector(gPixiAPp);
    initBattleDebug(gPixiAPp);
}


function exitBattleState() {
    destroyAnySpaceship();
    removeBattleDebug(gPixiAPp);
}


/*
███████╗███████╗ ██████╗████████╗ ██████╗ ██████╗     ███████╗███████╗██╗     ███████╗ ██████╗████████╗
██╔════╝██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗    ██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝
███████╗█████╗  ██║        ██║   ██║   ██║██████╔╝    ███████╗█████╗  ██║     █████╗  ██║        ██║   
╚════██║██╔══╝  ██║        ██║   ██║   ██║██╔══██╗    ╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   
███████║███████╗╚██████╗   ██║   ╚██████╔╝██║  ██║    ███████║███████╗███████╗███████╗╚██████╗   ██║   
╚══════╝╚══════╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝    ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝   
                                                                                                       
*/

// Add new state functions
function enterSectorSelectState() {
    showSectorSelect(gPixiAPp, getCurrentSectorIndex());
}

function exitSectorSelectState() {
    hideSectorSelect(gPixiAPp);
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
    return nextState;
}


function handleGameOverKeyPress(event) {
}

function handleGameOverKeyRelease(event) {
    if (event.key === ' ') {
        return STATE_TITLE;
    }
}

function exitGameOverState() {
    hideGameOver(gPixiAPp);
    destroyAllGameObjects(gPixiAPp);

    destroyAnyStarfield();
    destroyAnyExplosionParticles();
    destroyAnySpaceship();

    removeInventoryUI(gPixiAPp);
}

// INPUT PER SCREEN

function handleKeyPressForGameState(event) {
    let nextState = null;
    switch(getCurrentGameState()) {
        case STATE_TITLE:
            nextState = handleTitleKeyPress(event);
            break;
        case STATE_BATTLE:
            nextState = handleBattleKeyPress(event, gPixiAPp);
            break;
        case STATE_GAME_OVER:
            nextState = handleGameOverKeyPress(event);
            break;
        case STATE_SECTOR_SELECT:
            nextState = handleSectorSelectKeyPress(event);
            break;
        case STATE_BOOT:
            nextState = handleBootKeyPress(event);
            break;
        default:
            console.error('Invalid game state to handle key press:', getCurrentGameState());
    }
    return nextState;
}

function handleKeyReleaseForGameState(event) {
    let nextState = null;
    switch(getCurrentGameState()) {
        case STATE_TITLE:
            nextState = handleTitleKeyRelease(event);
            break;
        case STATE_BATTLE:
            nextState = handleBattleKeyRelease(event);
            break;
        case STATE_GAME_OVER:
            nextState = handleGameOverKeyRelease(event);
            break;
        case STATE_SECTOR_SELECT:
            nextState = handleSectorSelectKeyRelease(event);
            break;
        case STATE_BOOT:
            nextState = handleBootKeyRelease(event);
            break;
        default:
            console.error('Invalid game state to handle key press:', getCurrentGameState());
    }
    return nextState;
}









/*

██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗     ██╗   ██╗██╗
██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝     ██║   ██║██║
██║  ██║█████╗  ██████╔╝██║   ██║██║  ███╗    ██║   ██║██║
██║  ██║██╔══╝  ██╔══██╗██║   ██║██║   ██║    ██║   ██║██║
██████╔╝███████╗██████╔╝╚██████╔╝╚██████╔╝    ╚██████╔╝██║
╚═════╝ ╚══════╝╚═════╝  ╚═════╝  ╚═════╝      ╚═════╝ ╚═╝

*/


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
