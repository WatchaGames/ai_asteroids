import { palette10 } from './palette.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { getCurrentSectorIndex, getPixiApp } from './globals.js';

// Variables
let score = 0;
let multiplier = 1;
let lives = 3;
let scoreMultiplier = 1;
let scoreMultiplierTimer = null;

// Power-up stack management
let powerUpStack = [];

// UI Elements
let scoreText = null;
let multiplierText = null;
let livesText = null;
let powerUpText = null;

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
    let app = getPixiApp();
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
    app.stage.addChild(scoreText);

    // Multiplier text
    multiplierText = new PIXI.Text({
        text: '[MULT]',
        style: {
            fill: palette10.white,
            fontSize: 24
        }
    });
    multiplierText.x = app.screen.width - 50;
    multiplierText.y = 10;
    app.stage.addChild(multiplierText);

  
    // Lives text
    livesText = new PIXI.Text({
        text: 'Lives: 3',
        style: {
            fill: palette10.white,
            fontSize: 24
        }
    });
    livesText.x = 10;
    livesText.y = app.screen.height - 34;
    app.stage.addChild(livesText);

    // Power-up text
    powerUpText = new PIXI.Text({
        text: 'No Power-ups',
        style: {
            fill: palette10.gray,
            fontSize: 24
        }
    });
    powerUpText.x = 10;
    powerUpText.y = app.screen.height - 64;
    app.stage.addChild(powerUpText);
}

export function removeInventoryUI() {
    let app = getPixiApp();
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
    
    // Remove power-up graphics
    powerUpStack.forEach(graphic => {
        if (graphic && graphic.parent) {
            graphic.parent.removeChild(graphic);
        }
    });
    powerUpStack = [];
}

export function addPowerUpToStack(powerUp) {
    // add the powerUp to the stage (app.stage)
    const app = getPixiApp();
    app.stage.addChild(powerUp.sprite);
    powerUpStack.push(powerUp);
    updatePowerUpUI();
}

export function getAndRemovePowerUpFromTopOfStack() {
    if (powerUpStack.length === 0) return null;
    const powerUp = powerUpStack.pop();
    updatePowerUpUI();
    return powerUp;
}


function getPowerUpColor(type) {
    switch(type) {
        case 'shield':
            return 0x00FF00; // Green
        case 'rapid_fire':
            return 0xFF0000; // Red
        case 'double_shot':
            return 0x0000FF; // Blue
        default:
            return 0xFFFFFF; // White
    }
}

function updatePowerUpUI() {
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
    const startX = (app.screen.width - (powerUpStack.length * spacing)) / 2;
    const y = app.screen.height - 64;
    
    // Create and position new graphics
    powerUpStack.forEach((powerUp, index) => {
        const graphic = powerUp.sprite;
        graphic.x = startX + (index * spacing);
        graphic.y = y;
    });
    
    // Update text
    if (powerUpText) {
        powerUpText.text = `Power-ups: ${powerUpStack.length}`;
        powerUpText.style.fill = palette10.white;
        powerUpText.x = 10;
        powerUpText.y = y;
    }
}


