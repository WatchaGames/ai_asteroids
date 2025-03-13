const DEBUG_BATTLE = false;

import Asteroid from './asteroid.js';
import Bullet from './bullet.js';
import PowerUp from './powerUp.js';
import { gSoundManager } from './soundManager.js';
import Starfield from './starfield.js';
import ExplosionParticles from './explosionParticles.js';
import Spaceship from './spaceship.js';
import { GetSectorDescriptionByIndex } from './sectors.js';
import { getAppStage, getCurrentSectorIndex, getCurrentMissionNumber, STATE_GAME_OVER, STATE_SECTOR_SELECT, getScreenWidth, getScreenHeight, setCurrentSectorIndex, setCurrentMissionNumber } from './globals.js';
import { removeOneLife, 
    getMultiplier, 
    addScore, 
    addPowerUpToCargoStack,
    getAndRemovePowerUpFromTopOfStack,
    throwPowerUpPlayerAndDestroyAtArrival,
    flyScoreBonusToScoreBonus,
    addToScoreMultiplier,
    updateInventory
    } from './inventory_ui.js';

import { getMainFontStyleNormal } from './fonts.js';
// Battle objects
let gPlayer = null;
let gStarfield = null;
let gExplosionParticles = null;

// Battle state
let asteroids = [];
let bullets = [];
let flyingPowerUps = [];
 
let rearBulletActive = false;
let rearBulletTimer = null;
let quadFireActive = false;
let quadFireTimer = null;

// Wave UI
let waveText = null;

// Game state for power-up spawning
let lastPowerUpSpawn = 0;
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

export function destroyPowerUps() {
    let stage = getAppStage();
    flyingPowerUps.forEach(powerUp => {
        stage.removeChild(powerUp.sprite);
        powerUp.destroy();
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

export function addPowerUpObject(type,posX,posY) {
    const powerUp = new PowerUp(type,posX,posY);
    flyingPowerUps.push(powerUp);
}

// return the score to add
export function hitAsteroid(asteroid, index, explosionParticles) {
    // Don't destroy indestructible asteroids
    if (asteroid.isIndestructible) {
        // Create a small spark effect but don't destroy the asteroid
        explosionParticles.createExplosion(
            asteroid.sprite.x,
            asteroid.sprite.y,
            0xFFFFFF, // White color for the spark
            5 // Small explosion
        );
        if (gSoundManager) {
            gSoundManager.play('impact_metal'); // Use hit sound instead of explosion
        }
        return 0; // No points for hitting indestructible asteroid
    }

    // Handle golden asteroids
    if (asteroid.isGolden) {
        // Check if asteroid should be destroyed
        const isDestroyed = asteroid.hit();
        if (!isDestroyed) {
            explosionParticles.createExplosion(
                asteroid.sprite.x,
                asteroid.sprite.y,
                0xFFD700, // Gold color
                10 // Medium explosion
            );
            if (gSoundManager) {
                gSoundManager.play('impact_metal');
            }
    
            return 50;
        }
        // if destroyed, check for power-up spawn (30% chance)
        if (Math.random() < 0.3) {
            addRandomPowerUpObject(asteroid.sprite.x, asteroid.sprite.y);
        }
        // continues with normal asteroid hit
    }

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
        asteroid.getColorForType(),
        explosionSize[asteroid.asteroidType]
    );

    // Play explosion sound
    if (gSoundManager) {
        gSoundManager.playExplosion(asteroid.asteroidType);
    }
    
    // Remove asteroid and update score
    let points = 0;

    if(asteroid.isGolden)
    {
        points = 200;
    }
    if (asteroid.asteroidType === 'large') {
        points = 20;
        const newAsteroids = asteroid.split();
        asteroids.push(...newAsteroids);
        CheckForChanceToDropPowerUpLoot(asteroid.sprite.x,asteroid.sprite.y);
        
    } else if (asteroid.asteroidType === 'medium') {
        points = 50;
        const newAsteroids = asteroid.split();
        asteroids.push(...newAsteroids);
    } else if (asteroid.asteroidType === 'small') {
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
        
        if (distance < player.radius + powerUp.radius) {
            // Handle different power-up types
            if (powerUp.type === 'scoreBonus') {
                // Immediately activate score multiplier
//                clearScoreMultiplier();
                addToScoreMultiplier(2);
                if (gSoundManager) {
                    gSoundManager.play('bonus_double');
                }
                // fly the score bonus to the score bonus
                flyScoreBonusToScoreBonus(powerUp);
/*                 // Remove the power-up
                powerUp.destroy();
 */                flyingPowerUps.splice(i, 1);
            } else {
                // Add other power-ups to cargo stack
                addPowerUpToCargoStack(powerUp);
                flyingPowerUps.splice(i, 1);
                if (gSoundManager) {
                    gSoundManager.play('catch_power');
                }
            }
        }
    }
}

export function destroyAllGameObjects() {
    destroyAsteroids();
    destroyBullets();
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

    // Add 1-2 indestructible asteroids randomly positioned but not too close to center
    const numIndestructible = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numIndestructible; i++) {
        let asteroid;
        let validPosition = false;

        asteroid = new Asteroid(sectorDescription, 'indestructible');

        while (!validPosition) {
            // rnd pos till valid
            const rndX = Math.random() * getScreenWidth();
            const rndY = Math.random() * getScreenHeight();


            // Create indestructible asteroid at a random position
            const dx = rndX - centerX;
            const dy = rndY - centerY;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
            
            if (distanceFromCenter >= minDistanceFromCenter) {
                validPosition = true;
                asteroid.setPosition(rndX, rndY);
            }
        }
        newAsteroids.push(asteroid);
    }

    // Add 1 golden asteroid with random position
    let goldenAsteroid;
    let validPosition = false;
    
    goldenAsteroid = new Asteroid(sectorDescription, 'golden');
    while (!validPosition) {
        const rndX = Math.random() * getScreenWidth();
        const rndY = Math.random() * getScreenHeight();

        const dx = rndX  - centerX;
        const dy = rndY - centerY;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        
        if (distanceFromCenter >= minDistanceFromCenter) {
            validPosition = true;
            goldenAsteroid.setPosition(rndX, rndY);
        } 
    }
    newAsteroids.push(goldenAsteroid);


    // Add regular asteroids
    for (let i = 0; i < numAsteroids; i++) {
        let asteroid;
        let validPosition = false;
        
        asteroid = new Asteroid(sectorDescription, 'large');
        while (!validPosition) {
            const rndX = Math.random() * getScreenWidth();
            const rndY = Math.random() * getScreenHeight();
            const dx = rndX - centerX;
            const dy = rndY - centerY;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
            
            if (distanceFromCenter >= minDistanceFromCenter) {
                validPosition = true;
                asteroid.setPosition(rndX, rndY);
            }
        }
        
        newAsteroids.push(asteroid);
    }
    return newAsteroids;
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

export function updatePowerUps() {
    for (let i = flyingPowerUps.length - 1; i >= 0; i--) {
        if (flyingPowerUps[i].update()) {
            flyingPowerUps.splice(i, 1);
        }
    }
}



export function checkForNewPowerUpsOverTime() {
    const currentTime = Date.now();
    if (currentTime - lastPowerUpSpawn > POWER_UP_SPAWN_INTERVAL) {
        addRandomPowerUpObject();
        lastPowerUpSpawn = currentTime;
    }
}

export function addRandomPowerUpObject(posX, posY) {
    // List of available power-up types with their weights
    const powerUpTypes = [
        { type: 'rearBullet', weight: 0.4 },
        { type: 'quadFire', weight: 0.3 },
        { type: 'scoreBonus', weight: 0.3 }
    ];

    // Calculate total weight
    const totalWeight = powerUpTypes.reduce((sum, powerUp) => sum + powerUp.weight, 0);
    
    // Generate random number between 0 and total weight
    let random = Math.random() * totalWeight;
    
    // Find the selected power-up type
    let selectedType;
    for (const powerUp of powerUpTypes) {
        if (random < powerUp.weight) {
            selectedType = powerUp.type;
            break;
        }
        random -= powerUp.weight;
    }
    
    // Create and add the power-up
    const powerUp = new PowerUp(selectedType, posX, posY);
    flyingPowerUps.push(powerUp);
}   

export function updateDebugText() {
    if (gDebugMode && gDebugText && gPlayer) {
        const rotationDegrees = (gPlayer.sprite.rotation * 180 / Math.PI).toFixed(1);
        const posX = gPlayer.sprite.x.toFixed(1);
        const posY = gPlayer.sprite.y.toFixed(1);
        gDebugText.text = `Rotation: ${rotationDegrees}°\nPosition: (${posX}, ${posY})`;
    }
}


// used to reset battle progress when starting a complet new game
export function ResetBattleProgress() {
    setCurrentMissionNumber(1);
    setCurrentSectorIndex(1);
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
    
    // Check for new power-ups
    checkForNewPowerUpsOverTime();
    
    // Update debug display
    updateDebugText();
    
    // Update explosion particles
    explosionParticles.update();
    
    updateAsteroids();
    updateBullets();
    updatePowerUps();
    const scoreToAdd = checkCollisionsBetweenBulletsAndAsteroids(explosionParticles);
    addScore(scoreToAdd);
    let playerIsDead = checkPlayerCollisions(player, explosionParticles);
    if(playerIsDead) {
        nextState = STATE_GAME_OVER;
    }
    
    checkPowerUpCollisions(player);

    updateInventory();


    // Check if wave is completed (all asteroids destroyed)
    if (isWaveCompleted()) {
        removeWaveUI();
        nextState = STATE_SECTOR_SELECT;
    }

    return nextState;
}

// TODO: check rule: do we count golden asteroids ?
function isWaveCompleted() {
    // check if all non-special asteroids are destroyed
    let count = 0;
    for (let asteroid of asteroids) {
        if (!asteroid.isIndestructible && !asteroid.isGolden) {
            count++;
        }
    }
    return count === 0;
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


    // test if shift key is presse
    if (event.ctrlKey == true) {
        const powerUp = getAndRemovePowerUpFromTopOfStack();
        if (powerUp) {

            // activate the power up
            activatePowerUp(powerUp);

            // animate the power up to the player (geere pau inventory_ui.js)
            throwPowerUpPlayerAndDestroyAtArrival(powerUp,gPlayer);
            gSoundManager.play('throw_power');

            return null;
        }
    }

    // if ctrl key is pressed, fire all bullets
    if (event.shiftKey == true) {
        gPlayer.actionFire(gSoundManager);
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


