let gSoundManager = null;

function InitSoundManager(config){
    gSoundManager = new SoundManager(config);
}

class SoundManager {
    constructor() {
        // Use provided config or default values
        this.config =  {
            thrust: 0.1,
            shoot: 0.3,
            explosionLarge: 0.4,
            explosionMedium: 0.4,
            explosionSmall: 0.4,
            gameOver: 0.6,
            teleport: 0.3,
            spaceshipExplode: 0.5,
            power_double: 0.5,
            power_quad: 0.5,
            bonus_double: 0.5,
            catch_power: 0.5,
            throw_power: 0.5,
            impact_metal: 0.1
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
                volume: this.config.power_double
            }),
            power_quad: new Howl({
                src: ['sounds/power_quad.wav'],
                volume: this.config.power_quad
            }),
            bonus_double: new Howl({
                src: ['sounds/bonus_double.wav'],
                volume: this.config.bonus_double
            }),
            catch_power: new Howl({
                src: ['sounds/catch_power.wav'],
                volume: this.config.catch_power
            }),
            throw_power: new Howl({
                src: ['sounds/throw_power.wav'],
                volume: this.config.throw_power
            }),
            impact_metal: new Howl({
                src: ['sounds/impact_metal.wav'],
                volume: this.config.impact_metal
            })
        };

        this.isThrustPlaying = false;
    }

    // Update volumes (can be called to change volumes during gameplay)
    updateVolumes(newConfig) {
        this.config = { ...this.config, ...newConfig };
        Object.keys(this.sounds).forEach(key => {
            if (this.sounds[key]) {
                this.sounds[key].volume(this.config[key] || 0);
            }
        });
    }

    // Generic play function for simple sounds
    play(soundId) {
        if (this.sounds[soundId]) {
            const sound = this.sounds[soundId];
            sound.volume(this.config[soundId] || 0);
            sound.play();
        } else {
            console.error('Sound not found:', soundId);
        }
    }

    // Engine sound methods
    startThrust() {
        if (!this.isThrustPlaying) {
            this.sounds.thrust.volume(this.config.thrust);
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
        const soundKey = 'explosion' + asteroidSize.charAt(0).toUpperCase() + asteroidSize.slice(1);
        if (this.sounds[soundKey]) {
            this.sounds[soundKey].volume(this.config[soundKey]);
            this.sounds[soundKey].play();
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
