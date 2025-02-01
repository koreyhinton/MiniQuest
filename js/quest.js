window.quest = null;
window.questFrom = null;
window.buildCellSheet = function() {
    let keys = Object.keys(window.map);
    let cellSheet = {};
    keys.forEach(key => {
        if (!cellSheet.hasOwnProperty(key)) {
            cellSheet[key] = [];
        }
        let entrances = Object.keys(window.map[key].entrances);
        entrances.forEach(ekey => {
            if (cellSheet[key].indexOf(ekey) < 0) {
                if (key != "TEMPLATE") {
                    cellSheet[key].push(ekey);
                }
            }
        });
    });
    return cellSheet;
};
window.displayQuestHint = function(index) {
    if (window.quest == null) {
        return;
    }
    let cellSheet = window.buildCellSheet();
    let rp = new window.RoadPath(cellSheet, PF);
    let next = rp.nextDirection(index, window.quest);
    window.pointCompassDir(next);
};
window.displayQuestText = function(index) {
    let text = "";
    if (window.quest == null) {
        text = "Accept Quest";
    } else {
        if (window.questFrom == index) {
            text = "Quest Accepted";
        } else {
            text = "End Quest";
        }
    }
    document.getElementById("quest").innerHTML = text;
};
window.acceptQuest = function(index) {
    let cellSheet = window.buildCellSheet();
    let questFrom = index;
    let goal = "";
    if (index == "D9") {
        goal = "F7";
    } else {
        questFrom = "D9";
        goal = "F7"; // default goal
    }
    window.questFrom = questFrom;
    /*
    console.warn(cellSheet);
    console.warn(Object.keys(cellSheet));
    console.warn(cellSheet['D9']);
    */
    let rp = new window.RoadPath(cellSheet, PF);
    //console.warn(rp);
    let next = rp.nextDirection(index, goal);//"E9");
    window.quest = goal;
    window.pointCompassDir(next);
    //console.warn(next);
};
