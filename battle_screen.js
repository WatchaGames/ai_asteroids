
const DEBUG_BATTLE = false;

import Asteroid from './asteroid.js';
import Bullet from './bullet.js';
import Bonus from './bonus.js';
import PowerUp from './powerUp.js';
import { gSoundManager } from './soundManager.js';
import Starfield from './starfield.js';
import ExplosionParticles from './explosionParticles.js';
import Spaceship from './spaceship.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { getAppStage, getCurrentSectorIndex, getCurrentMissionNumber, STATE_GAME_OVER, STATE_SECTOR_SELECT, getScreenWidth, getScreenHeight } from './globals.js';
import { removeOneLife, 
    getMultiplier, 
    addScore, 
    clearScoreMultiplier, 
    setNewScoreMultiplier, 
    addPowerUpToCargoStack,
    getAndRemovePowerUpFromTopOfStack,
    throwPowerUpPlayerAndDestroyAtArrival
    } from './inventory_ui.js';

import { getMainFontStyleNormal } from './fonts.js';
// Battle objects
let gPlayer = null;
let gStarfield = null;
let gExplosionParticles = null;

// Battle state
let asteroids = [];
let bullets = [];
let flyingBonuses = [];
let flyingPowerUps = [];
 
let rearBulletActive = false;
let rearBulletTimer = null;
let quadFireActive = false;
let quadFireTimer = null;

// Wave UI
let waveText = null;

// Game state for bonus and power-up spawning
let lastBonusSpawn = 0;
let lastPowerUpSpawn = 0;
const BONUS_SPAWN_INTERVAL = 10000; // Spawn bonus every 10 seconds
const POWER_UP_SPAWN_INTERVAL = 15000; // Spawn power-up every 15 seconds

// Debug state
let gDebugMode = false;
let gDebugText = null;

export function addBattleObjects() {
    // Create player
    gPlayer = new Spaceship();
    
    // Create starfield
    gStarfield = new Starfield();
    
    // Create explosion particles system
    gExplosionParticles = new ExplosionParticles();
    
}

export function removeBattleObjects() {
    
    // Remove all game objects
    destroyAllGameObjects();
}


export function updateWaveInfo() {
    updateWaveUI(getCurrentSectorIndex());
}


export function getAsteroids() {
    return asteroids;
}

export function getBullets() {
    return bullets;
}

export function getBonuses() {
    return flyingBonuses;
}

export function getPowerUps() {
    return flyingPowerUps;
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

export function startSectorWave() {

    removeWaveUI();
    addWaveUI();
    updateWaveUI(getCurrentSectorIndex());

    const newAsteroids = spawnAsteroidsForWave(getCurrentSectorIndex());
    addAsteroids(newAsteroids);
    return getCurrentSectorIndex();
}

export function destroyAsteroids() {
    let stage = getAppStage();
    asteroids.forEach(asteroid => {
        stage.removeChild(asteroid.sprite);
    });
    asteroids = [];
}

export function destroyBullets() {
    let stage = getAppStage();
    bullets.forEach(bullet => {
        stage.removeChild(bullet.sprite);
    });
    bullets = [];
}

export function destroyBonuses() {
    let stage = getAppStage();
    flyingBonuses.forEach(bonus => {
        stage.removeChild(bonus.sprite);
    });
    flyingBonuses = [];
}

export function destroyPowerUps() {
    let stage = getAppStage();
    flyingPowerUps.forEach(powerUp => {
        stage.removeChild(powerUp.sprite);
    });
    flyingPowerUps = [];
}

export function addAsteroids(newAsteroids) {
    asteroids.push(...newAsteroids);
}

export function addBullet(x, y, angle) {
    const bullet = new Bullet(x, y, angle);
    bullets.push(bullet);
}

export function addScoreBonusObject() {
    const bonus = new Bonus();
    flyingBonuses.push(bonus);
}

export function addPowerUpObject(type,posX,posY) {
    const powerUp = new PowerUp(type,posX,posY);
    flyingPowerUps.push(powerUp);
}

// return the score to add
export function hitAsteroid(asteroid, index, explosionParticles) {
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
        explosionSize[asteroid.sizeName]
    );

    // Play explosion sound
    if (gSoundManager) {
        gSoundManager.playExplosion(asteroid.sizeName);
    }
    
    // Remove asteroid and update score
    
    let points = 0;
    if (asteroid.sizeName === 'large') {
        points = 20;
        const newAsteroids = asteroid.split();
        asteroids.push(...newAsteroids);
        CheckForChanceToDropPowerUpLoot(asteroid.sprite.x,asteroid.sprite.y);
        
    } else if (asteroid.sizeName === 'medium') {
        points = 50;
        const newAsteroids = asteroid.split();
        asteroids.push(...newAsteroids);
    } else if (asteroid.sizeName === 'small') {
        points = 100;
    }
    asteroid.destroy();
    asteroids.splice(index, 1);
    
    // Apply score multiplier
    const scoreToAdd = (points * getMultiplier());
    return scoreToAdd;
}

function CheckForChanceToDropPowerUpLoot(posX,posY) {
    const sectorDescription = GetSectorDescriptionByIndex(getCurrentSectorIndex());
    const chanceToDropPowerUp = sectorDescription.bonuses;
    if (Math.random() < chanceToDropPowerUp) {
        addRandomPowerUpObject(posX,posY);
    }
}

// return true if player is dead
export function checkPlayerCollisions(player, explosionParticles) {
    
    let indexOfAsteroidHit = 0;
    for (let asteroid of asteroids) {
        const dx = player.sprite.x - asteroid.sprite.x;
        const dy = player.sprite.y - asteroid.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + asteroid.radius) {
            const livesLeft = removeOneLife();
            if (livesLeft <= 0) {
                if (gSoundManager) {
                    gSoundManager.stopAll();
                    gSoundManager.play('spaceshipExplode');
                    gSoundManager.play('gameOver');
                }
                // Create cyan explosion at ship's position
                explosionParticles.createExplosion(player.sprite.x, player.sprite.y, 0x55FFFF);
                
                return true;
            } else {
                // Create cyan explosion at ship's position before respawning
                explosionParticles.createExplosion(player.sprite.x, player.sprite.y, 0x55FFFF);
                if (gSoundManager) {
                    gSoundManager.play('spaceshipExplode');
                }
                player.sprite.x = getScreenWidth()/ 2;
                player.sprite.y = getScreenHeight() / 2;
                player.velocity = { x: 0, y: 0 };

                // Also hit the asteroid like a bullet hit it
                hitAsteroid(asteroid, indexOfAsteroidHit, explosionParticles);
                return false;
            }
        }
        indexOfAsteroidHit++;
    }
    return false;
}



export function checkPowerUpCollisions(player) {
    let stage = getAppStage();
    for (let i = flyingPowerUps.length - 1; i >= 0; i--) {
        const powerUp = flyingPowerUps[i];
        const dx = player.sprite.x - powerUp.sprite.x;
        const dy = player.sprite.y - powerUp.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + powerUp.radius) { // Use power-up's radius
            // remove the pooweUp from the container (stage)
            stage.removeChild(powerUp.sprite);
            if (gSoundManager) {
                gSoundManager.play('catch_power');
            }
            // done le a l'inventaire
            addPowerUpToCargoStack(powerUp);
            // Remove power-up
//            powerUp.destroy();
            flyingPowerUps.splice(i, 1);
        }
    }
}

export function destroyAllGameObjects() {
    destroyAsteroids();
    destroyBullets();
    destroyBonuses();
    destroyPowerUps();
}

export function spawnAsteroidsForWave(sectorIndex) {
    const sectorDescription = GetSectorDescriptionByIndex(sectorIndex);
    const numAsteroids = sectorDescription ? sectorDescription.nbAsteroids : 5; // Default to 5 if sector not found
    console.log(`spawnAsteroidsForWave:${sectorIndex} with:${numAsteroids} asteroids`);
    
    const centerX = getScreenWidth() / 2;
    const centerY = getScreenHeight() / 2;
    const minDistanceFromCenter = Math.min(getScreenWidth(), getScreenHeight()) * 0.33; // 33% of screen size
    
    const newAsteroids = [];
    for (let i = 0; i < numAsteroids; i++) {
        let asteroid;
        let validPosition = false;
        
        // Keep trying until we find a valid position
        while (!validPosition) {
            asteroid = new Asteroid(sectorDescription, 'large');
            const dx = asteroid.sprite.x - centerX;
            const dy = asteroid.sprite.y - centerY;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
            
            if (distanceFromCenter >= minDistanceFromCenter) {
                validPosition = true;
            } else {
                // Remove the asteroid if position is invalid
                let stage = getAppStage();
                stage.removeChild(asteroid.sprite);
            }
        }
        
        newAsteroids.push(asteroid);
    }
    return newAsteroids;
}

export function checkScorMultipliersCollisions() {
    let stage = getAppStage();
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = flyingBonuses.length - 1; j >= 0; j--) {
            const bonus = flyingBonuses[j];
            const dx = bullet.sprite.x - bonus.sprite.x;
            const dy = bullet.sprite.y - bonus.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 15) { // Collision radius for bonus
                // Remove bullet and bonus without adding points
                stage.removeChild(bullet.sprite);
                bullets.splice(i, 1);
                
                // Store bonus position before destroying
                const startX = bonus.sprite.x;
                const startY = bonus.sprite.y;
                const targetX = 10; // Score text X position
                const targetY = 10; // Score text Y position
                bonus.destroy();
                flyingBonuses.splice(j, 1);
                
                // Clear any existing multiplier timer
                clearScoreMultiplier();
                
                // Activate score multiplier
                setNewScoreMultiplier(2);
                
                // Play bonus sound
                if (gSoundManager) {
                    gSoundManager.play('bonus_double');
                }
                
                // Show bonus text at bonus location
                setNewScoreMultiplier(2);
                
            }
        }
    }
}

export function checkCollisionsBetweenBulletsAndAsteroids(explosionParticles) {
    let scoreToAdd = 0;
    let stage = getAppStage();
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = asteroids.length - 1; j >= 0; j--) {
            const asteroid = asteroids[j];
            const dx = bullet.sprite.x - asteroid.sprite.x;
            const dy = bullet.sprite.y - asteroid.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < bullet.radius + asteroid.radius) {
                stage.removeChild(bullet.sprite);
                bullets.splice(i, 1);
                scoreToAdd += hitAsteroid(asteroid, j, explosionParticles);
                break; // Bullet can only hit one asteroid
            }
        }
    }
    return scoreToAdd;
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
    for (let i = flyingBonuses.length - 1; i >= 0; i--) {
        if (flyingBonuses[i].update()) {
            flyingBonuses.splice(i, 1);
        }
    }
}

export function updatePowerUps() {
    for (let i = flyingPowerUps.length - 1; i >= 0; i--) {
        if (flyingPowerUps[i].update()) {
            flyingPowerUps.splice(i, 1);
        }
    }
}



export function checkForNewBonusesAndPowerUpsOverTime() {
    const currentTime = Date.now();
    if (currentTime - lastBonusSpawn > BONUS_SPAWN_INTERVAL) {
        addScoreBonusObject();
        lastBonusSpawn = currentTime;
    }
    
    if (currentTime - lastPowerUpSpawn > POWER_UP_SPAWN_INTERVAL) {
        addRandomPowerUpObject();
        lastPowerUpSpawn = currentTime;
    }
}

function addRandomPowerUpObject(posX,posY) {
    const powerUpType = Math.random() < 0.5 ? 'rearBullet' : 'quadFire';
    if(DEBUG_BATTLE)console.log('Spawning power-up:', powerUpType); // Debug log
    addPowerUpObject(powerUpType,posX,posY);
}   

export function updateDebugText() {
    if (gDebugMode && gDebugText && gPlayer) {
        const rotationDegrees = (gPlayer.sprite.rotation * 180 / Math.PI).toFixed(1);
        const posX = gPlayer.sprite.x.toFixed(1);
        const posY = gPlayer.sprite.y.toFixed(1);
        gDebugText.text = `Rotation: ${rotationDegrees}°\nPosition: (${posX}, ${posY})`;
    }
}

export function startBattleInCurrentSelectedSector() {
    // Clear any existing game elements
//    let app = getPixiApp();
    destroyAllGameObjects();

    // Destroy any existing battle objects
    if (gStarfield) {
        gStarfield.destroy();
        gStarfield = null;
    }
    if (gExplosionParticles) {
        gExplosionParticles.destroy();
        gExplosionParticles = null;
    }
    if (gPlayer) {
        gPlayer.destroy();
        gPlayer = null;
    }

    // Create starfield before other game objects
    gStarfield = new Starfield();
    gExplosionParticles = new ExplosionParticles();

    // Game State Variables
    gPlayer = new Spaceship();
    gPlayer.sprite.visible = false; // Hide player initially
    

    // Show player
    gPlayer.sprite.visible = true;
    
    // Reset game state
    stopAllPowerUps();
    
    // Reset player position
    gPlayer.resetLocation();

    // Start first wave
    startSectorWave();
}



export function updateBattleState() {
    let nextState = null;
    const player = getPlayer();
    const starfield = getStarfield();
    const explosionParticles = getExplosionParticles();
    

    player.update();
    starfield.update(player.velocity);
    
    // Check for new bonuses and power-ups
    checkForNewBonusesAndPowerUpsOverTime();
    
    // Update debug display
    updateDebugText();
    
    // Update explosion particles
    explosionParticles.update();
    
    updateAsteroids();
    updateBullets();
    updateBonuses();
    updatePowerUps();
    const scoreToAdd = checkCollisionsBetweenBulletsAndAsteroids(explosionParticles);
    addScore(scoreToAdd);
    checkScorMultipliersCollisions();
    let playerIsDead = checkPlayerCollisions(player, explosionParticles);
    if(playerIsDead) {
        nextState = STATE_GAME_OVER;
    }
    
    checkPowerUpCollisions(player);



    if(getAsteroids().length === 0) { // Wave is over when no asteroids remain
        removeWaveUI();

        nextState = STATE_SECTOR_SELECT;
    }
    return nextState;
}

// Add getters for the battle objects
export function getPlayer() {
    return gPlayer;
}

export function getStarfield() {
    return gStarfield;
}

export function getExplosionParticles() {
    return gExplosionParticles;
}

export function destroyAnyStarfield() {
    if(gStarfield !== null){
        gStarfield.destroy();
        gStarfield = null;
    }
}

export function destroyAnyExplosionParticles() {
    if(gExplosionParticles !== null){
        gExplosionParticles.destroy();
        gExplosionParticles = null;
    }
}

export function destroyAnySpaceship() {
    if(gPlayer !== null){
        gPlayer.destroy();
        gPlayer = null;
    }
}

export function initBattleDebug() {
    gDebugMode = false;
    gDebugText = new PIXI.Text({
        text: 'Debug Info',
        style: { 
            fill: 0x55FF55,  // CGA bright green
            fontSize: 14
        }
    });
    gDebugText.x = 10;
    gDebugText.y = 40;
    gDebugText.visible = gDebugMode;
    let stage = getAppStage();
    stage.addChild(gDebugText);
}

export function removeBattleDebug() {
    if(gDebugText !== null){
        gDebugText.destroy();
        gDebugText = null;
    }
}


function activatePowerUp(powerUp) {
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
            if (gSoundManager) {
                gSoundManager.play('power_double');
            }
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
            if (gSoundManager) {
                gSoundManager.play('power_quad');
            }
            break;
    }

}




export function handleBattleKeyPress(event) {
    let nextState = null;
    // Don't process input if player is teleporting or game is over
    if (gPlayer.isTeleporting) return;


    if (event.key === 'q' || event.key === 'Q') {
        const powerUp = getAndRemovePowerUpFromTopOfStack();
        if (powerUp) {

            // activate the power up
            activatePowerUp(powerUp);

            // animate the power up to the player (geere pau inventory_ui.js)
            throwPowerUpPlayerAndDestroyAtArrival(powerUp,gPlayer);
            gSoundManager.play('throw_power');

/*             // temp : remove from the stage and destroy
            stage.removeChild(powerUp.sprite);
            powerUp.destroy();
 */
            return null;
        }
    }


    switch (event.key) {
        case 'ArrowLeft':
            gPlayer.isRotatingLeft = true;
            break;
        case 'ArrowRight':
            gPlayer.isRotatingRight = true;
            break;
        case 'ArrowUp':
            gPlayer.isMovingForward = true;
            gSoundManager.startThrust();  // Start engine sound
            break;
        case ' ':
            gPlayer.actionFire(gSoundManager);
            break;
        case 'ArrowDown':
            gPlayer.tryTeleport(gSoundManager); //TODO remvoe sound manager parameter
            break;
        case 'd':
        case 'D':
            gDebugMode = !gDebugMode;
            gDebugText.visible = gDebugMode;
            break;
        case 'g':
        case 'G':
            if (gDebugMode) {
                console.log('CHEAT:Goto Game Over');
                gSoundManager.stopAll();
                gSoundManager.play('spaceshipExplode');
                gSoundManager.play('gameOver');
                nextState = STATE_GAME_OVER;
            }
            break;
        case 'b':
        case 'B':
            if (gDebugMode) {
                console.log('CHEAT:Destroy all game objects');
                destroyAllGameObjects();
            }
            break;
    }
    return nextState;
}

export function handleBattleKeyRelease(event) {
    let nextState = null;
    switch (event.key) {
        case 'ArrowLeft':
            gPlayer.isRotatingLeft = false;
            break;
        case 'ArrowRight':
            gPlayer.isRotatingRight = false;
            break;
        case 'ArrowUp':
            gPlayer.isMovingForward = false;
            gSoundManager.stopThrust();  // Stop engine sound
            break;
    }
    return nextState;
}


function addWaveUI() {
    // Wave text
    const fontStyle = getMainFontStyleNormal();
    waveText = new PIXI.Text({
        text: 'TOFILL WAVE',
        style: fontStyle
        });

    waveText.alpha = 0.5;
    waveText.x = getScreenWidth()/ 2;
    waveText.y = 10;
    waveText.anchor.set(0.5, 0); // Center horizontally, align to top
    let stage = getAppStage();
    stage.addChild(waveText);
}

function removeWaveUI() {
    if (waveText && waveText.parent) {
        waveText.parent.removeChild(waveText);
    }
    waveText = null;
}

function updateWaveUI(sectorIndex) {
    if (waveText) {
        const sectorDescription = GetSectorDescriptionByIndex(sectorIndex);
        const sectorName = sectorDescription ? sectorDescription.name : "Unknown";
        waveText.text = `Mission ${getCurrentMissionNumber()} - ${sectorName} Sector`;
    }
}


