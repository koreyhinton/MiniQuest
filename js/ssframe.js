// SPRITESHEET FRAMES
window.ssframes = {/*
    sheetName: {
        +loaded: false,
        +ticks: 8, //[1-ticksPerFrame]
        +frame: 1, //[1-order.length] (currentFrame = frames[order[frame-1]])
        parentElementId: "game",
        pairedElementId: "player",
        elementId: "my_animation",
        ticksPerFrame: 10,
        order: [2,1,0],
        frames: [
            {
                src: "spritesheet.png",
                sheetW: 1000,
                sheetH: 1000,
                frameX: 900,
                frameY: 900,
                frameW: 100,
                frameH: 100
            },
            ..
        ]
    }
*/};

// SPRITESHEET FRAME - ANIMATE
// Step 1. add all sheets to ssframes. (ssframes["SheetName"] = {..};)
// Step 2. call ssframeAnimate in a timer or loop
window.ssframeAnimate = function(sheetName, visible) {

    var sheet = ssframes[sheetName];
    var loaded = !!sheet.loaded;

    if (loaded && !visible) {
        document.getElementById(sheet.elementId).style.visibility =
            visible ? "visible" : "hidden";
        // increment ticks and/or frame
        sheet.ticks = ((sheet.ticks + 1) % sheet.ticksPerFrame) + 1;
        if (sheet.ticks == 1) {
            sheet.frame = ((sheet.frame + 1) % sheet.order.length) + 1;
        }
        return;
    }

    var pairedElement = document.getElementById(sheet.pairedElementId);
    var parentElement = document.getElementById(sheet.parentElementId);

    if (!loaded && pairedElement != null && parentElement != null) {
        var el = document.createElement("div");
        el.id = sheet.elementId;
        el.style.position = "absolute";
        el.style.zIndex = "1999888";

        /* uncomment to debug and see the red horiz. line */
        // el.style.backgroundColor = "red";
        // el.style.width = "1000px";
        // el.style.height = "20px";
        /* end debug lines */

        parentElement.appendChild(el);
        sheet.ticks = 1;
        sheet.frame = 1;
        sheet.loaded = true;
    }

    var animatedElement = document.getElementById(sheet.elementId);

    if (animatedElement == null) {
        return;
    }
    animatedElement.style.visibility = visible ? "visible" : "hidden";

    // animation

    var currentFrame = sheet.frames[sheet.order[sheet.frame-1]];

    animatedElement.style.width = currentFrame.frameW + "px";
    animatedElement.style.height = currentFrame.frameH + "px";
    animatedElement.style.left = getComputedStyle(pairedElement).left;
    animatedElement.style.top = getComputedStyle(pairedElement).top;

    animatedElement.style.backgroundImage = `url(${currentFrame.src})`;
    animatedElement.style.backgroundSize
        = `${currentFrame.sheetW}px ${currentFrame.sheetH}px`;
    animatedElement.style.backgroundPosition
        = `top ${currentFrame.frameY}px left ${currentFrame.frameX}px`;
console.log(`frame ${sheet.frame}, ticks ${sheet.ticks}`);
    // increment ticks and/or frame
    sheet.ticks = ((sheet.ticks + 1) % sheet.ticksPerFrame) + 1;
    if (sheet.ticks == 1) {
        sheet.frame = ((sheet.frame + 1) % sheet.order.length) + 1;
    }
};
