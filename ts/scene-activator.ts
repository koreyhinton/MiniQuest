type Rect = { x1: number, y1: number, x2: number, y2: number };
import {State} from './state.js';
export class SceneActivator extends State {
    //getActive: ()=>boolean;
    //setActive: (val: boolean)=>void;
    constructor() {
        super('SA_STATE', 'active', false);
        // this.setState('active', false);
    }
    next() {
        super.setState('active', false); //this.setActive(false);
    }
    active(): boolean {
        return super.getState('active'); //.getActive();
/*
        if (this.isActive) return true;
        var rect={}
        rect.x1=x+(1.0/6.0*w);//dx;
        rect.y1=y+(1.0/6.0*h);//;+dy;
        rect.x2=rect.x1+w+(1.0/6.0*w);
        rect.y2=rect.y1+h+(1.0/6.0*h);

        return !(window as any).inside_rect(map[idx].exits[i].dots, rect);
*/
    }
    sceneExit(mapCell: any, rect: Rect) {
        for (var i=0;i<mapCell.exits.length;i++) {
            if ((window as any).inside_rect(mapCell.exits[i].dots, rect)) {
                return mapCell.exits[i].name;
            }
        }
        return null;
    }
    tryActivate(mapCell: any, rect: Rect) {
        if (this.active()) {
            return;
        }
        //console.log('try', this.sceneExit(mapCell, rect));
        super.setState('active', null == this.sceneExit(mapCell, rect));
    }
}

(window as any).SceneActivator = SceneActivator;
