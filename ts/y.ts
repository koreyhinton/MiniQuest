export enum YType {
    Dom,
    Geom//etric
}
export class Y {
    y: number;
    yType: YType;
    constructor(y: number, yType: YType) {
        this.y = y;
        this.yType = yType;
    }
    public domY() {
        if (this.yType == YType.Dom) {
            return this.y;
        }
        return 720 - this.y;
    }
    public geomY() {
        if (this.yType == YType.Geom) {
            return this.y;
        }
        return 720 - this.y;
    }
}

(window as any).Y = Y;
(window as any).YType = YType;
