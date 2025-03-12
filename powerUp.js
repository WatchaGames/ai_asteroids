import { getScreenHeight, getScreenWidth, getAppStage } from "./globals.js";

const DEBUG_POWERUP = false;

export default class PowerUp {
    constructor(type,posX,posY) {
        this.type = type;
        this.radius = 30; // Collision radius
        if(DEBUG_POWERUP)console.log('Creating power-up of type:', type); // Debug log
        this.sprite = new PIXI.Graphics();
        this.velocity = {x:0,y:0};

        // Create power-up appearance based on type
        switch(type) {
            case 'scoreBonus':
                // Draw a yellow star shape
                this.sprite.beginFill(0xFFFF00);
                // Draw a 5-pointed star
                const points = [];
                for (let i = 0; i < 5; i++) {
                    // Outer points of the star
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    points.push(
                        Math.cos(angle) * 15,  // Outer point x
                        Math.sin(angle) * 15   // Outer point y
                    );
                    // Inner points of the star
                    const innerAngle = angle + (2 * Math.PI) / 10;
                    points.push(
                        Math.cos(innerAngle) * 7,  // Inner point x
                        Math.sin(innerAngle) * 7   // Inner point y
                    );
                }
                this.sprite.drawPolygon(points);
                this.sprite.endFill();
                // Add collision circle (semi-transparent)
                this.sprite.beginFill(0xFFFF00, 0.2);
                this.sprite.drawCircle(0, 0, this.radius);
                this.sprite.endFill();
                break;
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
        

        if(type === 'scoreBonus') {
            // randomly choose left or right spawn
            const spawnFromLeft = Math.random() < 0.5;
            // set velocity to the left or right
            this.velocity.x = spawnFromLeft ? 1 : -1;
            this.velocity.y = 0;
        }else{
            // Randomly choose top or bottom spawn
            const spawnFromTop = Math.random() < 0.5;
            // set velocity to the top or bottom
            this.velocity.x = 0;
            this.velocity.y = spawnFromTop ? 1 : -1;
        }


        this.sprite.x = posX;
        this.sprite.y = posY;
        
        
        this.speed = 1; // Movement speed (halved from 2)
        
        let stage = getAppStage();
        stage.addChild(this.sprite);
    }
    
    update() {
        // Move the power-up by its velocity
        this.sprite.x += this.velocity.x * this.speed;
        this.sprite.y += this.velocity.y * this.speed;
        
        // check if power-up is off screen
        if(this.sprite.x < -20 || this.sprite.x > getScreenWidth() + 20 ||
            this.sprite.y < -20 || this.sprite.y > getScreenHeight() + 20) {
            this.destroy();
            return true; // Signal for removal
        }
        return false;
    }
    
    destroy() {
        let stage = getAppStage();
        stage.removeChild(this.sprite);
    }
} 