import { palette10 } from './palette.js';

let loadingContainer = null;

export function showLoadingScreen(app) {
    // Create container for loading screen elements
    loadingContainer = new PIXI.Container();
    
    // Loading text
    const loadingText = new PIXI.Text({
        text: 'Loading...',
        style: {
            fill: palette10.white,
            fontSize: 32,
            fontWeight: 'bold'
        }
    });
    loadingText.x = app.screen.width / 2;
    loadingText.y = app.screen.height / 2;
    loadingText.anchor.set(0.5);
    
    // Add text to container
    loadingContainer.addChild(loadingText);
    
    // Add container to stage
    app.stage.addChild(loadingContainer);
}

export function hideLoadingScreen(app) {
    if (loadingContainer) {
        app.stage.removeChild(loadingContainer);
        loadingContainer = null;
    }
}
