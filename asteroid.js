import { palette10 } from './palette.js';
import { GetSectorAsteroidSize, GetSectorAsteroidSpeed, GetAsteroidToSpawnInfo } from './sectors.js';

class Asteroid {
    // spawnns asteroid based on sector description
    constructor(app, desctorDesc, inSizeName, x, y) {
        this.app = app;
        this.sizeName = inSizeName;
        this.sectorDesc = desctorDesc; // on le garde pour les split

        this.size = GetSectorAsteroidSize(desctorDesc,inSizeName);

        // Create the sprite
        this.sprite = new PIXI.Graphics();
        
        // Set color based on size
        const color = this.getColorForSize();
        this.sprite.beginFill(color);
        
        // Generate random polygon shape
        const vertices = Math.floor(Math.random() * 5) + 5; // 5 to 10 vertices
        const angleStep = (Math.PI * 2) / vertices;
        const points = [];
        let maxRadius = 0;
        
        for (let i = 0; i < vertices; i++) {
            const angle = i * angleStep;
            const radius = this.size * (0.8 + Math.random() * 0.4);
            if (radius > maxRadius) maxRadius = radius;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            points.push(pointX, pointY);
        }
        
        this.sprite.drawPolygon(points);
        this.sprite.endFill();
        
        // Position and velocity
        this.sprite.x = x || Math.random() * app.screen.width;
        this.sprite.y = y || Math.random() * app.screen.height;

        const asteroidInfo = GetAsteroidToSpawnInfo(this.sectorDesc,this.sizeName);

        //const speed = GetSectorAsteroidSpeed(this.sectorDesc,this.sizeName);
        const speed = asteroidInfo.speed;


        // TODO : handle different movement types of asteroids

        this.velocity = {
            x: (Math.random() - 0.5) * speed,
            y: (Math.random() - 0.5) * speed
        };
        
        this.radius = maxRadius;
        app.stage.addChild(this.sprite);
    }

    getColorForSize() {
        switch(this.sizeName) {
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
        if (this.sprite.x < 0) this.sprite.x = this.app.screen.width;
        if (this.sprite.x > this.app.screen.width) this.sprite.x = 0;
        if (this.sprite.y < 0) this.sprite.y = this.app.screen.height;
        if (this.sprite.y > this.app.screen.height) this.sprite.y = 0;
    }

    destroy() {
        this.app.stage.removeChild(this.sprite);
    }

    split() {
        if (this.sizeName === 'large') {
            // check for loot of score  
            return this.createSplitAsteroids('medium', 2);
        } else if (this.sizeName === 'medium') {
            return this.createSplitAsteroids('small', 2);
        }
        return [];
    }

    createSplitAsteroids(sizeName, count) {
        const newAsteroids = [];
        for (let i = 0; i < count; i++) {
            const asteroid = new Asteroid(
                this.app,
                this.sectorDesc,
                sizeName,
                this.sprite.x,
                this.sprite.y
            );
            const speed = GetSectorAsteroidSpeed(this.sectorDesc,sizeName);
            asteroid.velocity.x = (Math.random() - 0.5) * speed;
            asteroid.velocity.y = (Math.random() - 0.5) * speed;
            newAsteroids.push(asteroid);
        }
        return newAsteroids;
    }
}



export default Asteroid; 