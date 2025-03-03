class SoundManager {
    constructor(config) {
        // Use provided config or default values
        this.config = config || {
            thrust: 0.5,
            shoot: 0.3,
            explosionLarge: 0.4,
            explosionMedium: 0.4,
            explosionSmall: 0.4,
            gameOver: 0.6,
            teleport: 0.3
        };

        // Initialize all game sounds
        this.sounds = {
            thrust: new Howl({
                src: ['sounds/thrust.wav'],
                volume: this.config.thrust,
                loop: true
            }),
            shoot: new Howl({
                src: ['sounds/shoot.wav'],
                volume: this.config.shoot
            }),
            explosionLarge: new Howl({
                src: ['sounds/explosion_large.wav'],
                volume: this.config.explosionLarge
            }),
            explosionMedium: new Howl({
                src: ['sounds/explosion_medium.wav'],
                volume: this.config.explosionMedium
            }),
            explosionSmall: new Howl({
                src: ['sounds/explosion_small.wav'],
                volume: this.config.explosionSmall
            }),
            gameOver: new Howl({
                src: ['sounds/game_over.wav'],
                volume: this.config.gameOver
            }),
            teleport: new Howl({
                src: ['sounds/teleport.wav'],
                volume: this.config.teleport
            })
        };

        this.isThrustPlaying = false;
    }

    // Update volumes (can be called to change volumes during gameplay)
    updateVolumes(newConfig) {
        this.config = { ...this.config, ...newConfig };
        Object.keys(this.sounds).forEach(key => {
            this.sounds[key].volume(this.config[key]);
        });
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
            this.sounds.thrust.fade(this.config.thrust, 0, 200);
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

    // Teleport sound
    playTeleport() {
        this.sounds.teleport.play();
    }

    // Stop all sounds (useful when game ends)
    stopAll() {
        Object.values(this.sounds).forEach(sound => sound.stop());
        this.isThrustPlaying = false;
    }
}

export default SoundManager; 