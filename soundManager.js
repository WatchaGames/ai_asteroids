class SoundManager {
    constructor() {
        // Initialize all game sounds
        this.sounds = {
            thrust: new Howl({
                src: ['sounds/thrust.wav'],
                volume: 0.5,
                loop: true
            }),
            shoot: new Howl({
                src: ['sounds/shoot.wav'],
                volume: 0.3
            }),
            explosionLarge: new Howl({
                src: ['sounds/explosion_large.wav'],
                volume: 0.4
            }),
            explosionMedium: new Howl({
                src: ['sounds/explosion_medium.wav'],
                volume: 0.4
            }),
            explosionSmall: new Howl({
                src: ['sounds/explosion_small.wav'],
                volume: 0.4
            }),
            gameOver: new Howl({
                src: ['sounds/game_over.wav'],
                volume: 0.6
            })
        };

        this.isThrustPlaying = false;
    }

    // Engine sound methods
    startThrust() {
        if (!this.isThrustPlaying) {
            this.sounds.thrust.play();
            this.isThrustPlaying = true;
        }
    }

    stopThrust() {
        if (this.isThrustPlaying) {
            this.sounds.thrust.fade(0.5, 0, 200);
            this.isThrustPlaying = false;
        }
    }

    // Weapon sound
    playShoot() {
        this.sounds.shoot.play();
    }

    // Explosion sounds based on asteroid size
    playExplosion(asteroidSize) {
        switch (asteroidSize) {
            case 'large':
                this.sounds.explosionLarge.play();
                break;
            case 'medium':
                this.sounds.explosionMedium.play();
                break;
            case 'small':
                this.sounds.explosionSmall.play();
                break;
        }
    }

    // Game over sound
    playGameOver() {
        this.sounds.gameOver.play();
    }

    // Stop all sounds (useful when game ends)
    stopAll() {
        Object.values(this.sounds).forEach(sound => sound.stop());
        this.isThrustPlaying = false;
    }
}

export default SoundManager; 