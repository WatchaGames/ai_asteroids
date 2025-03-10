import { getAppStage } from "./globals.js";

class ExplosionParticles {
    constructor() {
        this.particles = [];
        this.container = new PIXI.Container();
        let stage = getAppStage();
        stage.addChild(this.container);
    }

    createExplosion(x, y, color = 0xFFFFFF, size = 20) {  // Added size parameter
        const particleCount = Math.floor(size * 0.8);  // Scale particle count with size
        const baseSpeed = size * 0.1;  // Scale speed with size
        const sizeRange = [size * 0.05, size * 0.15];  // Scale particle size with explosion size

        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            const particleSize = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
            
            // Create colored dot
            particle.beginFill(color);
            particle.drawCircle(0, 0, particleSize);
            particle.endFill();
            
            // Set initial position
            particle.x = x;
            particle.y = y;
            
            // Random angle for particle direction
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            
            // Random speed variation
            const speed = baseSpeed + Math.random() * (baseSpeed * 0.5);
            
            // Set velocity
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            
            // Set lifetime (scaled with size)
            particle.life = 1.0 + (size * 0.01);  // Larger explosions last slightly longer
            
            this.particles.push(particle);
            this.container.addChild(particle);
        }
    }

    update() {
        // Update and remove dead particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update lifetime and alpha
            particle.life -= 0.02;  // Slower fade out
            particle.alpha = particle.life;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.container.removeChild(particle);
                this.particles.splice(i, 1);
            }
        }
    }

    destroy() {
        // Remove container from stage
        if (this.container && this.container.parent) {
            this.container.parent.removeChild(this.container);
        }

        // Destroy all particles
        for (let particle of this.particles) {
            particle.destroy();
        }

        // Destroy container
        this.container.destroy();

        // Clear references
        this.particles = [];
        this.container = null;
    }
}

export default ExplosionParticles; 