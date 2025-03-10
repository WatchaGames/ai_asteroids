export const GAME_VERSION = '0.0.1';

// Game States
export const STATE_BOOT = 'boot';
export const STATE_TITLE = 'title';
export const STATE_BATTLE = 'battle';
export const STATE_SECTOR_SELECT = 'sector_select';
export const STATE_GAME_OVER = 'gameover';

// Global Game State Variables
let gGameState = STATE_BOOT;
export let gCurrentSectorIndex = 1;
export let gCurrentMissionNumber = 1;

// PixiJS Application
let gPixiApp = null;

export function getCurrentGameState() {
    return gGameState;
}

export function setGameState(newState) {
    gGameState = newState;
}

export function getCurrentSectorIndex() {
    return gCurrentSectorIndex;
}

export function setCurrentSectorIndex(newIndex) {
    gCurrentSectorIndex = newIndex;
}

export function getCurrentMissionNumber() {
    return gCurrentMissionNumber;
}

export function setCurrentMissionNumber(newNumber) {
    gCurrentMissionNumber = newNumber;
}

export function getPixiApp() {
    return gPixiApp;
}

export function setPixiApp(app) {
    gPixiApp = app;
}
