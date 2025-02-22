export class GeomEl {
    el: any;
    constructor(el: any) {
        this.el = el;
    }
    sty(): any {
        return (window as any).getComputedStyle(this.el);
    }
    rect(): { x1: number, y1: number, x2: number, y2: number } {
        let s = this.sty();
        let x1 = parseInt(s.left.replace("px", ""));
        let y1 = parseInt(s.top.replace("px", ""));
        let x2 = x1 + parseInt(s.width.replace("px", ""));
        let y2 = y1 + parseInt(s.height.replace("px", ""));
        return { x1, y1, x2, y2 };
    }
    centerXY(): { x: number, y: number } {

        let r = this.rect();
        let w = r.x2 - r.x1;
        let h = r.y2 - r.y1;
        let playerX = r.x1;
        let playerY = r.y1;

        // same center-point logic as pnc function
        playerX += (w/2.0);
        playerY += (h/2.0);

        let x = playerX;
        let y = playerY;

        return { x, y };
    }
}
(window as any).GeomEl = GeomEl;
