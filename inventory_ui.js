import { palette10 } from './palette.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { getCurrentSectorIndex } from './globals.js';

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

export function addInventoryUI(app) {
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

export function removeInventoryUI(app) {
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
}

export function addPowerUpToStack(powerUp) {
    powerUpStack.push(powerUp);
    updatePowerUpUI();
}

export function getAndRemovePowerUpFromTopOfStack() {
    if (powerUpStack.length === 0) return null;
    const powerUp = powerUpStack.pop();
    updatePowerUpUI();
    return powerUp;
}

function updatePowerUpUI() {
    if (!powerUpText) return;
    
    if (powerUpStack.length === 0) {
        powerUpText.text = 'No Power-ups';
        powerUpText.style.fill = palette10.gray;
    } else {
        const topPower = powerUpStack[powerUpStack.length - 1];
        powerUpText.text = `Power-up: ${topPower.type} (${powerUpStack.length})`;
        powerUpText.style.fill = palette10.white;
    }
}


