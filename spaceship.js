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
}

export default Spaceship; 