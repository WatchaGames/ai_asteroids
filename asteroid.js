class Asteroid {
    constructor(app, size, sizeLevel, x, y) {
        this.app = app;
        this.size = size;
        this.sizeLevel = sizeLevel;
        
        // Create the sprite
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xAAAAAA);
        
        // Generate random polygon shape
        const vertices = Math.floor(Math.random() * 5) + 5; // 5 to 10 vertices
        const angleStep = (Math.PI * 2) / vertices;
        const points = [];
        let maxRadius = 0;
        
        for (let i = 0; i < vertices; i++) {
            const angle = i * angleStep;
            const radius = size * (0.8 + Math.random() * 0.4);
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
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        
        this.radius = maxRadius;
        app.stage.addChild(this.sprite);
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
        if (this.sizeLevel === 'large') {
            return this.createSplitAsteroids(15, 'medium', 2);
        } else if (this.sizeLevel === 'medium') {
            return this.createSplitAsteroids(7.5, 'small', 2);
        }
        return [];
    }

    createSplitAsteroids(size, sizeLevel, count) {
        const newAsteroids = [];
        for (let i = 0; i < count; i++) {
            const asteroid = new Asteroid(
                this.app,
                size,
                sizeLevel,
                this.sprite.x,
                this.sprite.y
            );
            asteroid.velocity.x += (Math.random() - 0.5) * 2;
            asteroid.velocity.y += (Math.random() - 0.5) * 2;
            newAsteroids.push(asteroid);
        }
        return newAsteroids;
    }
}

export default Asteroid; 