
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
    
    // Draw main text box
    gameOverBorder.lineStyle(4, 0xFFFF00);
    gameOverBorder.beginFill(0x000000);
    gameOverBorder.moveTo(centerX - 150, centerY - 40);
    gameOverBorder.lineTo(centerX + 150, centerY - 40);
    gameOverBorder.lineTo(centerX + 150, centerY + 40);
    gameOverBorder.lineTo(centerX - 150, centerY + 40);
    gameOverBorder.lineTo(centerX - 150, centerY - 40);
    gameOverBorder.endFill();

    gameOverContainer.addChild(gameOverBorder);
    
    // Add GAME OVER text
    const gameOverLabel = new PIXI.Text({
        text: 'GAME OVER',
        style: { 
            fill: 0xFFFF00,
            fontSize: 32,
            fontWeight: 'bold'
        }
    });
    gameOverLabel.x = centerX - gameOverLabel.width / 2;
    gameOverLabel.y = centerY - gameOverLabel.height / 2;
    gameOverContainer.addChild(gameOverLabel);
    
    // Add final score
    const finalScoreText = new PIXI.Text({
        text: `Final Score: ${score}`,
        style: { 
            fill: 0xFF0000,
            fontSize: 24,
            fontWeight: 'bold'
        }
    });
    finalScoreText.x = centerX - finalScoreText.width / 2;
    finalScoreText.y = centerY + 60;
    gameOverContainer.addChild(finalScoreText);
    
    app.stage.addChild(gameOverContainer);
    return gameOverContainer;
}

export function hideGameOver(app) {
    // Find and remove the game over container
    app.stage.removeChild(gameOverContainer);
    gameOverContainer = null;
} 