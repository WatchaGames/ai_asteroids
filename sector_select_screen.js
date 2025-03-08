import { palette10 } from './palette.js';
import { GetSectorNameByWaveIndex } from './sectors.js';
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
    
    sector1.x = app.screen.width * 0.25;
    sector1.y = app.screen.height * 0.3;
    
    sector2.x = app.screen.width * 0.75;
    sector2.y = app.screen.height * 0.3;
    
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
    
    // Add sector name
    const sectorName = new PIXI.Text({
        text: GetSectorNameByWaveIndex(waveIndex),
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
        text: generateSectorDescription(waveIndex),
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