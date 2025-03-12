import { palette10 } from './palette.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { getPixiApp, getAppStage, getScreenWidth, getScreenHeight } from './globals.js';
import { getMainFontStyleNormal } from './fonts.js';
// Variables
let score = 0;
let multiplier = 1;
let lives = 3;
let scoreMultiplier = 1;
let scoreMultiplierTimer = null;

// Animation configuration
const POWER_UP_ANIMATION = {
    duration: 500, // milliseconds
    easing: 'easeOutQuad' // easing function for smooth motion
};

// Power-up stack management
let powerUpStack = [];
let powerUpAnimations = new Map(); // Track ongoing animations

// UI Elements
let scoreText = null;
let multiplierText = null;
let livesText = null;
let powerUpText = null;


let POWER_STACK_LEFT_X_POSITION = null;
let POWER_STACK_BOTTOM_Y_POSITION = null;
let POWER_UP_STACK_SPACING = 24;

const EMPTY_POWER_UP_TEXT = 'Cargo:No Power-ups\n(CTRL to use)';

export function InitInventory() {
    setScore(0)
    setLives(3);
    clearScoreMultiplier();
    setNewScoreMultiplier(1);
}

// SCORE
export function getScore() {
    return score;
}

export function setScore(newScore) {
    score = newScore;
    updateScoreUI(score);
}

export function addScore(scoreToAdd) {
    setScore(score + scoreToAdd);
}


export function updateScoreUI(score) {
    if (scoreText) {
        scoreText.text = `Score: ${score}`;
    }
}

// MULTIPLIER
export function getMultiplier() {
    return multiplier;
}   
export function clearScoreMultiplier() {
    scoreMultiplier = 1;
    if (scoreMultiplierTimer) {
        clearTimeout(scoreMultiplierTimer);
        scoreMultiplierTimer = null;
    }
}

export function setNewScoreMultiplier(newMultiplier) {
    scoreMultiplier = newMultiplier;
    if (scoreMultiplierTimer) {
        clearTimeout(scoreMultiplierTimer);
        scoreMultiplierTimer = null;
    }
    updateScoreMultiplierUI(scoreMultiplier);

}


export function updateScoreMultiplierUI(multiplier) {
    if (multiplier > 0) {
        multiplierText.text = `x${multiplier}`;
        multiplierText.visible = true;
    }else{
        multiplierText.visible = false;
    }
}



// LIVES
export function getLives() {
    return lives;
}


export function setLives(newLives) {
    lives = newLives;
    updateLivesUI(lives);
}

export function addLives(livesToAdd) {
    setLives(lives + livesToAdd);
}

export function removeOneLife() {
    setLives(lives - 1);
    return lives;
}


export function updateLivesUI(lives) {
    if (livesText) {
        livesText.text = `Lives: ${lives}`;
    }
}

export function addInventoryUI() {
    let stage = getAppStage();

    POWER_STACK_LEFT_X_POSITION = getPixiApp().screen.width *0.22;
    POWER_STACK_BOTTOM_Y_POSITION = getPixiApp().screen.height *0.9;


    const fontStyle = getMainFontStyleNormal();

    // Score text
    scoreText = new PIXI.Text({
        text: 'Score: 0',
        style: fontStyle,
    });
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);

    // Multiplier text under the score text
    multiplierText = new PIXI.Text({
        text: '[MULT]',
        style: fontStyle,
    });
    multiplierText.x = scoreText.x;
    multiplierText.y = scoreText.y + scoreText.height;
    stage.addChild(multiplierText);

  
    // Lives text
    livesText = new PIXI.Text({
        text: 'Lives: 3',
        style: fontStyle,
    });
    livesText.x = getScreenWidth() - 100;
    livesText.y = 10;
    stage.addChild(livesText);

    // Power-up text
    powerUpText = new PIXI.Text({
        text: EMPTY_POWER_UP_TEXT,
        style: fontStyle,
    });
    powerUpText.x = 10;
    powerUpText.y = POWER_STACK_BOTTOM_Y_POSITION;
    powerUpText.anchor.y = 0.5;
    stage.addChild(powerUpText);
}



export function removeInventoryUI() {
    if (scoreText && scoreText.parent) {
        scoreText.parent.removeChild(scoreText);
    }
    if (multiplierText && multiplierText.parent) {
        multiplierText.parent.removeChild(multiplierText);
    }
    if (livesText && livesText.parent) {
        livesText.parent.removeChild(livesText);
    }
    if (powerUpText && powerUpText.parent) {
        powerUpText.parent.removeChild(powerUpText);
    }
    
    scoreText = null;
    multiplierText = null;
    livesText = null;
    powerUpText = null;
    
    // Clear all animations
    powerUpAnimations.clear();
    
    // Remove power-up graphics
    powerUpStack.forEach(powerUp => {
        if (powerUp.sprite && powerUp.sprite.parent) {
            powerUp.sprite.parent.removeChild(powerUp.sprite);
        }
    });
    powerUpStack = [];
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function animatePowerUp(powerUp, startX, startY, endX, endY, duration, destroyPowerUpOnComplete = false) {
    const startTime = Date.now();
    const sprite = powerUp.sprite;
    
    // Store animation data
    powerUpAnimations.set(powerUp, {
        startTime,
        startX,
        startY,
        endX,
        endY,
        duration,
        destroyOnComplete: destroyPowerUpOnComplete
    });
    
    // Animation function
    const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing
        const easedProgress = easeOutQuad(progress);
        
        // Update position
        sprite.x = startX + (endX - startX) * easedProgress;
        sprite.y = startY + (endY - startY) * easedProgress;
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete
            powerUpAnimations.delete(powerUp);
            if (destroyPowerUpOnComplete) {
                powerUp.sprite.parent.removeChild(powerUp.sprite);
                powerUp.destroy();
            }
        }
    };
    
    animate();
}


export function addPowerUpToCargoStack(powerUp) {
    let stage = getAppStage();
    stage.addChild(powerUp.sprite);
    
    // Scale down the power-up sprite to half its size
    powerUp.sprite.scale.set(0.5);
    
    // Calculate destination  position
    const startX = powerUp.sprite.x;
    const startY = powerUp.sprite.y;

    const finalX = POWER_STACK_LEFT_X_POSITION + (powerUpStack.length * POWER_UP_STACK_SPACING);
    const finalY = POWER_STACK_BOTTOM_Y_POSITION;
    
    // Start animation from current position to final position
    animatePowerUp(
        powerUp,
        startX,
        startY,
        finalX,
        finalY,
        POWER_UP_ANIMATION.duration,
        false
    );
    
    powerUpStack.push(powerUp);
    updatePowerUpStackUI();
}

// throw the power up to the player and destroy it at arrival
// quick animation towards the player
export function throwPowerUpPlayerAndDestroyAtArrival(powerUp,player) {
    let stage = getAppStage();

    const targetX = player.sprite.x;
    const targetY = player.sprite.y;

    stage.addChild(powerUp.sprite);
    powerUp.sprite.scale.set(0.66);
    animatePowerUp(powerUp, powerUp.sprite.x, powerUp.sprite.y, targetX, targetY, POWER_UP_ANIMATION.duration/2, true);
}

function updatePowerUpStackUI() {
    if (powerUpStack.length === 0) {
        if (powerUpText) {
            powerUpText.text = EMPTY_POWER_UP_TEXT,
            powerUpText.style.fill = palette10.gray;
        }
        return;
    }
    
    // Calculate spacing and starting position
    const spacing = POWER_UP_STACK_SPACING;
//    const y = POWER_STACK_BOTTOM_Y_POSITION;
    
    // Calculate starting position
    const targetY = POWER_STACK_BOTTOM_Y_POSITION;
    
    // Update positions of all power-ups
    powerUpStack.forEach((powerUp, index) => {
        const targetX = POWER_STACK_LEFT_X_POSITION + (index * spacing);
        
        // If power-up is not currently being animated, update its position directly
        if (!powerUpAnimations.has(powerUp)) {
            powerUp.sprite.x = targetX;
            powerUp.sprite.y = targetY;
        }
    });
    
    // Update text
    if (powerUpText) {
        powerUpText.text = `Cargo Power-ups: ${powerUpStack.length}\n(Q to use)`;
        powerUpText.style.fill = palette10.white;
    }
}


// also remove the power up from the stage
export function getAndRemovePowerUpFromTopOfStack() {
    if (powerUpStack.length === 0) return null;
    const powerUp = powerUpStack.pop();
    // remove the power up from the stage
    powerUp.sprite.parent.removeChild(powerUp.sprite);
    updatePowerUpStackUI();
    return powerUp;
}


