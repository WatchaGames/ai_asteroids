import { palette10 } from './palette.js';
import { GetAsteroidToSpawnInfo } from './sectors.js';
import { getAppStage, getScreenWidth, getScreenHeight } from './globals.js';

import { getPlayer } from './battle_screen.js';

class Asteroid {
    // spawnns asteroid based on sector description
    // optX and optY are optional parameters for setting the initial position (used for splitted asteroids)
    constructor(desctorDesc, inSizeName) {
        this.asteroidType = inSizeName;
        this.sectorDesc = desctorDesc; // on le garde pour les split
        this.isIndestructible = inSizeName === 'indestructible';

        // get specs of asteroid to spawn from its type and sector description
        const asteroidInfo = GetAsteroidToSpawnInfo(this.sectorDesc,this.asteroidType);
        this.size = asteroidInfo.size;

        // Create the sprite
        this.sprite = new PIXI.Graphics();
        
        // Set color based on size
        const color = this.getColorForSize();
        this.sprite.beginFill(color);
        
        // Generate random polygon shape
        // indestructible asteroids have 8 vertices, other asteroids have a random number of vertices between 5 and 8
        const vertices = this.isIndestructible ? 8 : Math.floor(Math.random() * 5) + 5; // 8 vertices for indestructible
        const angleStep = (Math.PI * 2) / vertices;
        const points = [];
        let maxRadius = 0;
        
        for (let i = 0; i < vertices; i++) {
            const angle = i * angleStep;
            // const radius = this.size * (this.isIndestructible ? 1 : (0.8 + Math.random() * 0.4));
            const radius = this.size * ((0.8 + Math.random() * 0.4));
            if (radius > maxRadius) maxRadius = radius;
            const pointX = Math.cos(angle) * radius;
            const pointY = Math.sin(angle) * radius;
            points.push(pointX, pointY);
        }
        
        if (this.isIndestructible) {
            // For indestructible asteroids, draw with both fill and stroke
            this.sprite.lineStyle(3, palette10.grape_0);
            this.sprite.beginFill(color);
            this.sprite.drawPolygon(points);
            this.sprite.endFill();
        } else {
            // For regular asteroids, just fill
            this.sprite.beginFill(color);
            this.sprite.drawPolygon(points);
            this.sprite.endFill();
        }

        // default position is center of the screen
        this.setPosition(getScreenWidth()/2, getScreenHeight()/2);
        

        if (this.isIndestructible) {
            this.setBehaviour('static',asteroidInfo.speed);
        } else {
            this.setBehaviour('default',asteroidInfo.speed);
        }
        
        this.radius = maxRadius;
        let stage = getAppStage();
        stage.addChild(this.sprite);
    }

    setBehaviour(behaviour,speed) {
        this.speed = speed;
        if(behaviour == 'aiming') {

            console.log('aiming asteroid');
            const player = getPlayer();
            const direction = {
                x: player.sprite.x - this.sprite.x,
                y: player.sprite.y - this.sprite.y
            };
            const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            this.velocity = {
                x: direction.x / length * this.speed,
                y: direction.y / length * this.speed
            };
        } else if(behaviour == 'static') {
            this.velocity = { x: 0, y: 0 }; // No movement for indestructible asteroids
        } else {
            this.velocity = {
                x: (Math.random() - 0.5) * this.speed,
                y: (Math.random() - 0.5) * this.speed
            };
        }
    }

    setPosition(x,y) {
        this.sprite.x = x;
        this.sprite.y = y;
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

    // large and medium asteroids can split into 2 smaller asteroids
    split() {
        if (this.asteroidType === 'large') {
            // check for loot of score  
            return this.createSplitAsteroids('medium', 2, this.sprite.x, this.sprite.y);
        } else if (this.asteroidType === 'medium') {
            return this.createSplitAsteroids('small', 2, this.sprite.x, this.sprite.y);
        }
        return [];
    }

    // create split asteroids at location
    createSplitAsteroids(asteroidType, count, x, y) {
        const newAsteroids = [];
        for (let i = 0; i < count; i++) {
            const asteroid = new Asteroid(
                this.sectorDesc,
                asteroidType,
            );
            const spawnInfo = GetAsteroidToSpawnInfo(this.sectorDesc,asteroidType);
/*             asteroid.velocity.x = (Math.random() - 0.5) * spawnInfo.speed;
            asteroid.velocity.y = (Math.random() - 0.5) * spawnInfo.speed;
 */            asteroid.setPosition(x,y);

            // if to close to player then cannot be aiming
            if(this.isTooCloseToPlayer(x,y)) {
                asteroid.setBehaviour('default',spawnInfo.speed);
            }else{
                asteroid.setBehaviour(spawnInfo.behaviour,spawnInfo.speed);
            }

            newAsteroids.push(asteroid);
        }
        return newAsteroids;
    }

    isTooCloseToPlayer(x,y) {
        const distance = Math.sqrt((x - this.sprite.x) ** 2 + (y - this.sprite.y) ** 2);
        return distance < getScreenWidth()*0.1;
    }
}



export default Asteroid; 