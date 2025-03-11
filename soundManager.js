

let gSoundManager = null;

function InitSoundManager(config){
    gSoundManager = new SoundManager(config);
}

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
            teleport: 0.3,
            spaceshipExplode: 0.5,
            powerDouble: 0.5,
            powerQuad: 0.5,
            bonusDouble: 0.5,
            catchPower: 0.1,
            throwPower: 0.5,
            impactMetal: 0.1
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
            }),
            spaceshipExplode: new Howl({
                src: ['sounds/spaceship_explode.wav'],
                volume: this.config.spaceshipExplode
            }),
            power_double: new Howl({
                src: ['sounds/power_double.wav'],
                volume: this.config.powerDouble
            }),
            power_quad: new Howl({
                src: ['sounds/power_quad.wav'],
                volume: this.config.powerQuad
            }),
            bonus_double: new Howl({
                src: ['sounds/bonus_double.wav'],
                volume: this.config.bonusDouble
            }),
            catch_power: new Howl({
                src: ['sounds/catch_power.wav'],
                volume: this.config.catchPower
            }),
            // add throw sound
            throw_power: new Howl({
                src: ['sounds/throw_power.wav'],
                volume: this.config.throwPower
            }),
            // add impact_metal sound
            impact_metal: new Howl({
                src: ['sounds/impact_metal.wav'],
                volume: this.config.impactMetal
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

    // Generic play function for simple sounds
    play(soundId) {
        if (this.sounds[soundId]) {
            this.sounds[soundId].play();
        }else{
            console.error('Sound not found:', soundId);
        }
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

    // Explosion sounds based on asteroid size (special case)
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

    // Stop all sounds (useful when game ends)
    stopAll() {
        Object.values(this.sounds).forEach(sound => sound.stop());
        this.isThrustPlaying = false;
    }
}

export default SoundManager; 
export { InitSoundManager, gSoundManager };
