export class State {
    //getState: (key: string)=>any;
    //setState: (key: string, val: any)=>void;
    stateName: string;
    getState(key: string): any {
        //console.warn(this.stateName);
        return (window as any)[this.stateName][key];
    };
    setState(key: string, val: any) {
//            console.log(self.stateName);
        (window as any)[this.stateName][key] = val;
    };
    constructor(stateName: string, key?: string, val?: any) {
        if (!(window as any).hasOwnProperty(stateName)) {
            this.stateName = stateName;
            (window as any)[stateName] = {};
            if (key != null) {
                console.warn('constructor', stateName, key, val);
                (window as any)[stateName][key] = val;
            }
        }
        this.stateName = stateName;
    }
}
