import { palette10 } from './palette.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { getCurrentSectorIndex } from './globals.js';

let scoreText = null;
let multiplierText = null;
let bonusText = null;
let livesText = null;
let waveText = null;


let score = 0;
let multiplier = 1;
let lives = 3;
let scoreMultiplier = 1;
let scoreMultiplierTimer = null;

export function InitInventory() {
    setScore(0)
    setLives(3);
    clearScoreMultiplier();
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
    UpdateScoreMultiplierUI();
}

function UpdateScoreMultiplierUI() {
    if (multiplierText) {
        multiplierText.text = `x${scoreMultiplier}`;
        multiplierText.visible = scoreMultiplier > 1;
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
        text: 'x1',
        style: {
            fill: palette10.white,
            fontSize: 24
        }
    });
    multiplierText.x = app.screen.width - 50;
    multiplierText.y = 10;
    app.stage.addChild(multiplierText);

    // Bonus text
    bonusText = new PIXI.Text({
        text: '',
        style: {
            fill: palette10.yellow,
            fontSize: 24
        }
    });
    bonusText.x = app.screen.width / 2;
    bonusText.y = 10;
    bonusText.anchor.set(0.5, 0);
    app.stage.addChild(bonusText);

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

}

export function removeInventoryUI(app) {
    if (scoreText && scoreText.parent) {
        scoreText.parent.removeChild(scoreText);
    }
    if (multiplierText && multiplierText.parent) {
        multiplierText.parent.removeChild(multiplierText);
    }
    if (bonusText && bonusText.parent) {
        bonusText.parent.removeChild(bonusText);
    }
    if (livesText && livesText.parent) {
        livesText.parent.removeChild(livesText);
    }
    
    scoreText = null;
    multiplierText = null;
    bonusText = null;
    livesText = null;
}

export function updateScoreUI(score) {
    if (scoreText) {
        scoreText.text = `Score: ${score}`;
    }
}

export function updateMultiplierUI(multiplier) {
    if (multiplierTex > 0) {
        multiplierText.text = `x${multiplier}`;
        multiplierText.visible = true;
    }else{
        multiplierText.visible = false;
    }
}

export function updateBonusUI(text) {
    if (bonusText) {
        bonusText.text = text;
    }
}

export function updateLivesUI(lives) {
    if (livesText) {
        livesText.text = `Lives: ${lives}`;
    }
}

