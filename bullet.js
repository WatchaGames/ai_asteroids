import { getScreenWidth, getScreenHeight, getAppStage } from "./globals.js";

class Bullet {
    constructor(x, y, rotation) {
        this.sprite = new PIXI.Graphics();
        this.sprite.beginFill(0xFFFFFF);
        this.sprite.drawCircle(0, 0, 2);
        this.sprite.endFill();
        this.sprite.x = x;
        this.sprite.y = y;
        this.velocity = {
            x: Math.sin(rotation) * 5,
            y: -Math.cos(rotation) * 5
        };
        this.radius = 2;
        let stage = getAppStage();
        stage.addChild(this.sprite);
    }

    update() {
        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        // Remove bullet if off screen
        if (this.sprite.x < 0 || this.sprite.x > getScreenWidth()  ||
            this.sprite.y < 0 || this.sprite.y > getScreenHeight()) {
                let stage = getAppStage();
                stage.removeChild(this.sprite);
            return true;
        }
        return false;
    }
}

// Export the Bullet class
export default Bullet; 