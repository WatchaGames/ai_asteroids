import { palette10 } from './palette.js';
import { GetSectorAsteroidSize, GetSectorAsteroidSpeed, GetAsteroidToSpawnInfo } from './sectors.js';
import { getAppStage, getScreenWidth, getScreenHeight } from './globals.js';
class Asteroid {
    // spawnns asteroid based on sector description
    constructor(desctorDesc, inSizeName, x, y) {
        this.asteroidType = inSizeName;
        this.sectorDesc = desctorDesc; // on le garde pour les split
        this.isIndestructible = inSizeName === 'indestructible';

        this.size =  GetSectorAsteroidSize(desctorDesc,inSizeName);

        // Create the sprite
        this.sprite = new PIXI.Graphics();
        
        // Set color based on size
        const color = this.getColorForSize();
        this.sprite.beginFill(color);
        
        // Generate random polygon shape
        const vertices = this.isIndestructible ? 8 : Math.floor(Math.random() * 5) + 5; // 8 vertices for indestructible
        const angleStep = (Math.PI * 2) / vertices;
        const points = [];
        let maxRadius = 0;
        
        for (let i = 0; i < vertices; i++) {
            const angle = i * angleStep;
            const radius = this.size * (this.isIndestructible ? 1 : (0.8 + Math.random() * 0.4));
            if (radius > maxRadius) maxRadius = radius;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            points.push(pointX, pointY);
        }
        
        if (this.isIndestructible) {
            // For indestructible asteroids, draw with both fill and stroke
            this.sprite.lineStyle(2, palette10.grape_0);
            this.sprite.beginFill(color);
            this.sprite.drawPolygon(points);
            this.sprite.endFill();
        } else {
            // For regular asteroids, just fill
            this.sprite.beginFill(color);
            this.sprite.drawPolygon(points);
            this.sprite.endFill();
        }
        
        // Position and velocity
        this.sprite.x = x || Math.random() * getScreenWidth();
        this.sprite.y = y || Math.random() * getScreenHeight();

        if (this.isIndestructible) {
            this.velocity = { x: 0, y: 0 }; // No movement for indestructible asteroids
        } else {
            const asteroidInfo = GetAsteroidToSpawnInfo(this.sectorDesc,this.asteroidType);
            const speed = asteroidInfo.speed;
            this.velocity = {
                x: (Math.random() - 0.5) * speed,
                y: (Math.random() - 0.5) * speed
            };
        }
        
        this.radius = maxRadius;
        let stage = getAppStage();
        stage.addChild(this.sprite);
    }

    getColorForSize() {
        switch(this.asteroidType) {
            case 'indestructible':
                return palette10.grape_1;
            case 'large':
                return palette10.blue_1;
            case 'medium':
                return palette10.blue_2;
            case 'small':
                return palette10.blue_3;
            default:
                return palette10.white;
        }
    }

    update() {
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        // Screen wrapping
        if (this.sprite.x < 0) this.sprite.x = getScreenWidth();
        if (this.sprite.x > getScreenWidth()) this.sprite.x = 0;
        if (this.sprite.y < 0) this.sprite.y = getScreenHeight();
        if (this.sprite.y > getScreenHeight()) this.sprite.y = 0;
    }

    destroy() {
        let stage = getAppStage();
        stage.removeChild(this.sprite);
    }

    split() {
        if (this.asteroidType === 'large') {
            // check for loot of score  
            return this.createSplitAsteroids('medium', 2);
        } else if (this.asteroidType === 'medium') {
            return this.createSplitAsteroids('small', 2);
        }
        return [];
    }

    createSplitAsteroids(asteroidType, count) {
        const newAsteroids = [];
        for (let i = 0; i < count; i++) {
            const asteroid = new Asteroid(
                this.sectorDesc,
                asteroidType,
                this.sprite.x,
                this.sprite.y
            );
            const speed = GetSectorAsteroidSpeed(this.sectorDesc,asteroidType);
            asteroid.velocity.x = (Math.random() - 0.5) * speed;
            asteroid.velocity.y = (Math.random() - 0.5) * speed;
            newAsteroids.push(asteroid);
        }
        return newAsteroids;
    }
}



export default Asteroid; 