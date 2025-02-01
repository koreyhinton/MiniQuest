
//window.pnc_q = [];

window.clickTarget = null;
window.origAngle = null;

window.dxy = function(angle, dist) {
    var dx = 0; var dy = 0;
    if (true) {
        var inc_x = angle > 90 && angle < 270 ? -1 : 1;

        dx /*+=*/= inc_x;

        // tan(th) = opp / adj;
        // adj is x or the run
        var rise = Math.tan(angle*Math.PI/180.0);// * 180.0/Math.PI;// * dx;
        var m = rise; //Math.tan(angle);
        var b = 0; // player is origin, angle crossing origin

        dx = /*2*/dist*Math.cos(angle*Math.PI/180.0);  // SOH [CAH] TOA
        dy = (m*(/*x+*/dx) + b);
        //dy *= -1;
    }
    //console.log(dx,dy);
    return { dx: dx, dy: dy };
};

window.deg_0_359 = function(a, b) {
    var ang=Math.atan2(b.y-a.y,b.x-a.x);//*(180.0/Math.PI);
    ang *= 180 / Math.PI;
    if (ang<0) ang = 360+ang;
    return ang;   
};

window.nearest_45 = function(a, b, deg) {
//    console.log('a,b', a,b);
    var angles=[0,45,90,135,180,225,270,315]
    var ang = deg;
//    console.log('non-normalized angle', ang);

    var nearest_angle=angles[0];//900;
    for (var i=0;i<angles.length;i++) {
        if (Math.abs(angles[i]-ang)<Math.abs(nearest_angle-ang)) nearest_angle=angles[i];
    }
    //if (nearest_angle!=0)
//    console.log('nearest', nearest_angle)    
    return nearest_angle;
};

window.resolveClick = function(id, w, h, from, to, obstacleSets, compressed) {

    let fromYInst = new Y(from.y, YType.Geom);
    let toYInst = new Y(to.y, YType.Geom);

    var distf = (x1,y1,x2,y2) => {
        return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
    };
    let find = (source, target) => {
        return window.pathFind(id, 1280, 720, source, target, obstacleSets, compressed);
    }
    let test = (source, target) => {
        return true;
        console.log('test', source, target);
        return window.pathTest(id, 1280, 720, source, target, obstacleSets, compressed);
    };

    var click = { x: to.x, y: toYInst.geomY() };
    var inBounds = test(
        {x: from.x, y: fromYInst.geomY()},
        {x: click.x, y: toYInst.geomY()}
    );
    var resolved = false;
    var adjClick = { x: click.x, y: toYInst.geomY() };
    var adjStart = { x: from.x, y: fromYInst.geomY() };

    if (inBounds) {
        resolved = true;
    } else {
        var fullDist = distf(from.x,fromYInst.geomY(), click.x, toYInst.geomY());
        console.warn(fullDist, distf(from.x,from.y, click.x, click.y));
        // optimize for 10 pathFind calls
        var ratio = /*parseInt(*/fullDist / 10.0;/*);*/
        // to increase responsiveness, decrease the number of pathFind calls
        // for better accuracy (get closer to boundary), increase the number of pathFind calls

        var incrDist = ratio; // fullDist / 5.0;
        //console.warn(from, click, fullDist, 5.0, incrDist);
        // var incrDist = 35;
        let a = angle;
        while ((fullDist > 10) && (fullDist - 10 > incrDist)) {
            var dxy = window.dxy((a+180)%360, incrDist);
            adjClick = { x: click.x+parseInt(dxy.dx), y: toYInst.geomY()+parseInt(dxy.dy) };
            if (test({x: from.x, y: fromYInst.geomY()}, adjClick)) {
                resolved = true;
                break;
            }
            incrDist += ratio; //35;
            //incrDist *= 1.75;
        }
    }

    var safeXY = nearest_safe_point(adjClick.x, new Y(adjClick.y,YType.Geom).domY());
    safeXY.y = new Y(safeXY.y).geomY(); //720-adjClick.y;
    if (false/*todo: can remove block?*/ && !test(adjClick /*geomY*/, safeXY /*geom Y*/)) {
        // if player won't be able to walk from the target to the target's
        // nearest safe point, then just have the player walk to the nearest
        // safe point.
        // This fixes a bug spotted on B8 where clicking on top-right most area
        // within road boundary while being at the bottom-right most area within
        // the road boundary results in the player going and staying outside the
        // road boundary.
        //find(safeXY);
        //adjClick = safeXY;

        adjStart = window.nearest_safe_point(adjStart.x, new Y(adjStart.y, YType.Geom).domY());
        adjStart.y = new Y(adjStart.y, YType.Dom).geomY();
        //adjStart.x -= parseInt(offX);
        //adjStart.y -= parseInt(offY);

        console.warn("finding safe path from, to", adjStart, safeXY)
        inBounds = true;
        resolved = true;
        console.warn(adjStart);
        console.warn('re-assigning to', adjStart);
        //window.setp(adjStart.x, (720-adjStart.y));
        //window.goto_nearest_safe(from.x, 720-from.y); //adjStart.x, (720-adjStart.y));

        // the solution of finding the nearest safe point was buggy too,
        // until a more permanent fix just do exactly what the recenter button
        // does if player is stuck outside the bounds:

        //window.goto_nearest_safe(640,360); // recenter
        console.warn("ERROR!", adjStart, adjClick, safeXY, from, to);
        return { inBounds: false, resolved: true };
    }
    console.warn(find(adjStart, adjClick));
    return {
        inBounds,
        resolved
    };
}

window.pnc = function(x, y) {
    window.clickTarget = { x: x, y: y };
    var playerX = parseInt(
        window.getComputedStyle(player)
            .left
            .replace("px", "")
    );
    var playerY = parseInt(
        window.getComputedStyle(player)
            .top
            .replace("px", "")
    );
    var w= plyrsz[window.nearest_45(0,0,angle)+""].w;//use variable to improve performance
    var h=plyrsz[window.nearest_45(0,0,angle)+""].h;//use variable to improve performance

    playerX += (w/2.0);
    playerY += (h/2.0);

    var [a, b] = [{x: playerX, y: 720-playerY}, {x: x, y: 720-y}];
    angle = deg_0_359(a, b);

    speedf = 1; // speedf = (speedf + 1) % 4; // 0 thru 3 speeds
    // 48 x 43
    //playerX += 24; // player center x
    //playerY += 22; // player center y
    var ang45 = window.nearest_45(a, b, angle);

    var el=document.getElementById("player");
    el.src="images/player"+ang45+".png";

    if (ang45 == 0 || ang45 >= 180) {
        el.src="images/player"+ang45+".gif";
    }

//gameloop();
    //pnc_q.push({a: {x: playerX, y: 720-playerY}, b: {x: x, y: 720-playerY}});
    //pnc_q.push({a: {x: x, y: playerY}, b: {x: x, y: y}});

    if (window.origAngle == null) {
        window.origAngle = angle;
    }
};
