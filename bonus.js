class Bonus {
    constructor(app) {
        this.app = app;
        this.sprite = new PIXI.Graphics();
        
        // Create a star shape
        this.sprite.beginFill(0xFFFF00); // Yellow color
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * 10;
            const y = Math.sin(angle) * 10;
            if (i === 0) {
                this.sprite.moveTo(x, y);
            } else {
                this.sprite.lineTo(x, y);
            }
        }
        this.sprite.endFill();
        
        // Randomly choose starting side (left or right)
        const startFromLeft = Math.random() < 0.5;
        this.sprite.x = startFromLeft ? -20 : app.screen.width + 20;
        this.sprite.y = Math.random() * (app.screen.height - 100) + 50; // Random height with padding
        
        // Set movement speed and direction
        this.speed = 3;
        this.direction = startFromLeft ? 1 : -1;
        
        // Add to stage
        app.stage.addChild(this.sprite);
    }

    update() {
        // Move across the screen
        this.sprite.x += this.speed * this.direction;
        
        // Remove if off screen
        if ((this.direction > 0 && this.sprite.x > this.app.screen.width + 20) ||
            (this.direction < 0 && this.sprite.x < -20)) {
            this.destroy();
            return true; // Signal to remove from array
        }
        
        return false;
    }

    destroy() {
        this.app.stage.removeChild(this.sprite);
    }
}

export default Bonus; 