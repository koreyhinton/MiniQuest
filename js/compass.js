window.pointCompassDir = function(dir) {
    var c = document.getElementById("compass");
    if (dir == null) {
        c.src = `images/estrella.png`;
        return;
    }
    c.src = `images/point_${dir}.png`;
};
window.pointCompass = function(currentKey, entranceKeys) {
    var c = document.getElementById("compass");
    var n = "";
    var s = "";
    var w = "";
    var e = "";
    var from = currentKey;
    var fromX = from.charCodeAt(0);
    var fromY = parseInt(from.substring(1));
    for (var i=0; i<entranceKeys.length; i++) {
        var to = entranceKeys[i];
        var toX = to.charCodeAt(0);
        var toY = parseInt(to.substring(1));
        if (toY < fromY) n="n";
        if (toY > fromY) s="s";
        if (toX < fromX) w="w";
        if (toX > fromX) e="e";
    }
    c.src = `images/${n}${s}${w}${e}.png`;
};

window.compassAscii = function(i) {
    switch(i) {
        case "E6":
        case "E7":
        case "F7":
            return "%"; // sand
        case "B9":
        case "C8":
        case "D8":
        case "E8":
            return "^";//"T";
        case "B8":
        case "B10":
        case "B11":
        case "B12":
            return "#";
        case "F5":
        case "F5":
        case "G5":
        case "E5":
        case "E9":
            return `<a style='font-family: "Garamond"'>~</a>`;
    }
    return "'"; //"@";
}

window.toggleCompass = function(toggle) {

    if (!toggle) {
        let mapTile = document.getElementById("mapTile");
        if (mapTile != null) {
            mapTile.remove();
        }
        return;
    }

    let fac = 6.0; // factor // fac

    // 1280 x 720 (divide by 8)
    // 160 x 90
    /*
    if (window.mapVisibility=='hidden')
        window.mapVisibility='visible';
    else window.mapVisibility='hidden';
    document.getElementById('map').style.visibility=window.mapVisibility;
    */
    let pRect = new GeomEl(player).rect();
    var marker = document.createElement('div');
    marker.style.zIndex = "1000000";
    marker.innerHTML = "*";
    marker.style.fontSize = "33px"; // "44px";
    marker.style.color = "white";
    marker.style.textShadow = "1px 0 0 green, 0 -1px 0 green, 0 1px 0 green, -1px 0 0 green";
    marker.style.position = "relative";
    marker.style.left = (pRect.x1/fac) + 'px';
    marker.style.top = (pRect.y1/fac) + 'px';
    var tile = document.createElement('div');
    tile.style.zIndex = "1000000";
    tile.style.border = "1px solid black";
    tile.style.width = (1280/fac)+"px"; // 160
    tile.style.height = (720/fac)+"px"; // 90
    tile.style.position = "absolute";
    tile.style.left = parseInt(1280/2.0)+"px";
    tile.style.top = parseInt(720/2.0)+"px";
    tile.id = "mapTile";
    tile.style.backgroundColor = "rgba(0,0,0,0.1)";
    tile.appendChild(marker);
    game.appendChild(tile);


    let path = []; //[[146,236],[287,221],[626,190],[781,172],[934,157],[1274,131],[1275,12],[1075,39],[880,60],[684,84],[456,117],[280,149],[156,167],[5,187],[8,251],[146,236]]
    let entrances = map[window.idx].entrances;
    let mid = nearest_safe_point(parseInt(1280/2.0), parseInt(720/2.0));
    let midX = /*(1280 / 2.0)*/ parseInt(mid.x / fac);
    let midY = /*(720 / 2.0)*/ parseInt(new Y(parseInt(mid.y), YType.Dom).geomY()/fac); // no need to convert to geomY for center
    let walkPath = [];
    console.log('keys test 1', entrances[Object.keys(entrances)[0]]);

        var currentMark = document.createElement("div");
        currentMark.style.position = "absolute";
        currentMark.style.left = midX + "px";
        currentMark.style.top = (mid.y/fac-8) + "px";
        currentMark.innerHTML = compassAscii(window.idx); // "@";
        currentMark.style.zIndex = "1000001";
        currentMark.style.color = "white";
        currentMark.style.fontSize = "18px";
        currentMark.style.textShadow = "1px 0 0 green, 0 -1px 0 green, 0 1px 0 green, -1px 0 0 green";
        tile.appendChild(currentMark);


    Object.keys(entrances).forEach((k) => {
        let e = entrances[k];
        let x = e.x / fac ;
        let y = new Y(e.y, YType.Dom).geomY() / fac;
        //path.push([x,y]);
        //path.push([midX,midY]);

        var entranceMark = document.createElement("div");
        entranceMark.style.position = "absolute";
        entranceMark.style.left = x + "px";
        entranceMark.style.top = (e.y/fac-8) + "px";
        entranceMark.innerHTML = compassAscii(k); // "@";
        entranceMark.style.color = "white";
        entranceMark.style.fontSize = "18px";
        entranceMark.style.textShadow = "1px 0 0 red, 0 -1px 0 red, 0 1px 0 red, -1px 0 0 red";
        tile.appendChild(entranceMark);

        console.log('keys test', e.x, e.y, x, y, midX, midY);
        new PF.AStarFinder({allowDiagonal: false})
            .findPath(parseInt(x), parseInt(y), parseInt(midX), parseInt(midY), new PF.Grid(/*160*/parseInt(1280/fac), /*90*/parseInt(720/fac)))
            .forEach((pair) => {
                console.log('pair', pair);
                walkPath.push(pair);
            });
    });
    walkPath.forEach((pair) => {
        var dot = document.createElement("div");
        dot.style.backgroundColor = "red";
        dot.style.width="1px";
        dot.style.height="1px";
        dot.style.left = pair[0] + "px";
        dot.style.top = new Y(pair[1]*fac, YType.Geom).domY()/fac + "px";
        dot.style.position = "absolute";
        tile.appendChild(dot);
    });
    console.log('yeesh!', walkPath);
};
