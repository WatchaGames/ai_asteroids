import Bullet from './bullet.js';
import Spaceship from './spaceship.js';
import Asteroid from './asteroid.js';

async function initGame() {
    // Initialize PixiJS Application
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0x000000,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        backgroundAlpha: 1,
        powerPreference: "high-performance",
        hello: true,
        forceCanvas: false
    });

    // Initialize PixiJS
    await app.init();
    document.body.appendChild(app.canvas);

    // Game State Variables
    const player = new Spaceship(app);
    const asteroids = [];
    const bullets = [];
    let score = 0;
    let lives = 3;
    let gameOver = false;

    // UI Elements
    const scoreText = new PIXI.Text('Score: 0', { fill: 0xFFFFFF });
    scoreText.x = 10;
    scoreText.y = 10;
    app.stage.addChild(scoreText);

    const livesText = new PIXI.Text('Lives: 3', { fill: 0xFFFFFF });
    livesText.x = app.screen.width - 100;
    livesText.y = 10;
    app.stage.addChild(livesText);

    // Initialize Asteroids
    for (let i = 0; i < 5; i++) {
        asteroids.push(new Asteroid(app, 30, 'large'));
    }

    // Keyboard Input Handling
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                player.isRotatingLeft = true;
                break;
            case 'ArrowRight':
                player.isRotatingRight = true;
                break;
            case 'ArrowUp':
                player.isMovingForward = true;
                break;
            case ' ':
                const bullet = new Bullet(app, player.sprite.x, player.sprite.y, player.sprite.rotation);
                bullets.push(bullet);
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                player.isRotatingLeft = false;
                break;
            case 'ArrowRight':
                player.isRotatingRight = false;
                break;
            case 'ArrowUp':
                player.isMovingForward = false;
                break;
        }
    });

    // Update Functions
    function updateAsteroids() {
        asteroids.forEach(asteroid => asteroid.update());
    }

    function updateBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            if (bullets[i].update()) {
                bullets.splice(i, 1);
            }
        }
    }

    function destroyAsteroid(asteroid, index) {
        asteroid.destroy();
        asteroids.splice(index, 1);
        
        if (asteroid.sizeLevel === 'large') {
            score += 20;
            const newAsteroids = asteroid.split();
            asteroids.push(...newAsteroids);
        } else if (asteroid.sizeLevel === 'medium') {
            score += 50;
            const newAsteroids = asteroid.split();
            asteroids.push(...newAsteroids);
        } else if (asteroid.sizeLevel === 'small') {
            score += 100;
        }
        
        scoreText.text = 'Score: ' + score;
    }

    function checkCollisions() {
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
                    destroyAsteroid(asteroid, j);
                    break; // Bullet can only hit one asteroid
                }
            }
        }
    }

    function checkPlayerCollisions() {
        if (gameOver) return;
        for (let asteroid of asteroids) {
            const dx = player.sprite.x - asteroid.sprite.x;
            const dy = player.sprite.y - asteroid.sprite.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < player.radius + asteroid.radius) {
                lives--;
                livesText.text = 'Lives: ' + lives;
                if (lives <= 0) {
                    gameOver = true;
                    const style = new PIXI.TextStyle({ fill: 0xFFFFFF, fontSize: 48 });
                    const gameOverText = new PIXI.Text('Game Over', style);
                    gameOverText.x = app.screen.width / 2 - gameOverText.width / 2;
                    gameOverText.y = app.screen.height / 2 - gameOverText.height / 2;
                    app.stage.addChild(gameOverText);
                } else {
                    player.sprite.x = app.screen.width / 2;
                    player.sprite.y = app.screen.height / 2;
                    player.velocity = { x: 0, y: 0 };
                }
                break;
            }
        }
    }

    function checkWave() {
        if (asteroids.length === 0) {
            const numAsteroids = 5 + Math.floor(score / 1000); // Increase difficulty
            for (let i = 0; i < numAsteroids; i++) {
                asteroids.push(new Asteroid(app, 30, 'large'));
            }
        }
    }

    // Game Loop
    app.ticker.add(() => {
        if (!gameOver) {
            player.update();
            updateAsteroids();
            updateBullets();
            checkCollisions();
            checkPlayerCollisions();
            checkWave();
        }
    });
}

// Start the game
initGame().catch(console.error); 