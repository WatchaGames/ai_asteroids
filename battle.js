import Asteroid from './asteroid.js';
import Bullet from './bullet.js';
import Bonus from './bonus.js';
import PowerUp from './powerUp.js';

// Battle state
let asteroids = [];
let bullets = [];
let bonuses = [];
let powerUps = [];
let score = 0;
let lives = 3;
let currentWave = 1;
let rearBulletActive = false;
let rearBulletTimer = null;
let quadFireActive = false;
let quadFireTimer = null;
let scoreMultiplier = 1;
let scoreMultiplierTimer = null;

export function getAsteroids() {
    return asteroids;
}

export function getBullets() {
    return bullets;
}

export function getBonuses() {
    return bonuses;
}

export function getPowerUps() {
    return powerUps;
}

export function getScore() {
    return score;
}

export function setScore(newScore) {
    score = newScore;
}

export function getLives() {
    return lives;
}

export function setLives(newLives) {
    lives = newLives;
}

export function getCurrentWave() {
    return currentWave;
}

export function setCurrentWave(wave) {
    currentWave = wave;
}

export function incrementWave() {
    currentWave++;
}

export function getRearBulletActive() {
    return rearBulletActive;
}

export function setRearBulletActive(active) {
    rearBulletActive = active;
}

export function getRearBulletTimer() {
    return rearBulletTimer;
}

export function setRearBulletTimer(timer) {
    rearBulletTimer = timer;
}

export function getQuadFireActive() {
    return quadFireActive;
}

export function setQuadFireActive(active) {
    quadFireActive = active;
}

export function getQuadFireTimer() {
    return quadFireTimer;
}

export function setQuadFireTimer(timer) {
    quadFireTimer = timer;
}

export function stopAllPowerUps() {
    rearBulletActive = false;
    quadFireActive = false;
    if (rearBulletTimer) {
        clearTimeout(rearBulletTimer);
        rearBulletTimer = null;
    }
    if (quadFireTimer) {
        clearTimeout(quadFireTimer);
        quadFireTimer = null;
    }
}

export function startNextWave(app) {
    incrementWave();
    const newAsteroids = spawnAsteroidsForWave(app, getCurrentWave());
    addAsteroids(newAsteroids);
    return getCurrentWave();
}

export function clearAsteroids(app) {
    asteroids.forEach(asteroid => {
        app.stage.removeChild(asteroid.sprite);
    });
    asteroids = [];
}

export function clearBullets(app) {
    bullets.forEach(bullet => {
        app.stage.removeChild(bullet.sprite);
    });
    bullets = [];
}

export function clearBonuses(app) {
    bonuses.forEach(bonus => {
        app.stage.removeChild(bonus.sprite);
    });
    bonuses = [];
}

export function clearPowerUps(app) {
    powerUps.forEach(powerUp => {
        app.stage.removeChild(powerUp.sprite);
    });
    powerUps = [];
}

export function addAsteroids(newAsteroids) {
    asteroids.push(...newAsteroids);
}

export function addBullet(app, x, y, angle) {
    const bullet = new Bullet(app, x, y, angle);
    bullets.push(bullet);
}

export function addBonus(app) {
    const bonus = new Bonus(app);
    bonuses.push(bonus);
}

export function addPowerUp(app, type) {
    const powerUp = new PowerUp(app, type);
    powerUps.push(powerUp);
}

export function destroyAsteroid(app, asteroid, index, explosionParticles, soundManager, scoreMultiplier, scoreText) {
    // Create explosion with size-dependent parameters
    const explosionSize = {
        large: 30,    // Larger explosion for big asteroids
        medium: 20,   // Medium explosion
        small: 10     // Smaller explosion
    };

    // Create the explosion effect with size
    explosionParticles.createExplosion(
        asteroid.sprite.x,
        asteroid.sprite.y,
        asteroid.getColorForSize(),
        explosionSize[asteroid.sizeLevel]
    );

    // Play explosion sound
    soundManager.playExplosion(asteroid.sizeLevel);
    
    // Remove asteroid and update score
    asteroid.destroy();
    asteroids.splice(index, 1);
    
    let points = 0;
    if (asteroid.sizeLevel === 'large') {
        points = 20;
        const newAsteroids = asteroid.split();
        asteroids.push(...newAsteroids);
    } else if (asteroid.sizeLevel === 'medium') {
        points = 50;
        const newAsteroids = asteroid.split();
        asteroids.push(...newAsteroids);
    } else if (asteroid.sizeLevel === 'small') {
        points = 100;
    }
    
    // Apply score multiplier
    score += (points * scoreMultiplier);
    scoreText.text = 'Score: ' + score;
    return score;
}

export function checkPlayerCollisions(app, player, gameOver, soundManager, explosionParticles, showGameOver) {
    if (gameOver) return { lives, gameOver };
    
    for (let asteroid of asteroids) {
        const dx = player.sprite.x - asteroid.sprite.x;
        const dy = player.sprite.y - asteroid.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + asteroid.radius) {
            lives--;
            if (lives <= 0) {
                soundManager.stopAll();
                soundManager.play('spaceshipExplode');
                soundManager.play('gameOver');
                // Create cyan explosion at ship's position
                explosionParticles.createExplosion(player.sprite.x, player.sprite.y, 0x55FFFF);
                
                // Show game over screen
                showGameOver(app, score);
                return { lives, gameOver: true };
            } else {
                // Create cyan explosion at ship's position before respawning
                explosionParticles.createExplosion(player.sprite.x, player.sprite.y, 0x55FFFF);
                soundManager.play('spaceshipExplode');
                player.sprite.x = app.screen.width / 2;
                player.sprite.y = app.screen.height / 2;
                player.velocity = { x: 0, y: 0 };
                return { lives, gameOver: false };
            }
        }
    }
    return { lives, gameOver };
}

export function checkPowerUpCollisions(app, player, soundManager) {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        const dx = player.sprite.x - powerUp.sprite.x;
        const dy = player.sprite.y - powerUp.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + powerUp.radius) { // Use power-up's radius
            // Handle power-up collection
            switch(powerUp.type) {
                case 'rearBullet':
                    // Clear any existing timer
                    if (rearBulletTimer) {
                        clearTimeout(rearBulletTimer);
                    }
                    // Activate rear bullet power-up
                    rearBulletActive = true;
                    // Set timer to deactivate after 10 seconds
                    rearBulletTimer = setTimeout(() => {
                        rearBulletActive = false;
                    }, 10000);
                    // Play rear bullet power-up sound
                    soundManager.play('power_double');
                    break;
                case 'quadFire':
                    // Clear any existing timer
                    if (quadFireTimer) {
                        clearTimeout(quadFireTimer);
                    }
                    // Activate quad fire power-up
                    quadFireActive = true;
                    // Set timer to deactivate after 10 seconds
                    quadFireTimer = setTimeout(() => {
                        quadFireActive = false;
                    }, 10000);
                    // Play quad fire power-up sound
                    soundManager.play('power_quad');
                    break;
            }
            
            // Remove power-up
            powerUp.destroy();
            powerUps.splice(i, 1);
        }
    }
}

export function destroyAllGameObjects(app) {
    // Remove all game objects from the PIXI stage
    clearAsteroids(app);
    clearBullets(app);
    clearBonuses(app);
    clearPowerUps(app);
    score = 0; // Reset score
    lives = 3; // Reset lives
}

export function spawnAsteroidsForWave(app, waveIndex) {
    const numAsteroids = 5 + waveIndex  * 2; // Increase difficulty
    console.log(`spawnAsteroidsForWave:${waveIndex} with:${numAsteroids}`);
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;
    const minDistanceFromCenter = Math.min(app.screen.width, app.screen.height) * 0.33; // 33% of screen size

    const asteroids = [];
    for (let i = 0; i < numAsteroids; i++) {
        let asteroid;
        let validPosition = false;
        
        // Keep trying until we find a valid position
        while (!validPosition) {
            asteroid = new Asteroid(app, 30, 'large');
            const dx = asteroid.sprite.x - centerX;
            const dy = asteroid.sprite.y - centerY;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
            
            if (distanceFromCenter >= minDistanceFromCenter) {
                validPosition = true;
            } else {
                // Remove the asteroid if position is invalid
                app.stage.removeChild(asteroid.sprite);
            }
        }
        
        asteroids.push(asteroid);
    }
    return asteroids;
}

export function checkBonusCollisions(app, soundManager, scoreMultiplier, scoreMultiplierTimer, multiplierText, bonusText) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = bonuses.length - 1; j >= 0; j--) {
            const bonus = bonuses[j];
            const dx = bullet.sprite.x - bonus.sprite.x;
            const dy = bullet.sprite.y - bonus.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 15) { // Collision radius for bonus
                // Remove bullet and bonus without adding points
                app.stage.removeChild(bullet.sprite);
                bullets.splice(i, 1);
                
                // Store bonus position before destroying
                const startX = bonus.sprite.x;
                const startY = bonus.sprite.y;
                const targetX = 10; // Score text X position
                const targetY = 10; // Score text Y position
                bonus.destroy();
                bonuses.splice(j, 1);
                
                // Clear any existing multiplier timer
                if (scoreMultiplierTimer) {
                    clearTimeout(scoreMultiplierTimer);
                }
                
                // Activate score multiplier
                scoreMultiplier = 2;
                multiplierText.text = 'Score x2!';
                multiplierText.visible = true;
                
                // Set timer to deactivate after 10 seconds
                scoreMultiplierTimer = setTimeout(() => {
                    multiplierText.visible = false;
                }, 10000);
                
                // Play bonus sound
                soundManager.play('bonus_double');
                
                // Show bonus text at bonus location
                bonusText.text = 'x2!';
                bonusText.x = startX;
                bonusText.y = startY;
                bonusText.visible = true;
                bonusText.alpha = 1;
                
                // Animate text flying to score
                let startTime = Date.now();
                const flyToScore = () => {
                    const elapsed = Date.now() - startTime;
                    if (elapsed < 1000) { // Animation duration increased to 1 second
                        // Calculate progress (0 to 1)
                        const progress = elapsed / 1000;
                        // Move position
                        bonusText.x = startX + (targetX - startX) * progress;
                        bonusText.y = startY + (targetY - startY) * progress;
                        // Fade out
                        bonusText.alpha = 1 - progress;
                        requestAnimationFrame(flyToScore);
                    } else {
                        bonusText.visible = false;
                    }
                };
                flyToScore();
                
            }
        }
    }
}

export function checkCollisions(app, explosionParticles, soundManager, scoreMultiplier, scoreText) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = asteroids.length - 1; j >= 0; j--) {
            const asteroid = asteroids[j];
            const dx = bullet.sprite.x - asteroid.sprite.x;
            const dy = bullet.sprite.y - asteroid.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullet.radius + asteroid.radius) {
                app.stage.removeChild(bullet.sprite);
                bullets.splice(i, 1);
                score = destroyAsteroid(app, asteroid, j, explosionParticles, soundManager, scoreMultiplier, scoreText);
                break; // Bullet can only hit one asteroid
            }
        }
    }
    return score;
}

export function updateAsteroids() {
    asteroids.forEach(asteroid => asteroid.update());
}

export function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].update()) {
            bullets.splice(i, 1);
        }
    }
}

export function updateBonuses() {
    for (let i = bonuses.length - 1; i >= 0; i--) {
        if (bonuses[i].update()) {
            bonuses.splice(i, 1);
        }
    }
}

export function updatePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        if (powerUps[i].update()) {
            powerUps.splice(i, 1);
        }
    }
}

export function getScoreMultiplier() {
    return scoreMultiplier;
}

export function setScoreMultiplier(multiplier) {
    scoreMultiplier = multiplier;
}

export function getScoreMultiplierTimer() {
    return scoreMultiplierTimer;
}

export function setScoreMultiplierTimer(timer) {
    scoreMultiplierTimer = timer;
}

export function clearScoreMultiplier() {
    scoreMultiplier = 1;
    if (scoreMultiplierTimer) {
        clearTimeout(scoreMultiplierTimer);
        scoreMultiplierTimer = null;
    }
}
