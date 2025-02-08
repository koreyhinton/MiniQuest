window.liftOff = {
    //+loaded
    //+ticks
    //+frame
    parentElementId: "game",
    pairedElementId: "player",
    elementId: "lift_off",
    ticksPerFrame: 10,
    order: [0,1,2],
    frames: [
        {
            src: "images/player135.png",
            sheetW: 45,
            sheetH: 42,
            frameX: 0,
            frameY: 0,
            frameW: 42,
            frameH: 45
        },
        {
            src: "images/player225.png",
            sheetW: 44,
            sheetH: 41,
            frameX: 0,
            frameY: 0,
            frameW: 44,
            frameH: 41
        },
        {
            src: "images/player270.png",
            sheetW: 46,
            sheetH: 35,
            frameX: 0,
            frameY: 0,
            frameW: 46,
            frameH: 35
        }
    ]
};

