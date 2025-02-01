//import * as PF from 'pathfinding';
// import { PF } from 'pathfinding';
import {RoadCompass} from './road-compass.js';
export class RoadPath {
    // subSheet9: type;
    grid: any;
    cellSheet: any;
    h: number;
    PF: any;
    constructor(cellSheet: any, PF: any) {
        this.cellSheet = cellSheet;
        this.PF = PF;
    }
    xy(cellName: string): any {
        let x = 3 * (cellName.charCodeAt(0)-'A'.charCodeAt(0)+1);
        let y = this.h - ( 3 * (parseInt(cellName.substring(1)) -1 + 1) );
        // +1, so -1 offset won't go below 0
        return {x,y};
    }
    buildGrid() {
        let keys = Object.keys(this.cellSheet).filter(k => k !== "TEMPLATE");
        let columns = [
            ...new Set(keys.map(a => a.charCodeAt(0)-'A'.charCodeAt(0)+1))
        ].sort((a,b)=>a-b);
        let rows = [
            ...new Set(keys.map(a => parseInt(a.substring(1))-1 +1 ))
        ].sort((a,b)=>/*a-b*/b-a);
        this.h = 3 * (rows.length)+2;
        // +1 so that a -1 offset doesn't go below 0
        console.log(columns);
        console.log(rows);
        console.log(keys);
        this.grid = new this.PF.Grid(3 * (columns.length)+2, 3 * (rows.length)+2);
        // +2 so it can account for +1 (don't go below 0) and +1 (allow +1 length for +1 offset)

        for (var i=0; i<keys.length; i++) {
            let compass = RoadCompass.at(keys[i], this.cellSheet[keys[i]]);
            let key = keys[i];
            let xy = this.xy(key);
            let x = xy.x;
            let y = /*this.h - */xy.y;
            if (!compass.any()) {
                [
                    [-1,-1],[-1,0],[-1,1],[0,-1],[1,0],[1,-1],[0,0],[0,1],[1,1]
                ].forEach(xy => {
                    this.grid.setWalkableAt(x+xy[0], y+xy[1], false);
                });
                continue;
            }
            let noWalk = [ [-1,-1], [1,1], [1,-1], [-1,1]  ];
            if (!compass.n()) {
                noWalk.push([0,1]);
            }
            if (!compass.s()) {
                noWalk.push([0,-1]);
            }
            if (!compass.w()) {
                noWalk.push([-1,0]);
            }
            if (!compass.e()) {
                noWalk.push([1,0]);
            }
            noWalk.forEach(xy => {
                //console.log(key, rows.length, columns.length);
                //console.log('test', x,y,xy,x+xy[0], y+xy[1], false);
                //try {
                this.grid.setWalkableAt(x+xy[0], y+xy[1], false);
                //} catch(e) { console.log(x,y,xy[0],xy[1]);  }
            });
        }
    }
    nextDirection(sourceCell: string, targetCell: string) {
        if (this.grid == null) this.buildGrid();
        let from = this.xy(sourceCell);
        let fromX = from.x;
        let fromY = /*this.h - */from.y;
        let xy = this.xy(targetCell);
        let x = xy.x;
        let y = /*this.h - */xy.y;
        let vals = new this.PF.AStarFinder({allowDiagonal: false})
            .findPath(fromX, fromY, x, y, this.grid.clone());
        console.warn('from road-path', fromX,fromY);
        console.warn('to road-path', vals);
        if (vals.length > 0) {
            let val = vals[0];
            let nextX = val[0];
            let nextY = val[1];
            if (vals.length>1 && nextX == fromX && nextY == fromY) {
                nextX = vals[1][0];
                nextY = vals[1][1];
            }
            if (nextX > fromX) return "e";
            if (nextX < fromX) return "w";
            if (nextY > fromY) return "n";
            if (nextY < fromY) return "s";
        } else { return ""; }
    }
    /*
    test() {
        new PathGrid({w, h});
        PF.grid(w,h);
        new PF.AStarFinder({allowDiagonal: false})
            .findPath(from.x, from.y, to.x, to.y, window.pathG.value.clone());
    }
    */
}

(window as any).RoadPath = RoadPath;
