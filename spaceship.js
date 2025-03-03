class Spaceship {
    constructor(app) {
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0x55FFFF); // Light Cyan
        this.sprite.moveTo(0, -10);
        this.sprite.lineTo(5, 5);
        this.sprite.lineTo(-5, 5);
        this.sprite.lineTo(0, -10);
        this.sprite.endFill();
        this.sprite.x = app.screen.width / 2;
        this.sprite.y = app.screen.height / 2;
        this.sprite.rotation = 0;
        this.velocity = { x: 0, y: 0 };
        this.speed = 0.1;
        this.rotationSpeed = 0.05;
        this.isMovingForward = false;
        this.isRotatingLeft = false;
        this.isRotatingRight = false;
        this.radius = 10; // For collision detection
        this.app = app;
        app.stage.addChild(this.sprite);
    }

    update() {
        if (this.isRotatingLeft) {
            this.sprite.rotation -= this.rotationSpeed;
        }
        if (this.isRotatingRight) {
            this.sprite.rotation += this.rotationSpeed;
        }
        if (this.isMovingForward) {
            this.velocity.x += Math.sin(this.sprite.rotation) * this.speed;
            this.velocity.y -= Math.cos(this.sprite.rotation) * this.speed;
        }
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        // Screen wrapping
        if (this.sprite.x < 0) this.sprite.x = this.app.screen.width;
        if (this.sprite.x > this.app.screen.width) this.sprite.x = 0;
        if (this.sprite.y < 0) this.sprite.y = this.app.screen.height;
        if (this.sprite.y > this.app.screen.height) this.sprite.y = 0;
    }

    teleport(x, y) {
        // Create a quick flash effect
        const flash = new PIXI.Graphics();
        flash.beginFill(0xFFFFFF);
        flash.drawCircle(this.sprite.x, this.sprite.y, this.radius * 2);
        flash.endFill();
        this.app.stage.addChild(flash);

        // Set new position
        this.sprite.x = x;
        this.sprite.y = y;
        
        // Velocity is maintained (removed velocity reset)

        // Create arrival flash effect
        const arrivalFlash = new PIXI.Graphics();
        arrivalFlash.beginFill(0xFFFFFF);
        arrivalFlash.drawCircle(x, y, this.radius * 2);
        arrivalFlash.endFill();
        this.app.stage.addChild(arrivalFlash);

        // Fade out and remove both flash effects
        const fadeOut = (flash) => {
            let alpha = 1;
            const fade = () => {
                alpha -= 0.1;
                flash.alpha = alpha;
                
                if (alpha <= 0) {
                    this.app.stage.removeChild(flash);
                } else {
                    requestAnimationFrame(fade);
                }
            };
            fade();
        };

        fadeOut(flash);
        fadeOut(arrivalFlash);
    }
}

export default Spaceship; 