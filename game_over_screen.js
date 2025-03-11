import { palette10 } from './palette.js';
import { getScreenWidth, getScreenHeight, getAppStage, getCurrentMissionNumber, getCurrentSectorIndex } from './globals.js';
import { getMainFontStyleBig, getMainFontStyleTitle, getMainFontStyleNormal} from './fonts.js';
import { submitScore, getTopScores } from './supabase_api.js';

let gameOverContainer = null;
let leaderboardContainer = null;
let inputElement = null;
let submitButton = null;

export function showGameOver(finalScore) {
    gameOverContainer = new PIXI.Container();
    
    // Game Over text
    const goTextStyle = getMainFontStyleTitle();
    const gameOverText = new PIXI.Text({
        text: 'GAME OVER',
        style: goTextStyle
    });
    gameOverText.x = getScreenWidth() / 2;
    gameOverText.y = getScreenHeight() * 0.2;
    gameOverText.anchor.set(0.5);
    
    // Final Score text
    const goScoreTextStyle = getMainFontStyleBig();
    const scoreText = new PIXI.Text({
        text: `Final Score: ${finalScore}`,
        style: goScoreTextStyle
    });
    scoreText.x = getScreenWidth() / 2;
    scoreText.y = getScreenHeight() * 0.3;
    scoreText.anchor.set(0.5);
    
    // Create input field
    const inputWidth = 200;
    const inputHeight = 30;

    const submitButtonWidth = 200;
    const submitButtonHeight = 30;

    inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.placeholder = 'Enter your name';
    inputElement.style.position = 'absolute';

    // Center the input element
    inputElement.style.left = (getScreenWidth()/2 - inputWidth / 2) + 'px';
    inputElement.style.top = (getScreenHeight()/2 - inputHeight - submitButtonHeight) + 'px';
    inputElement.style.padding = '8px';
    inputElement.style.fontSize = '16px';
    inputElement.style.width = inputWidth + 'px';
    inputElement.style.textAlign = 'center';

    document.body.appendChild(inputElement);

    // Create submit button
    submitButton = document.createElement('button');
    submitButton.textContent = 'Submit Score';
    submitButton.style.position = 'absolute';
    submitButton.style.left = (getScreenWidth()/2 - submitButtonWidth/ 2) + 'px';
    submitButton.style.top = (getScreenHeight()/2) + 'px';
    submitButton.style.width = submitButtonWidth + 'px';
    submitButton.style.padding = '8px';
    submitButton.style.fontSize = '16px';
    submitButton.style.cursor = 'pointer';
    submitButton.style.textAlign = 'center';
    submitButton.style.align = 'center';
    
    submitButton.onclick = async () => {
        const playerName = inputElement.value.trim();
        if (playerName) {
            submitButton.disabled = true;
            const success = await submitScore(
                playerName, 
                finalScore,
                getCurrentMissionNumber(),
                getCurrentSectorIndex()
            );
            if (success) {
                updateLeaderboardDisplay();
            }
            // Hide input elements after submission
            inputElement.style.display = 'none';
            submitButton.style.display = 'none';
        }
    };
    
    document.body.appendChild(submitButton);

    // Create and add leaderboard display
    leaderboardContainer = createLeaderboardDisplay();
    
    // Add all elements to container
    gameOverContainer.addChild(gameOverText);
    gameOverContainer.addChild(scoreText);
    gameOverContainer.addChild(leaderboardContainer);
    
    // Add container to stage
    let stage = getAppStage();
    stage.addChild(gameOverContainer);
    
    // Load initial leaderboard data
    updateLeaderboardDisplay();
}

function createLeaderboardDisplay() {
    const container = new PIXI.Container();
    
    const titleText = new PIXI.Text({
        text: 'HIGH SCORES',
        style: {
            fill: palette10.white,
            fontSize: 24,
            align: 'center'
        }
    });
    titleText.anchor.set(0.5);
    titleText.y = getScreenHeight() * 0.6;
    titleText.x = getScreenWidth() / 2;
    
    container.addChild(titleText);
    return container;
}

async function updateLeaderboardDisplay() {
    const scores = await getTopScores();
    
    // Clear existing scores
    while (leaderboardContainer.children.length > 1) { // Keep title
        leaderboardContainer.removeChildAt(1);
    }
    
    // Add new scores
    const leaderboardTextStyle = getMainFontStyleNormal();
    scores.forEach((score, index) => {
        const scoreText = new PIXI.Text({
            text: `${index + 1}. ${score.player_name} - ${score.score}`,
            style: leaderboardTextStyle
        });
        scoreText.x = getScreenWidth() / 2;
        scoreText.y = getScreenHeight() * 0.65 + (index * 30);
        scoreText.anchor.set(0.5, 0);
        leaderboardContainer.addChild(scoreText);
    });
}

export function hideGameOver() {
    if (gameOverContainer) {
        let stage = getAppStage();
        stage.removeChild(gameOverContainer);
        gameOverContainer = null;
        leaderboardContainer = null;
    }
    
    // Remove HTML elements
    if (inputElement) {
        inputElement.remove();
        inputElement = null;
    }
    if (submitButton) {
        submitButton.remove();
        submitButton = null;
    }
} 