/**
 * Relic types available in the game
 */
export const RELIC_TYPES = {
    SHIELD: 'shield',           // Provides a shield that blocks one hit
    SPEED_BOOST: 'speedBoost',  // Increases ship speed
    RAPID_FIRE: 'rapidFire',    // Increases fire rate
    DOUBLE_POINTS: 'doublePoints', // Doubles points earned
    HEALTH_BOOST: 'healthBoost'    // Increases max health
};

/**
 * Class to manage the collection of permanent relics
 */
class RelicsCollection {
    constructor() {
        this.relics = new Set();
    }

    /**
     * Add a new relic to the collection
     * @param {string} relicType - The type of relic to add
     */
    addRelic(relicType) {
        if (RELIC_TYPES[relicType.toUpperCase()]) {
            this.relics.add(relicType);
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
    }
}

// Create a singleton instance
const gRelicsCollection = new RelicsCollection();
export default gRelicsCollection; 

