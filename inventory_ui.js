import { palette10 } from './palette.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { getPixiApp, getAppStage, getScreenWidth, getScreenHeight } from './globals.js';

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
let POWER_UP_STACK_SPACING = 40;


export function InitInventory() {
    POWER_STACK_LEFT_X_POSITION = getPixiApp().screen.width *0.3;
    POWER_STACK_BOTTOM_Y_POSITION = getPixiApp().screen.height *0.9;
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
    // Score text
    scoreText = new PIXI.Text({
        text: 'Score: 0',
        style: {
            fill: palette10.white,
            fontSize: 24
        }
    });
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);

    // Multiplier text
    multiplierText = new PIXI.Text({
        text: '[MULT]',
        style: {
            fill: palette10.white,
            fontSize: 24
        }
    });
    multiplierText.x = getScreenWidth - 50;
    multiplierText.y = 10;
    stage.addChild(multiplierText);

  
    // Lives text
    livesText = new PIXI.Text({
        text: 'Lives: 3',
        style: {
            fill: palette10.white,
            fontSize: 24
        }
    });
    livesText.x = 10;
    livesText.y = getScreenHeight - 34;
    stage.addChild(livesText);

    // Power-up text
    powerUpText = new PIXI.Text({
        text: 'No Power-ups',
        style: {
            fill: palette10.gray,
            fontSize: 24
        }
    });
    powerUpText.x = 10;
    powerUpText.y = getScreenHeight - 64;
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

function animatePowerUp(powerUp, startX, startY, endX, endY, duration) {
    const startTime = Date.now();
    const sprite = powerUp.sprite;
    
    // Store animation data
    powerUpAnimations.set(powerUp, {
        startTime,
        startX,
        startY,
        endX,
        endY,
        duration
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
        }
    };
    
    animate();
}


export function addPowerUpToStack(powerUp) {
    let stage = getAppStage();
    stage.addChild(powerUp.sprite);
    
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
        POWER_UP_ANIMATION.duration
    );
    
    powerUpStack.push(powerUp);
    updatePowerUpStackUI();
}

function updatePowerUpStackUI() {
    if (powerUpStack.length === 0) {
        if (powerUpText) {
            powerUpText.text = 'No Power-ups';
            powerUpText.style.fill = palette10.gray;
        }
        return;
    }
    
    // Calculate spacing and starting position
    const app = getPixiApp();
    const spacing = 40;
    const y = app.screen.height - 64;
    
    // Calculate starting position
    let target
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
        powerUpText.text = `Power-ups: ${powerUpStack.length}`;
        powerUpText.style.fill = palette10.white;
        powerUpText.x = 10;
        powerUpText.y = y;
    }
}


export function getAndRemovePowerUpFromTopOfStack() {
    if (powerUpStack.length === 0) return null;
    const powerUp = powerUpStack.pop();
    updatePowerUpStackUI();
    return powerUp;
}


