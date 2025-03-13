import { getAppStage } from './globals.js';
import gRelicsCollection from './relics.js';
import { createRelicSprite } from './relics.js';

export let gRelicsUI = null;

export function InitRelicsUI(){
    gRelicsUI = new RelicsUI();
}

export function DestroyRelicsUI(){
    gRelicsUI.destroy();
    gRelicsUI = null;
}

export class RelicsUI {
    constructor() {
        this.container = new PIXI.Container();
        this.relicSprites = new Map();
        getAppStage().addChild(this.container);
        this.updateDisplay();
    }


    updateDisplay() {
        // Clear existing sprites
        this.relicSprites.forEach(sprite => {
            this.container.removeChild(sprite);
        });
        this.relicSprites.clear();

        // Get active relics
        const relics = gRelicsCollection.getActiveRelics();
        
        // Create sprites for each relic
        relics.forEach((relicType, index) => {
            const x = 30 + (index * 40); // Space relics horizontally
            const y = 30; // Fixed Y position
            const sprite = createRelicSprite(relicType, x, y);
            this.container.addChild(sprite);
            this.relicSprites.set(relicType, sprite);
        });
    }

    destroy() {
        if (this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
    }

    showRelicsUI(){
        this.container.visible = true;
    }

    hideRelicsUI(){
        this.container.visible = false;
    }
} 