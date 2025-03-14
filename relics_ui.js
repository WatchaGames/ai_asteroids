import { getAppStage } from './globals.js';
import gRelicsCollection from './relics.js';
import { createRelicSprite } from './relics.js';
import { animateTweenSpritePos } from './tween.js';
import { getPixiApp } from './globals.js';
export let gRelicsUI = null;

let RELICS_STACK_LEFT_X_POSITION = 100;
let RELICS_STACK_BOTTOM_Y_POSITION = 100;
let RELICS_STACK_SPACING = 24;


export function InitRelicsUI(){
    RELICS_STACK_LEFT_X_POSITION = getPixiApp().screen.width *0.22;
    RELICS_STACK_BOTTOM_Y_POSITION = getPixiApp().screen.height *0.2;

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


const RELIC_ANIMATION = {
    duration: 500, // milliseconds
    easing: 'easeOutQuad' // easing function for smooth motion
};


export function flyRelicToCollection(powerUp) {
    
    // Scale down the power-up sprite to half its size
    powerUp.sprite.scale.set(0.5);
    
    // Calculate destination  position
    const startX = powerUp.sprite.x;
    const startY = powerUp.sprite.y;

    const finalX = RELICS_STACK_LEFT_X_POSITION + (gRelicsCollection.getCount() * RELICS_STACK_SPACING);
    const finalY = RELICS_STACK_BOTTOM_Y_POSITION;
    
    // Start animation from current position to final position
    animateTweenSpritePos(
        powerUp.sprite,
        startX,
        startY,
        finalX,
        finalY,
        RELIC_ANIMATION.duration,
        // TODO voir comment faire pour ne pas detruire le sprite ou  mettre ca 
        false
    );
    

}

