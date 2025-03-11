import { palette10 } from './palette.js';
import Starfield from './starfield.js';
import { STATE_BATTLE,   getAppStage, getScreenHeight, getScreenWidth, getGameVersion } from './globals.js';
import { getMainFontStyleTitle, getMainFontStyleBig, getMainFontStyleNormal } from './fonts.js';
let titleContainer = null;
let starfield = null;
let earthGraphic = null;

const gameName = 'Astero FORCE 2025';
const gameSubtitle = 'How far will you clean deep space ?';
const gameAuthor = 'by GlaudeSoft';
const gameSubtitle2 = '(and maybe find alien relics)';

function createEarthGraphic() {
    const container = new PIXI.Container();
    
    // Calculate dimensions for Earth
    const earthDiameter = getScreenHeight() * 1.2; // Make Earth bigger than screen height
    const earthRadius = earthDiameter / 2;
    
    // Position Earth at bottom center, 80% below screen (showing only 20%)
    const earthX = getScreenWidth() / 2;
    const earthY = getScreenHeight() + earthRadius * 0.6; // Increased from 0.4 to 0.6 to show less

    // Create atmospheric glow
    const glow = new PIXI.Graphics();
    glow.beginFill(0x4287f5, 0.2);
    glow.drawCircle(0, 0, earthRadius * 1.05);
    glow.endFill();
    
    // Create base Earth circle
    const earth = new PIXI.Graphics();
    earth.beginFill(0x2E5BA0); // Ocean blue
    earth.drawCircle(0, 0, earthRadius);
    earth.endFill();

    // Add some landmasses (simplified continents)
    const landmasses = new PIXI.Graphics();
    landmasses.beginFill(0x3D8A3D); // Forest green
    
    // Random continent-like shapes
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8;
        const x = Math.cos(angle) * (earthRadius * 0.7);
        const y = Math.sin(angle) * (earthRadius * 0.7);
        
        landmasses.moveTo(x, y);
        // Create irregular shapes for continents
        for (let j = 0; j < 5; j++) {
            const randAngle = angle + (Math.random() - 0.5) * 1;
            const randDist = earthRadius * (0.4 + Math.random() * 0.3);
            landmasses.lineTo(
                Math.cos(randAngle) * randDist,
                Math.sin(randAngle) * randDist
            );
        }
        landmasses.closePath();
    }
    landmasses.endFill();

    // Add cloud layer
    const clouds = new PIXI.Graphics();
    clouds.beginFill(0xFFFFFF, 0.3);
    for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * earthRadius * 0.9;
        const cloudSize = earthRadius * (0.1 + Math.random() * 0.2);
        clouds.drawCircle(
            Math.cos(angle) * distance,
            Math.sin(angle) * distance,
            cloudSize
        );
    }
    clouds.endFill();

    // Combine all layers
    container.addChild(glow);
    container.addChild(earth);
    container.addChild(landmasses);
    container.addChild(clouds);

    // Position the container
    container.x = earthX;
    container.y = earthY;

    return container;
}

export function showTitleScreen() {
    
    // Create container for title screen elements
    titleContainer = new PIXI.Container();
    
    // Create starfield
    starfield = new Starfield();
    
    // Add Earth graphic
    earthGraphic = createEarthGraphic();
    titleContainer.addChild(earthGraphic);
    

    const titleFontStyle = getMainFontStyleTitle();
    // Title text
    const titleText = new PIXI.Text({
        text: gameName,
        style: titleFontStyle,
        fill: palette10.white
    });
    titleText.x = getScreenWidth() / 2;
    titleText.y = getScreenHeight() * 0.25;
    titleText.anchor.set(0.5);

    // Subtitle text
    const subtitleFontStyle = getMainFontStyleBig();
    const subtitleText = new PIXI.Text({
        text: gameSubtitle,
        style: subtitleFontStyle,
        fill: palette10.white
    });
    subtitleText.x = getScreenWidth() / 2;
    subtitleText.y = getScreenHeight() * 0.36;
    subtitleText.anchor.set(0.5);

        // Subtitle text
    const subtitleText2 = new PIXI.Text({
        text: gameSubtitle2,
        style: subtitleFontStyle,
        fill: palette10.white
    });
    subtitleText2.x = getScreenWidth() / 2;
    subtitleText2.y = getScreenHeight() * 0.40;
    subtitleText2.alpha = 0.5;
    subtitleText2.anchor.set(0.5);
    


    // Press space text
    const restFontStyle = getMainFontStyleNormal();

    
    // Controls text
    const controlsText = new PIXI.Text({
        text: 'Controls:\n↑ Thrust\n← → Rotate\nSPACE Fire\n↓ Teleport\nQ Use Power-up',
        style: restFontStyle
    });
    controlsText.x = getScreenWidth() / 2;
    controlsText.y = getScreenHeight() * 0.55;
    controlsText.anchor.set(0.5);

    const versionText = new PIXI.Text({
        text: `v${getGameVersion()}`,
        style: restFontStyle,
        fill: palette10.white,
        align: 'center',
    });
    versionText.alpha = 0.5;
    versionText.x = getScreenWidth() * 0.95;
    versionText.y = getScreenHeight() * 0.95;
    versionText.anchor.set(0.5);


    const pressSpaceText = new PIXI.Text({
        text: 'Press Space to Start',
        style: restFontStyle,
        fill: palette10.white,
    });
    pressSpaceText.x = getScreenWidth()/ 2;
    pressSpaceText.y = getScreenHeight() * 0.71;
    pressSpaceText.anchor.set(0.5);


    
    // Add elements to container
    titleContainer.addChild(titleText);
    titleContainer.addChild(subtitleText);
    titleContainer.addChild(subtitleText2);
    titleContainer.addChild(pressSpaceText);
    titleContainer.addChild(controlsText);
    titleContainer.addChild(versionText);

    
    let stage = getAppStage();
    // Add container to stage
    stage.addChild(titleContainer);
    
    // Animate press space text
    const animate = () => {
        if (pressSpaceText) {
            pressSpaceText.alpha = 0.5 + Math.sin(Date.now() / 500) * 0.5;
        }
        requestAnimationFrame(animate);
    };
    animate();
}

export function updateTitleScreen(delta) {
    if (starfield) {
        starfield.update({x:5,y:0} );
    }
    if (earthGraphic) {
        earthGraphic.rotation += 0.001; // Slowly rotate Earth
    }
}

export function hideTitleScreen() {
    let stage = getAppStage();
    if (titleContainer) {
        stage.removeChild(titleContainer);
        titleContainer = null;
        earthGraphic = null;
    }
    if (starfield) {
        starfield.destroy();
        starfield = null;
    }
} 


export function handleTitleKeyPress(event) {
    return null;
}

export function handleTitleKeyRelease(event) {
    if (event.key === ' ') {
        return STATE_BATTLE;
    }
    return null;
}