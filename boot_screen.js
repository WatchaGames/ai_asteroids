import { palette10 } from './palette.js';
import { getPixiApp, getAppStage } from './globals.js';


let loadingContainer = null;

export function showLoadingScreen() {
    // Create container for loading screen elements
    let app = getPixiApp();
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
    let stage = getAppStage();
    stage.addChild(loadingContainer);
}

export function hideLoadingScreen() {
    let app = getPixiApp();
    if (loadingContainer) {
        let stage = getAppStage();
        stage.removeChild(loadingContainer);
        loadingContainer = null;
    }
}


export function handleBootKeyPress(event) {
    return null;
}

export function handleBootKeyRelease(event) {
    return null;    
}


