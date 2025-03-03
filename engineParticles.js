class EngineParticles {
    constructor(app) {
        this.app = app;
        this.particles = [];
        this.container = new PIXI.Container();
        this.particleCount = 20;
        
        // CGA palette colors for engine exhaust
        this.colors = [
            0xAA0000,  // Dark Red
            0xFFAA00,  // Yellow
            0xFF5555   // Light Red
        ];
        
        app.stage.addChild(this.container);
    }

    emit(x, y, rotation) {
        // Create new particles at ship's engine position
        for (let i = 0; i < 2; i++) {
            const particle = new PIXI.Graphics();
            const size = Math.random() * 2 + 1;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            particle.beginFill(color);
            particle.drawCircle(0, 0, size);
            particle.endFill();
            
            // Calculate rear position of the ship
            const engineOffsetX = 0;  // Distance from ship's center to its rear
            const engineOffsetY = 15;  // Distance from ship's center to its rear
            const engineSpread = 5;   // Spread of the engine exhaust
            
            // Calculate emission angle (opposite to ship's rotation)
            // add some noise to emmision angle 
            const noise = Math.random() * 0.1;
            const emissionAngle = rotation + Math.PI + noise;


            console.log(emissionAngle);


            const rearX = x;
            const rearY = y;

            particle.x = rearX;
            particle.y = rearY;
            
            // Set particle properties
            particle.life = 1.0;
            
            // Calculate particle velocity (using emission angle)
            const baseSpeed = Math.random() * 2 + 2;
            const spread = (Math.random() - 0.5) * 0.5;  // Spread angle in radians
/*             particle.vx = Math.cos(emissionAngle + spread) * baseSpeed;
            particle.vy = Math.sin(emissionAngle + spread) * baseSpeed;
 */
            particle.vx = Math.sin(emissionAngle) * baseSpeed;
            particle.vy = -Math.cos(emissionAngle) * baseSpeed;


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
            particle.life -= 0.05;  // Decrease life
            particle.alpha = particle.life;  // Fade out based on life
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.container.removeChild(particle);
                this.particles.splice(i, 1);
            }
        }
    }
}

export default EngineParticles; 