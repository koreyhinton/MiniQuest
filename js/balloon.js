window.balloonDirectionCalculation = { driftOff: null, driftOn: null, x: null, y: null,
                                          driftOnOverride: false, dir: null, driftOffOverride: false };
//                                                                ^
//                                                               /
//                                                 {null,'N','S','W','E'}

// todo: remove driftOnOverride hack. Requires refactoring it all to have driftOn be a 3-state
//       like driftOff
/*
    driftOff[road] is a nullable boolean state machine:
        * null
                when:
                    - point-and-click has not happened
                    - or the last point-and-click was in bounds
        * false
                when:
                    - last click was out of bounds BUT the player is NOT yet near it's end path
                    (if no other click cancels it, a false will become true once near path end)
        * true
                when:
                    - last click was out of bounds AND player IS near it's last valid path points
                      (and direction can now calculated based on the last dir to go at the end
                       e.g.,
                            a top-right click on the first scene means the player
                            goes SW down the road before balloon engages and drifts N)
                    - or player is already offroad drifting to the out of bounds click direction
*/

/*
    driftOn[road] is a non-nullable boolean state machine:
    * false
            when:
                - point-and-click has not happened
                - or last click was not taking player from out-of-bounds back into bounds
                - or player is back in bounds and no longer drifting

    * true
            when:
                - or last click happened and it is animating the process of
                  taking the player from out-of-bounds back into bounds (of the road)
*/

/*
   Balloon lifecycle:

   balloon() _____
    ^--create[1]  \___ 
     (chara. went     \
       offroad)    |   balloonSetPosition() ____   _[offscreen]____ (cut scene)
                        ^--move[n]              \ /                    \
                   | /                           Y                     /
                                                  \__[back2road]      /
                   |  \                                    \         /
                                                            balloonRemove()[1]
                    \   \
                      balloonDriftDelta()
                       ^--indirect move control[n]
                        (calculates a delta that shifts the player,
                         which will affect balloonSetPosition)

    [1] executes only 1x during the out of bounds animation
    [n] repeats every gameloop iteration during the out of bounds animation
*/

window.balloonUpdateDrifts = function(crossingBounds, parentRect) {

    var crossingToRoad = crossingBounds && (
        window.balloonDirectionCalculation.driftOff
        || window.balloonDirectionCalculation.driftOff === false);

    var crossingToOffroad = crossingBounds &&
        window.balloonDirectionCalculation.driftOff === null;

    console.log(`ToRoad: ${crossingToRoad}, ToOffRoad: ${crossingToOffroad}`, window.clickTarget);

    if (crossingToRoad) {
        window.balloonDirectionCalculation.driftOn = true;
        window.balloonDirectionCalculation.driftOff = null; // seq: true -> false -> null*
        // cross to onroad drift change will immediately update the drift direction:
        var x = clickTarget.x;
        var y = clickTarget.y;
        window.balloonDirectionCalculation.driftOn = false;
        window.balloonDirectionCalculation.driftOnOverride = true;
        window.balloonDirectionCalculation.dir = null; // must be reset so it can be recalculated
        window.clickTarget = null;                     // after it is close by the road
        window.balloonTrySetDirection(parentRect);
        window.pathFind(idx, 1280, 720, window.playerXY(), {x: x, y:720-y}, map[idx].road);
        window.pathQ.values.push([x, 720-y]);
    } else if (crossingToOffroad) {
        window.balloonDirectionCalculation.driftOn = false;
        window.balloonDirectionCalculation.driftOff = false; // seq: null -> false* -> true
        // crossing to offroad drift change will NOT immediately update the drift direction
        // that happens near the end of the driving path to ensure proper road-cross direction calc
    } else if (window.balloonDirectionCalculation.driftOff) {
        // if already drifting offroad and clicked again off-road, the offroad drift direction
        // will update immediately:
        var x = clickTarget.x;
        var y = clickTarget.y;
        window.clickTarget = null;
        window.balloonDirectionCalculation.driftOff = null;
        window.balloonDirectionCalculation.driftOffOverride = true;
        window.balloonTrySetDirection(parentRect);
        window.pathFind(idx, 1280, 720, window.playerXY(), {x: x, y:720-y}, map[idx].road)
    }

    // when not crossing, then the player can keep to their current animation process/path
};

window.balloonTrySetDirection = function(parentRect) {

    if (window.clickTarget == null)
        return;

    var xDiff = window.clickTarget.x - balloonDirectionCalculation.x;
    var yDiff = window.clickTarget.y - balloonDirectionCalculation.y;

/*
    var xDiff = target.x - balloonDirectionCalculation.x;
    var yDiff = target.y - balloonDirectionCalculation.y;
    if (!(xDiff != 0 || yDiff != 0)) {
        xDiff = parentRect.x1 - balloonDirectionCalculation.x;
        yDiff = parentRect.y1 - balloonDirectionCalculation.y;
    }
*/
    let hasDiff = xDiff != 0 || yDiff != 0;
    if (hasDiff/* && balloonDirectionCalculation.state == "calculating"*/) {
        let dir = "N";
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff < 0)
                dir = "W";
            else
                dir = "E";
        } else if (yDiff > 0) {
            dir = "S";
        }
        window.balloonDirectionCalculation.dir = dir;
        console.log("DIRECTION:", dir);
        //window.clickTarget = null;
    }
};

window.balloon = function(parentRect) {
    if (document.getElementById("balloon") != null)
        return;
    var balloon = document.createElement("div")
    balloon.style.zIndex = "106";//.zIndex=200000
    balloon.style.position = "absolute";
    balloon.style.left = (parentRect.x1-20)+"px";
    balloon.style.top = (parentRect.y1-56)+"px";
    balloon.innerHTML="<img src='images/balloon-36286__84.png'>"
    balloon.id = "balloon";
    document.getElementById("game").appendChild(balloon);

    balloonDirectionCalculation.x = parentRect.x1;
    balloonDirectionCalculation.y = parentRect.y1;

    /*
    balloonDirectionCalculation = {
        state: "calculating", x: parentRect.x1, y: parentRect.y1
    };
    */

    //window.balloonTrySetDirection(parentRect);
};

window.balloonSetPosition = function(parentRect) {
    if (document.getElementById("balloon") == null)
        return;
    var balloon = document.getElementById("balloon");
    balloon.style.left = (parentRect.x1-20)+"px";
    balloon.style.top = (parentRect.y1-56)+"px";

    //window.balloonTrySetDirection(parentRect);

    // if a new click target has become available, then adjust to it
    //balloonDirectionCalculation.state = "calculating";

    //window.balloonTrySetDirection(parentRect);

};

window.balloonDriftDelta = function(target, plxy) {
    //window.balloonTrySetDirection(parentRect);
    //if (balloonDirectionCalculation.state != "calculated") {
    //    return { dx: 0, dy: 0 };
    //}

    switch (balloonDirectionCalculation.dir) {
        case "S":
            return { dx: 0, dy: 1 };
        case "W":
            return { dx: -1, dy: 0 };
        case "E":
            return { dx: 1, dy: 0 };
        default:
            return { dx: 0, dy: -1 };
    }
    /*
    if (window.clickTarget.x == window.playerXY().x &&
            window.clickTarget.y == window.playerXY().y) {
        balloonRemove();
    } else {
        var flyDx = window.clickTarget.x - window.playerXY().x;
        if (flyDx!=0)
            flyDx /= ((flyDx<1?-1:1)*flyDx);
        else
            flyDx=0;
        var flyDy =  window.clickTarget.y - window.playerXY().y;
        if (flyDy!=0)
            flyDy /= ((flyDy<1?-1:1)*flyDy);
        else
            flyDy=0;
        try_x = flyDx;
        try_y = flyDy;
    }
    */

}

window.balloonRemove = function() {
    if (document.getElementById("balloon") == null)
        return;
    document.getElementById("balloon").remove();
    balloonDirectionCalculation = { driftOff: null, driftOn: null, x: null, y: null,
        driftOnOverride: false, dir: null, driftOffOverride: false };
};

window.balloonVisible = function() {
    return document.getElementById("balloon") != null;
};
