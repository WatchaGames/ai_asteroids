let runningTweens = new Map(); // Track ongoing animations


export function clearAllTweenAnimations(){
    runningTweens.clear();
}


function easeOutQuad(t) {
    return t * (2 - t);
}

export function isTweenRunning(sprite){
    return runningTweens.has(sprite);
}

export function animateTweenSpritePos(sprite, startX, startY, endX, endY, duration, destroySpriteOnComplete = false)
{
    const startTime = Date.now();
    
    // Store animation data
    runningTweens.set(sprite, {
        startTime,
        startX,
        startY,
        endX,
        endY,
        duration,
        destroyOnComplete: destroySpriteOnComplete
    });
    
    // Animation function
    const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing
        const easedProgress = easeOutQuad(progress);
        
        // Update position
        sprite.x = startX + (endX - startX) * easedProgress;
        sprite.y = startY + (endY - startY) * easedProgress;
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete
            runningTweens.delete(sprite);
            if (destroySpriteOnComplete) {
                sprite.parent.removeChild(sprite);
                sprite.destroy();
            }
        }
    };
    
    animate();
}