import { palette10 } from './palette.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { STATE_BATTLE, setCurrentSectorIndex, getCurrentMissionNumber, setCurrentMissionNumber, getCurrentSectorIndex, getPixiApp, getScreenWidth, getScreenHeight, getAppStage } from './globals.js';
import { getMainFontStyleBig, getMainFontStyleNormal } from './fonts.js';

let sectorSelectContainer = null;
let selectedSectorIndex = null;
let currentWaveIndex = 0;

export function showSectorSelect(waveIndex) {
    currentWaveIndex = waveIndex;
    sectorSelectContainer = new PIXI.Container();
    
    const fontStyleBig = getMainFontStyleBig();
    // Title
    const titleText = new PIXI.Text({
        text: 'Select Next Sector to warp to...',
        style: fontStyleBig
    });
    titleText.x = getScreenWidth() / 2;
    titleText.y = getScreenHeight() * 0.1;
    titleText.anchor.set(0.5);

    const frameWidth = 300; // Width of each frame
    const frameHeight = 200; // Height of each frame

    // Create two sector options
    const sector1 = createSectorFrame(waveIndex + 1,frameWidth,frameHeight);
    const sector2 = createSectorFrame(waveIndex + 2,frameWidth,frameHeight);
    
    // Calculate positions to center the frames
    const spacing = 40; // Space between frames
    const totalWidth = (frameWidth * 2) + spacing;
    
    // Calculate starting X position to center both frames
    const startX = (getScreenWidth() - totalWidth) / 2;
    
    // Position frames
    sector1.x = startX;
    sector1.y = (getScreenHeight() - frameHeight) / 2;
    
    sector2.x = startX + frameWidth + spacing;
    sector2.y = (getScreenHeight() - frameHeight) / 2;
    
    // Add elements to container
    sectorSelectContainer.addChild(titleText);
    sectorSelectContainer.addChild(sector1);
    sectorSelectContainer.addChild(sector2);
    
    // Add container to stage
    let stage = getAppStage();
    stage.addChild(sectorSelectContainer);
}

function createSectorFrame(targetSectorIndex,frameWidth,frameHeight) {
    const frame = new PIXI.Container();
    const fontStyleNormal = getMainFontStyleNormal();
    const fontStyleBig = getMainFontStyleBig();

    // Create frame background
    const bg = new PIXI.Graphics();
    bg.lineStyle(2, palette10.white);
    bg.beginFill(palette10.darkBlue, 0.3);
    bg.drawRect(0, 0, frameWidth, frameHeight);
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
        selectedSectorIndex = targetSectorIndex;
    });
    

    const sectorDescription = GetSectorDescriptionByIndex(targetSectorIndex);

    // Add sector name
    const sectorName = new PIXI.Text({
        text: sectorDescription.name,
        style: fontStyleBig
    });
    sectorName.x = 150;
    sectorName.y = 30;
    sectorName.anchor.set(0.5);
    
    // Add sector description
    const description = new PIXI.Text({
        text: sectorDescription.asteroids + " asteroids, " + sectorDescription.bonuses + " bonuses",
        style: fontStyleNormal
    });
    description.align = 'center';

    const difficultyText = new PIXI.Text({
        text: `Distance: ${targetSectorIndex - getCurrentSectorIndex()}`,
        style: {
            fill: palette10.white,
            fontSize: 16,
            align: 'center'
        }
    });

    description.x = 150;
    description.y = 80;
    description.anchor.set(0.5, 0);
    
    frame.addChild(bg);
    frame.addChild(sectorName);
    frame.addChild(description);
    frame.addChild(difficultyText);

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
        setCurrentSectorIndex(selectedSectorIndex);
        setCurrentMissionNumber(getCurrentMissionNumber() + 1);
        selectedSectorIndex = null; // Reset for next time
        return STATE_BATTLE;
    }
    return null;
}

export function hideSectorSelect() {
    if (sectorSelectContainer) {
        let stage = getAppStage();
        stage.removeChild(sectorSelectContainer);
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