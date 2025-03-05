let gameOverContainer = null;

export function showGameOver(app, score) {


    if(gameOverContainer !=null){
        console.error("Game over screen already exists");
        return;
    }
    // Create game over overlay
    gameOverContainer = new PIXI.Container();
    
    // Add semi-transparent black background
    const overlay = new PIXI.Graphics();
    overlay.beginFill(0x000000, 0.8);
    overlay.drawRect(0, 0, app.screen.width, app.screen.height);
    overlay.endFill();
    gameOverContainer.addChild(overlay);
    
    // Create vectorized GAME OVER text
    const gameOverBorder = new PIXI.Graphics();
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;
    
    // Draw main text box with white border
    const textBox = new PIXI.Graphics();
    textBox.lineStyle(2, 0xFFFFFF);  // White border
    textBox.beginFill(0x000000);
    textBox.drawRect(0, 0, 400, 200);
    textBox.endFill();
    textBox.x = (app.screen.width - 400) / 2;
    textBox.y = (app.screen.height - 200) / 2;
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
    gameOverText.x = (app.screen.width - gameOverText.width) / 2;
    gameOverText.y = (app.screen.height - gameOverText.height) / 2;
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
    finalScoreText.x = (app.screen.width - finalScoreText.width) / 2;
    finalScoreText.y = (app.screen.height - finalScoreText.height) / 2 + 60;
    gameOverContainer.addChild(finalScoreText);
    
    app.stage.addChild(gameOverContainer);
    return gameOverContainer;
}

export function hideGameOver(app) {
    // Find and remove the game over container
    app.stage.removeChild(gameOverContainer);
    gameOverContainer = null;
} 