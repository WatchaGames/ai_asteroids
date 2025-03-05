export default class PowerUp {
    constructor(app, type) {
        this.app = app;
        this.type = type;
        this.sprite = new PIXI.Graphics();
        
        // Create power-up appearance based on type
        switch(type) {
            case 'rearBullet':
                // Draw a blue diamond shape (doubled in size)
                this.sprite.beginFill(0x00FFFF);
                this.sprite.moveTo(0, -20);  // Doubled from -10
                this.sprite.lineTo(20, 0);   // Doubled from 10
                this.sprite.lineTo(0, 20);   // Doubled from 10
                this.sprite.lineTo(-20, 0);  // Doubled from -10
                this.sprite.endFill();
                break;
            // Add more power-up types here later
        }
        
        // Randomly choose top or bottom spawn
        const spawnFromTop = Math.random() < 0.5;
        this.sprite.x = Math.random() * (app.screen.width - 40) + 20; // Random X position with padding
        this.sprite.y = spawnFromTop ? -20 : app.screen.height + 20;
        
        this.speed = 1; // Movement speed (halved from 2)
        this.direction = spawnFromTop ? 1 : -1; // 1 for moving down, -1 for moving up
        
        app.stage.addChild(this.sprite);
    }
    
    update() {
        // Move the power-up
        this.sprite.y += this.speed * this.direction;
        
        // Check if power-up is off screen
        if ((this.direction === 1 && this.sprite.y > this.app.screen.height + 20) ||
            (this.direction === -1 && this.sprite.y < -20)) {
            this.destroy();
            return true; // Signal for removal
        }
        
        return false;
    }
    
    destroy() {
        this.app.stage.removeChild(this.sprite);
    }
} 