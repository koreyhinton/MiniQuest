// PATH GRID
window.pathG = { id: null, value: null };
window.PathGrid = class {
    constructor({w, h}) {
        this.grid = new PF.Grid(w, h);
    }
    clear() {
        for (var x=0; x<this.grid.width; x++)
        for (var y=0; y<this.grid.height; y++)
            this.grid.setWalkableAt(x, y, true);
    }
    addObstacleSets(obstacleSets, compressed) {
        var fullObsSet = [];
        var last = null;
        //var maxIter = 15;
        //console.warn(obstacleSets[0]);

        let savePoints = '"boundary": [';
        let saveMin = '"boundary": [';
        if (compressed != null) {
            obstacleSets = [];
            fullObsSet = PF.Util.expandPath(compressed);
        }

        for (var i=0; i<obstacleSets.length; i++)
        for (var j=0; j<obstacleSets[i].length; j++)
        {
            var obs = obstacleSets[i][j];
            /* if (obs.x == null || obs.x > 1280 || obs.y == null || this.grid.height == null || this.grid.height - obs.y > 720 || this.grid.height - obs.y < 0) {
                console.warn('setWalkable error, obs:, grid.height:', obs, this.grid.height);
            }*/
            var firstIt = last == null;
            if (firstIt) {// || obs.x > 1280 || obs.x < 0 || obs.y > 720 || obs.y < 0) {
                last = { x: obs.x, y: this.grid.height - obs.y };
                // data error (on transition from cell D9 to cell D8)
                continue;
            }

            saveMin += `[${obs.x},${this.grid.height-obs.y}],`;

            var points = new PF.AStarFinder()
                .findPath(last.x, last.y, obs.x, this.grid.height-obs.y, this.clone());
            /*for (var k=0; k<points.length; k++) {
                var x = points[k][0];
                var y = points[k][1];
                this.grid.setWalkableAt(x, y, false);
            }*/
            //fullObsSet.push(points);
            fullObsSet = fullObsSet.concat(points);
            last = { x: obs.x, y: this.grid.height - obs.y };
            // console.log('compressed:', PF.Util.compressPath(points).length, points.length);
        }
        //console.log('fullObsSet', fullObsSet);
        /*for (var i=0; i<fullObsSet.length; i++)*/
        for (var i=0; i<fullObsSet.length; i++)
        {
            var x = fullObsSet[i][0];
            var y = fullObsSet[i][1];
            if (compressed == null) {
                savePoints += `[${x},${y}],`;
            }
            // console.log('not walk', x, y);
            this.grid.setWalkableAt(x, y, false);
        }
        savePoints += '],';
        saveMin += '],';
        console.log(saveMin);
        console.log(savePoints);
        // console.warn(this.grid);
    }
    clone() {
        return this.grid.clone();
    }
};

// PATH QUEUE
window.pathQ = { values: [] };

// PATH TEST
// call this if you don't want it to update the PathQ
window.pathTest = function(id, w, h, from, to, obstacleSets, compressed) {
    let values = new PF.AStarFinder({allowDiagonal: true,dontCrossCorners:true}) /*AStarFinder*/ /*BestFirstFinder()*/
        .findPath(from.x, from.y, to.x, to.y, window.pathG.value.clone());
    return values.length > 0;
};

// PATH FIND
window.pathFind = function(id, w, h, from, to, obstacleSets, compressed) {

    // step 1 - sync up path grid
    let firstCall = (window.pathG.id == null);
    let obstacleSwap = (window.pathG.id !== id);
    if (firstCall) {
        window.pathG.value = new PathGrid({w, h});
    } else if (obstacleSwap) {
        window.pathG.value.clear();
    }
    window.pathG.id = id;
    if (firstCall || obstacleSwap) {
        window.pathG.value.addObstacleSets(obstacleSets, compressed);
    }

    if (obstacleSwap) return;

    /*
    let firstRun = window.track == null;
    window.track = "";
    let heur = (dx, dy) => {
        if (this.minDx == null) {
            this.minDx = dx;
            this.minDy = dy;
        }
        this.minDx = Math.min(dx, this.minDx);
        this.minDy = Math.min(dy, this.minDy);
        if (Math.min(dx, dy) > Math.min(this.minDx, this.minDy)) {
            console.log("return 0");
            return 0;
        }
        if (firstRun) {
            window.track += `${dx},${dy}
`;
        }
        return Math.min(Math.min(dx, dy), Math.min(this.minDx, this.minDy));
    };
    */


    let clonedGrid = window.pathG.value.clone();

    // step 2 - re-assign path queue
    window.pathQ.values = new PF.AStarFinder({allowDiagonal: true,dontCrossCorners:true/*, heuristic: heur*/}) /*AStarFinder*/ /*BestFirstFinder()*/
        .findPath(from.x, from.y, to.x, to.y, clonedGrid);
    // console.log("Clone: ", clonedGrid.nodes.filter((nds) => nds.filter((n) => n.h != null).length > 0));

    if (pathQ.values.length == 0) {
        let minNode = clonedGrid.nodes[0][0];
        let minH = 1280;
        for (var i=0; i< clonedGrid.nodes.length; i++) {
            for (var j=0; j<clonedGrid.nodes[i].length; j++) {
                if (clonedGrid.nodes[i][j].h != null) {
                    if (clonedGrid.nodes[i][j].h < minH) {
                        minNode = clonedGrid.nodes[i][j];
                        minH = clonedGrid.nodes[i][j].h;
                    }
                    //console.log(i,j,clonedGrid.nodes[i][j]);
                    //break;
                }
            }
        }
        window.pathQ.values = new PF.AStarFinder({allowDiagonal: true,dontCrossCorners:true/*, heuristic: heur*/}) /*AStarFinder*/ /*BestFirstFinder()*/
            .findPath(from.x, from.y, minNode.x, minNode.y, window.pathG.value.clone());
        console.log('found new path', window.pathQ.values);
    }

    if (window.pathQ.values.length > 0)
        window.pathQ.values = PF.Util.expandPath(PF.Util.smoothenPath(window.pathG.value.clone(), window.pathQ.values));

    //todo 1: (fixes character slightly exceeding oundary) upon arrival,
    //        check if the nearest safe point is reachable via pathFind
    //        and if it is not then move right to the nearest safepoint

    //todo 2: (fixes character doesn't move when clicking beyond boundary)
    //        when click results in no paths, then use the original line
    //        algorithm by retrying the find a point Dist(player, click) - 100
    //        until Dist(player, adjustedClick) < 100

    // todo: need to fix the B8, doesn't properly avoid the road barrier on
    // clicking to move the full length of the road.
    // Either the code or the road points need to cover every outline point
    // somehow
    console.warn('pathlen', window.pathQ.values.length);
    return window.pathQ.values.length > 0;
};
