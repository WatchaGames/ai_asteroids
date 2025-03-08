import { palette10 } from './palette.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { STATE_BATTLE } from './globals.js';

let sectorSelectContainer = null;
let selectedSectorIndex = null;
let currentWaveIndex = 0;

export function showSectorSelect(app, waveIndex) {
    currentWaveIndex = waveIndex;
    sectorSelectContainer = new PIXI.Container();
    
    // Title
    const titleText = new PIXI.Text({
        text: 'Select Next Sector',
        style: {
            fill: palette10.white,
            fontSize: 48,
            fontWeight: 'bold'
        }
    });
    titleText.x = app.screen.width / 2;
    titleText.y = 50;
    titleText.anchor.set(0.5);
    
    // Create two sector options
    const sector1 = createSectorFrame(app, waveIndex, 0);
    const sector2 = createSectorFrame(app, waveIndex + 1, 1);
    
    // Calculate positions to center the frames
    const frameWidth = 300; // Width of each frame
    const frameHeight = 200; // Height of each frame
    const spacing = 40; // Space between frames
    const totalWidth = (frameWidth * 2) + spacing;
    
    // Calculate starting X position to center both frames
    const startX = (app.screen.width - totalWidth) / 2;
    
    // Position frames
    sector1.x = startX;
    sector1.y = (app.screen.height - frameHeight) / 2;
    
    sector2.x = startX + frameWidth + spacing;
    sector2.y = (app.screen.height - frameHeight) / 2;
    
    // Add elements to container
    sectorSelectContainer.addChild(titleText);
    sectorSelectContainer.addChild(sector1);
    sectorSelectContainer.addChild(sector2);
    
    // Add container to stage
    app.stage.addChild(sectorSelectContainer);
}

function createSectorFrame(app, waveIndex, optionIndex) {
    const frame = new PIXI.Container();
    
    // Create frame background
    const bg = new PIXI.Graphics();
    bg.lineStyle(2, palette10.white);
    bg.beginFill(palette10.darkBlue, 0.3);
    bg.drawRect(0, 0, 300, 200);
    bg.endFill();
    
    // Make frame interactive
    bg.eventMode = 'static';
    bg.cursor = 'pointer';
    
    bg.on('pointerover', () => {
        bg.tint = palette10.yellow;
    });
    
    bg.on('pointerout', () => {
        bg.tint = 0xFFFFFF;
    });
    
    bg.on('click', () => {
        selectedSectorIndex = optionIndex;
    });
    

    const sectorDescription = GetSectorDescriptionByIndex(waveIndex);

    // Add sector name
    const sectorName = new PIXI.Text({
        text: sectorDescription.name,
        style: {
            fill: palette10.white,
            fontSize: 24,
            align: 'center'
        }
    });
    sectorName.x = 150;
    sectorName.y = 30;
    sectorName.anchor.set(0.5);
    
    // Add sector description
    const description = new PIXI.Text({
        text: sectorDescription.asteroids + " asteroids, " + sectorDescription.bonuses + " bonuses",
        style: {
            fill: palette10.white,
            fontSize: 16,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 280
        }
    });
    description.x = 150;
    description.y = 80;
    description.anchor.set(0.5, 0);
    
    frame.addChild(bg);
    frame.addChild(sectorName);
    frame.addChild(description);
    
    return frame;
}

function generateSectorDescription(waveIndex) {
    // This could be expanded with more varied descriptions based on the sector
    const difficultyLevel = Math.floor(waveIndex / 10) + 1;
    return `Difficulty: Level ${difficultyLevel}\nAsteroids: ${5 + waveIndex * 2}\nBonus Frequency: Medium`;
}

export function updateSectorSelect() {
    // Return the selected sector if one was chosen
    if (selectedSectorIndex !== null) {
        const chosenWaveIndex = currentWaveIndex + selectedSectorIndex;
        selectedSectorIndex = null; // Reset for next time
        return STATE_BATTLE;
    }
    return null;
}

export function hideSectorSelect(app) {
    if (sectorSelectContainer) {
        app.stage.removeChild(sectorSelectContainer);
        sectorSelectContainer = null;
    }
}

export function getSelectedSectorIndex() {
    return selectedSectorIndex;
} 


export function handleSectorSelectKeyPress(event) {
    return null;
}

export function handleSectorSelectKeyRelease(event) {
    return null;
}