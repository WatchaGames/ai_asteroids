import { palette10 } from './palette.js';
import { addBullet, getQuadFireActive, getRearBulletActive } from './battle_screen.js';
import EngineParticles from './engineParticles.js';

class Spaceship {
    constructor(app) {
        this.app = app;
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(palette10.white);
        this.sprite.moveTo(0, -10);
        this.sprite.lineTo(5, 5);
        this.sprite.lineTo(-5, 5);
        this.sprite.lineTo(0, -10);
        this.sprite.endFill();
        
        this.sprite.x = app.screen.width / 2;
        this.sprite.y = app.screen.height / 2;
        
        this.velocity = { x: 0, y: 0 };
        this.rotationSpeed = 0.05;
        this.thrust = 0.25;
        this.maxSpeed = 5;
        this.radius = 10; // For collision detection
        
        this.isRotatingLeft = false;
        this.isRotatingRight = false;
        this.isMovingForward = false;
        
        // Teleportation states
        this.isDisappearing = false;
        this.isDisappeared = false;
        this.isAppearing = false;
        this.teleportStartTime = 0;
        this.teleportTargetX = 0;
        this.teleportTargetY = 0;

        // Initialize engine particles
        this.engineParticles = new EngineParticles(app);
        
        app.stage.addChild(this.sprite);
    }

    teleport(newX, newY) {
        // Start teleportation sequence
        this.isDisappearing = true;
        this.isDisappeared = false;
        this.isAppearing = false;
        this.teleportStartTime = Date.now();
        this.teleportTargetX = newX;
        this.teleportTargetY = newY;
        
        // Store original position for fade out
        this.originalX = this.sprite.x;
        this.originalY = this.sprite.y;
        
        // Reset velocity
        this.velocity = { x: 0, y: 0 };
    }

    tryTeleport(app, soundManager) {
        if (!this.isTeleporting) {
            // Get random position within screen bounds (with padding)
            const padding = 50;  // Keep away from edges
            const newX = padding + Math.random() * (app.screen.width - 2 * padding);
            const newY = padding + Math.random() * (app.screen.height - 2 * padding);
            this.teleport(newX, newY);
            soundManager.play('teleport');
        }
    }

    resetLocation() {
        this.sprite.x = this.app.screen.width / 2;
        this.sprite.y = this.app.screen.height / 2;
        this.velocity = { x: 0, y: 0 };
        this.sprite.rotation = 0;
    }

    actionFire(soundManager) {
        if (getQuadFireActive()) {
            // Shoot in all four directions
            const angles = [
                this.sprite.rotation,           // Forward
                this.sprite.rotation + Math.PI, // Backward
                this.sprite.rotation + Math.PI/2, // Right
                this.sprite.rotation - Math.PI/2  // Left
            ];
            
            angles.forEach(angle => {
                addBullet(this.app, this.sprite.x, this.sprite.y, angle);
            });
            soundManager.play('shoot');
        } else if (getRearBulletActive()) {
            // Shoot forward and backward
            addBullet(this.app, this.sprite.x, this.sprite.y, this.sprite.rotation);
            addBullet(this.app, this.sprite.x, this.sprite.y, this.sprite.rotation + Math.PI);
            soundManager.play('shoot');
        } else {
            // Normal forward shot
            addBullet(this.app, this.sprite.x, this.sprite.y, this.sprite.rotation);
            soundManager.play('shoot');
        }
    }
    update() {
        // Handle teleportation states
        if (this.isDisappearing || this.isDisappeared || this.isAppearing) {
            const currentTime = Date.now();
            const elapsed = currentTime - this.teleportStartTime;
            
            if (this.isDisappearing) {
                // Fade out over 200ms
                const fadeOutProgress = Math.min(elapsed / 200, 1);
                this.sprite.alpha = 1 - fadeOutProgress;
                
                // Transition to disappeared state
                if (fadeOutProgress >= 1) {
                    this.isDisappearing = false;
                    this.isDisappeared = true;
                    this.sprite.alpha = 0;
                }
            }
            else if (this.isDisappeared) {
                // Stay invisible for 1000ms
                if (elapsed >= 1200) {  // 200ms fade out + 1000ms invisible
                    this.isDisappeared = false;
                    this.isAppearing = true;
                    // Move to new position
                    this.sprite.x = this.teleportTargetX;
                    this.sprite.y = this.teleportTargetY;
                }
            }
            else if (this.isAppearing) {
                // Fade in over 200ms
                const fadeInProgress = Math.min((elapsed - 1200) / 200, 1);
                this.sprite.alpha = fadeInProgress;
                
                // Complete teleportation
                if (fadeInProgress >= 1) {
                    this.isAppearing = false;
                    this.sprite.alpha = 1;
                }
            }
            return;
        }

        // Normal movement update
        if (this.isRotatingLeft) {
            this.sprite.rotation -= this.rotationSpeed;
        }
        if (this.isRotatingRight) {
            this.sprite.rotation += this.rotationSpeed;
        }
        
        if (this.isMovingForward) {
            const angle = this.sprite.rotation;
            this.velocity.x += Math.sin(angle) * this.thrust;
            this.velocity.y -= Math.cos(angle) * this.thrust;
            
            // Limit speed
            const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > this.maxSpeed) {
                this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
                this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
            }

            // Emit engine particles
            this.engineParticles.emit(this.sprite.x, this.sprite.y, this.sprite.rotation);
        }
        
        // Update position
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;
        
        // Screen wrapping
        if (this.sprite.x < 0) this.sprite.x = this.app.screen.width;
        if (this.sprite.x > this.app.screen.width) this.sprite.x = 0;
        if (this.sprite.y < 0) this.sprite.y = this.app.screen.height;
        if (this.sprite.y > this.app.screen.height) this.sprite.y = 0;

        // Update engine particles
        this.engineParticles.update();
    }

    // Helper method to check if ship is in any teleportation state
    get isTeleporting() {
        return this.isDisappearing || this.isDisappeared || this.isAppearing;
    }

    destroy() {
        // Remove sprite from stage
        if (this.sprite && this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }

        // Destroy engine particles
        if (this.engineParticles) {
            this.engineParticles.destroy();
        }

        // Destroy sprite
        this.sprite.destroy();

        // Clear references
        this.engineParticles = null;
        this.sprite = null;
    }
}

export default Spaceship; 