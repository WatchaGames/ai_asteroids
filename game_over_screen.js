import { getPixiApp, getScreenWidth, getScreenHeight, getAppStage } from './globals.js';
let gameOverContainer = null;

export function showGameOver(score) {

    if(gameOverContainer !=null){
        console.error("Game over screen already exists");
        return;
    }
    // Create game over overlay
    gameOverContainer = new PIXI.Container();
    
    // Add semi-transparent black background
    const overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000, 0.8);
    overlay.drawRect(0, 0, getScreenWidth(), getScreenHeight());
    overlay.endFill();
    gameOverContainer.addChild(overlay);
    
    // Create vectorized GAME OVER text
    const gameOverBorder = new PIXI.Graphics();
    const centerX = getScreenWidth() / 2;
    const centerY = getScreenHeight() / 2;
    
    // Draw main text box with white border
    const textBox = new PIXI.Graphics();
    textBox.lineStyle(2, 0xFFFFFF);  // White border
    textBox.beginFill(0x000000);
    textBox.drawRect(0, 0, 400, 200);
    textBox.endFill();
    textBox.x = (getScreenWidth() - 400) / 2;
    textBox.y = (getScreenHeight() - 200) / 2;
    gameOverContainer.addChild(textBox);

    // Add "GAME OVER" text in white
    const gameOverText = new PIXI.Text({
        text: 'GAME OVER',
        style: { 
            fill: 0xFFFFFF,
            fontSize: 48,
            fontWeight: 'bold'
        }
    });
    gameOverText.x = (getScreenWidth() - gameOverText.width) / 2;
    gameOverText.y = (getScreenHeight() - gameOverText.height) / 2;
    gameOverContainer.addChild(gameOverText);

    // Add final score text in cyan
    const finalScoreText = new PIXI.Text({
        text: `Final Score: ${score}`,
        style: { 
            fill: 0x00FFFF,  // Cyan color
            fontSize: 24,
            fontWeight: 'bold'
        }
    });
    finalScoreText.x = (getScreenWidth() - finalScoreText.width) / 2;
    finalScoreText.y = (getScreenHeight() - finalScoreText.height) / 2 + 60;
    gameOverContainer.addChild(finalScoreText);
    
    let stage = getAppStage();
    stage.addChild(gameOverContainer);
    return gameOverContainer;
}

export function hideGameOver() {
    // Find and remove the game over container
    let stage = getAppStage();
    stage.removeChild(gameOverContainer);
    gameOverContainer = null;
} 