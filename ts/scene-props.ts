import {State} from './state.js';
export class SceneProps extends State {
    constructor() {
        super('SP_STATE', 'props', []);
    }
    clear() {
        var props = super.getState('props');
        while (props.length > 0) {
            props.shift().remove();
        }
        super.setState('props', []);
    }
    d8(br: number = /*6*/3) {
        var els = [];
        var xPosArr = [80,180,280,380,680,780,880,980,1080];
        for (var i=0; i<9/*14*/; i++) {
            var sp = 0;
            if (i>br) {
                sp = 65;
            }
            var el = document.createElement("img");
            if (i % 3 == 0) {
                el.src = "images/foreground/reindeer/reindeer_flip.png";
            } else {
                el.src = "images/foreground/reindeer/reindeer.png";//golf_cart/golf_cart_small.png";
            }
            el.style.position = "absolute";
            el.style.left = 40+xPosArr[i]+'px'; // 40+(sp+(i*140/*85*/))+"px";
            el.style.top = "657px";//"658px";
            //el.style.width = "79px";
            //el.style.height = "64px";
            document.getElementById("game").appendChild(el);
            els.push(el);
        }
        var el = document.createElement("img");
        el.src = "images/foreground/santas-sleigh/santas-sleigh.png";
        el.style.position = "absolute";
        el.style.left = "508px";
        el.style.top = (720-75)+"px";
        els.push(el);
        document.getElementById("game").appendChild(el);
        super.setState('props', els);
    }
    c8() {
        var els = [];
        var br = 1;
        for (var i=0; i<5; i++) {
            var sp = 0;
            if (i>br) {
                sp = 25;
            }
            var el = document.createElement("img");
            el.src = "images/foreground/pine_trees.png";
            el.style.position = "absolute";
            el.style.left = (sp+(i*256))+"px";
            el.style.top = (720-192)+"px";
            document.getElementById("game").appendChild(el);
            els.push(el);
        }
        super.setState('props', els); //this.d8(5);
    }
    e9() {
        var el = document.createElement("img");
        el.src = "images/foreground/pond.gif";
        el.style.left = "0px";
        el.style.top = (720-300)+"px";
        el.style.position = "absolute";
        document.getElementById("game").appendChild(el);
        super.setState('props', [el]);
    }
}
(window as any).SceneProps = SceneProps;
