export class RoadCompass {
    nswe: any;
    constructor({n, s, w, e}: any) {
        this.nswe = {n,s,w,e};
    }
    n(): Boolean {
        return this.nswe.n;
    }
    s(): Boolean {
        return this.nswe.s;
    }
    w(): Boolean {
        return this.nswe.w;
    }
    e(): Boolean {
        return this.nswe.e;
    }
    any(): Boolean {
        return this.n() || this.s() || this.w() || this.e();
    }
    static at(currentKey: string, entranceKeys: any): RoadCompass {
        var n = false;
        var s = false;
        var w = false;
        var e = false;
        var from = currentKey;
        var fromX = from.charCodeAt(0);
        var fromY = parseInt(from.substring(1));
        for (var i=0; i<entranceKeys.length; i++) {
            var to = entranceKeys[i];
            var toX = to.charCodeAt(0);
            var toY = parseInt(to.substring(1));
            if (toY < fromY) n=true;
            if (toY > fromY) s=true;
            if (toX < fromX) w=true;
            if (toX > fromX) e=true;
        }
        return new RoadCompass({n,s,w,e});
    }
}
