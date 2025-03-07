class Starfield {
    constructor(app) {
        this.app = app;
        this.stars = new PIXI.Container();
        this.starCount = 100; // Number of stars
        
        // Star colors from CGA palette
        this.starColors = [
            0x555555,  // Dark gray (distant stars)
            0xAAAAAA,  // Light gray (medium stars)
            0xFFFFFF   // White (close stars)
        ];

        // Create the stars immediately
        this.createStars();
    }

    createStars() {
        for (let i = 0; i < this.starCount; i++) {
            const star = new PIXI.Graphics();
            const size = Math.random() < 0.6 ? 1 : (Math.random() < 0.8 ? 2 : 3); // Different star sizes
            const color = this.starColors[size - 1]; // Color based on size
            
            star.beginFill(color);
            star.drawCircle(0, 0, size / 2);
            star.endFill();
            
            // Random position
            star.x = Math.random() * this.app.screen.width;
            star.y = Math.random() * this.app.screen.height;
            
            // Store original position for parallax effect
            star.originalX = star.x;
            star.originalY = star.y;
            
            // Parallax speed based on size (bigger = closer = faster)
            star.parallaxFactor = size * 0.2;
            
            this.stars.addChild(star);
        }
        this.app.stage.addChildAt(this.stars, 0); // Add at index 0 to be in background
    }

    // Optional: Add subtle parallax effect based on ship movement
    update(shipVelocity) {
        if(this.stars == null)return;
        for (let star of this.stars.children) {
            // Move stars slightly in opposite direction of ship movement
            star.x -= shipVelocity.x * star.parallaxFactor;
            star.y -= shipVelocity.y * star.parallaxFactor;

            // Wrap stars around screen
            if (star.x < 0) star.x = this.app.screen.width;
            if (star.x > this.app.screen.width) star.x = 0;
            if (star.y < 0) star.y = this.app.screen.height;
            if (star.y > this.app.screen.height) star.y = 0;
        }
    }

    // Remove stars container from stage
    removeStars() {
        if (this.stars && this.stars.parent) {
            this.stars.parent.removeChild(this.stars);
        }
    }

    // Clean up resources
    destroy() {
        this.removeStars();
        // Destroy all star graphics
        for (let star of this.stars.children) {
            star.destroy();
        }
        this.stars.destroy();
        this.stars = null;
    }
}

export default Starfield; 