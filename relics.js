/**
 * Relic types available in the game
 */
export const RELIC_TYPES = {
    SHIELD: { description: 'Provides a shield that blocks one hit'},           // Provides a shield that blocks one hit
    SPEED_BOOST: { description: 'Increases ship speed' } ,  // Increases ship speed
    RAPID_FIRE: { description: 'Increases fire rate' },    // Increases fire rate
    DOUBLE_POINTS: { description: 'Doubles points earned' }, // Doubles points earned
    HEALTH_BOOST: {description: 'Increases max health'}    // Increases max health
};

const STORAGE_KEY = 'asteroids_relics';


// TODO : different sprites for different relics    
// returns a container with the relic sprite and text
export function createRelicSprite(relicType, x, y) {
    const container = new PIXI.Container();
    
    // Draw the relic symbol
    const sprite = new PIXI.Graphics();
    sprite.beginFill(0x9b59b6); // Purple color for relics
    sprite.drawCircle(0, 0, 15);
    sprite.endFill();
    
    // Add a special symbol
    sprite.beginFill(0xFFFFFF);
    // Draw a cross shape
    sprite.drawRect(-4.5, -12, 9, 24);
    sprite.drawRect(-12, -4.5, 24, 9);
    sprite.endFill();
    
    // Add a glow effect
    sprite.beginFill(0x9b59b6, 0.3);
    sprite.drawCircle(0, 0, 18);
    sprite.endFill();
    
    // Add text with first two letters of relic type
    const text = new PIXI.Text({
        text: relicType.substring(0, 2).toUpperCase(),
        style: {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0x000000,
            align: 'center'
        }
    });
    text.anchor.set(0.5, 0.5); // Center the text
    text.x = 0;
    text.y = 0;
    
    container.addChild(sprite);
    container.addChild(text);
    container.x = x;
    container.y = y;
    
    return container;
}

/**
 * Class to manage the collection of permanent relics
 */
class RelicsCollection {
    constructor() {
        this.relics = new Set();
        this.loadFromStorage();
    }

    /**
     * Add a new relic to the collection
     * @param {string} relicType - The type of relic to add
     */
    addRelic(relicType) {
        console.log('addRelic', relicType);
        if (RELIC_TYPES[relicType]) {
            this.relics.add(`${	relicType}`);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    /**
     * Check if a specific relic is in the collection
     * @param {string} relicType - The type of relic to check
     * @returns {boolean} - Whether the relic is in the collection
     */
    hasRelic(relicType) {
        return this.relics.has(relicType);
    }

    /**
     * Get all active relics
     * @returns {Array} - Array of active relic types
     */
    getActiveRelics() {
        return Array.from(this.relics);
    }

    /**
     * Clear all relics (useful for game reset)
     */
    clear() {
        this.relics.clear();
        this.saveToStorage();
    }

    /**
     * Save relics to localStorage
     */
    saveToStorage() {
        console.log('saveToStorage', this.relics);
        try {
            const relicsArray = Array.from(this.relics);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(relicsArray));
        } catch (error) {
            console.error('Error saving relics:', error);
        }
    }

    /**
     * Load relics from localStorage
     */
    loadFromStorage() {
        try {
            const savedRelics = localStorage.getItem(STORAGE_KEY);
            if (savedRelics) {
                const relicsArray = JSON.parse(savedRelics);
                this.relics = new Set(relicsArray);
            }
        } catch (error) {
            console.error('Error loading relics:', error);
        }
        // print the relics loaded from storage 
        console.log('relics loaded from storage', this.relics);
    }

    /**
     * Get the count of relics in the collection
     * @returns {number} - Number of relics
     */
    getCount() {
        return this.relics.size;
    }
}

// Create a singleton instance
const gRelicsCollection = new RelicsCollection();
export default gRelicsCollection; 




