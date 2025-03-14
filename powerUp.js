import { getScreenHeight, getScreenWidth, getAppStage } from "./globals.js";
import { RELIC_TYPES, createRelicSprite } from './relics.js';

const DEBUG_POWERUP = false;


export function createPowerUpSprite(powerType,posX,posY,radius) {
    // Create power-up appearance based on type
    let sprite = new PIXI.Graphics();
    switch(powerType) {
        case 'scoreBonus':
            // Draw a yellow star shape
            sprite.beginFill(0xFFFF00);
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
            sprite.drawPolygon(points);
            sprite.endFill();
            // Add collision circle (semi-transparent)
            sprite.beginFill(0xFFFF00, 0.2);
            sprite.drawCircle(0, 0, radius);
            sprite.endFill();
            break;
        case 'rearBullet':
            // Draw a blue diamond shape (doubled in size)
            sprite.beginFill(0x00FFFF);
            sprite.moveTo(0, -20);  // Doubled from -10
            sprite.lineTo(20, 0);   // Doubled from 10
            sprite.lineTo(0, 20);   // Doubled from 10
            sprite.lineTo(-20, 0);  // Doubled from -10
            sprite.endFill();
            // Add collision circle (semi-transparent)
            sprite.beginFill(0x00FFFF, 0.2);
            sprite.drawCircle(0, 0, radius);
            sprite.endFill();
            break;
        case 'quadFire':
            // Draw a green cross shape
            sprite.beginFill(0x00FF00);
            // Vertical line
            sprite.drawRect(-2, -20, 4, 40);  // x, y, width, height
            // Horizontal line
            sprite.drawRect(-20, -2, 40, 4);  // x, y, width, height
            sprite.endFill();
            // Add collision circle (semi-transparent)
            sprite.beginFill(0x00FF00, 0.2);
            sprite.drawCircle(0, 0, radius);
            sprite.endFill();
            break;
    }
    sprite.x = posX;
    sprite.y = posY;
    return sprite;

}
export default class PowerUp {
    constructor(type,posX,posY) {
        this.type = type;
        this.radius = 30; // Collision radius
        if(DEBUG_POWERUP)console.log('Creating power-up of type:', type); // Debug log
        this.velocity = {x:0,y:0};

        // If it's a relic, assign a random relic type
        if (type === 'relic') {
            const relicTypes = Object.keys(RELIC_TYPES);
            this.relicType = relicTypes[Math.floor(Math.random() * relicTypes.length)];
            this.sprite = createRelicSprite(this.relicType, posX, posY);
        }
        else{
            let spriteContainer = createPowerUpSprite(type,posX,posY,this.radius);
            this.sprite = spriteContainer;
        }

        
        const powerBaseSpeed = 0.7;

        if(type === 'scoreBonus') {
            // randomly choose left or right spawn
            const spawnFromLeft = Math.random() < 0.5;
            // set velocity to the left or right
            this.velocity.x = spawnFromLeft ? powerBaseSpeed : -powerBaseSpeed;
            this.velocity.y = 0;
        }else{
            // Randomly choose top or bottom spawn
            const spawnFromTop = Math.random() < 0.5;
            // set velocity to the top or bottom
            this.velocity.x = 0;
            this.velocity.y = spawnFromTop ? powerBaseSpeed : -powerBaseSpeed;
        }

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