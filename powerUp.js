export default class PowerUp {
    constructor(app, type,posX,posY) {
        this.app = app;
        this.type = type;
        this.radius = 30; // Collision radius
        console.log('Creating power-up of type:', type); // Debug log
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
                // Add collision circle (semi-transparent)
                this.sprite.beginFill(0x00FFFF, 0.2);
                this.sprite.drawCircle(0, 0, this.radius);
                this.sprite.endFill();
                break;
            case 'quadFire':
                // Draw a green cross shape
                this.sprite.beginFill(0x00FF00);
                // Vertical line
                this.sprite.drawRect(-2, -20, 4, 40);  // x, y, width, height
                // Horizontal line
                this.sprite.drawRect(-20, -2, 40, 4);  // x, y, width, height
                this.sprite.endFill();
                // Add collision circle (semi-transparent)
                this.sprite.beginFill(0x00FF00, 0.2);
                this.sprite.drawCircle(0, 0, this.radius);
                this.sprite.endFill();
                break;
            default:
                console.error('Unknown power-up type:', type); // Debug log
                break;
        }
        
        // Randomly choose top or bottom spawn
        const spawnFromTop = Math.random() < 0.5;

        if(posX && posY) {
            this.sprite.x = posX;
            this.sprite.y = posY;
        } else {
            this.sprite.x = Math.random() * (app.screen.width - 40) + 20; // Random X position with padding
            this.sprite.y = spawnFromTop ? -20 : app.screen.height + 20;
        }
        
        
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