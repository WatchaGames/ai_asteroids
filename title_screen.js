import { palette10 } from './palette.js';
import Starfield from './starfield.js';

let titleContainer = null;
let starfield = null;

export function showTitleScreen(app) {
    // Create container for title screen elements
    titleContainer = new PIXI.Container();
    
    // Create starfield
    starfield = new Starfield(app);
    
    // Title text
    const titleText = new PIXI.Text({
        text: 'RogOids',
        style: {
            fill: palette10.white,
            fontSize: 64,
            fontWeight: 'bold'
        }
    });
    titleText.x = app.screen.width / 2;
    titleText.y = app.screen.height / 3;
    titleText.anchor.set(0.5);
    
    // Start game text
    const startText = new PIXI.Text({
        text: 'Press SPACE to Start',
        style: {
            fill: palette10.yellow,
            fontSize: 24
        }
    });
    startText.x = app.screen.width / 2;
    startText.y = app.screen.height * 0.6;
    startText.anchor.set(0.5);
    
    // Controls text
    const controlsText = new PIXI.Text({
        text: 'Controls:\n↑ Thrust\n← → Rotate\nSPACE Fire\nSHIFT Teleport',
        style: {
            fill: palette10.white,
            fontSize: 20,
            align: 'center'
        }
    });
    controlsText.x = app.screen.width / 2;
    controlsText.y = app.screen.height * 0.75;
    controlsText.anchor.set(0.5);
    
    // Add elements to container
    titleContainer.addChild(titleText);
    titleContainer.addChild(startText);
    titleContainer.addChild(controlsText);
    
    // Add container to stage
    app.stage.addChild(titleContainer);
   
}

export function updateTitleScreen(delta) {
    if (starfield) {
        starfield.update({x:5,y:0} );
    }
}

export function hideTitleScreen(app) {
    if (titleContainer) {
        app.stage.removeChild(titleContainer);
        titleContainer = null;
    }
    if (starfield) {
        starfield.destroy();
        starfield = null;
    }
} 