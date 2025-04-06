gameShellVars = { command: "", autocomplete: "" };
const gameShell = function(cmd, payload) {

    if (cmd == "load") {

        document.addEventListener('keyup', function(e) {
            e = e || window.event;
            if (e.key == "Backspace" && gameShellVars.command.length > 0) {
                gameShellVars.command = gameShellVars.command.substring(0, gameShellVars.command.length-1);
            } else if (e.key.length == 1) {
                gameShellVars.command += e.key;
            }
            
            console.log(e.key);
            console.log(gameShellVars.command);
            gameShell("render", idx);
        });

        addEventListener("DOMContentLoaded", _ => {
            gameShell();
        });
        return;
    }

    /* determine scene commands to add (if any) */
    var sceneIndex = idx == null ? 'D9' : idx;
    if (cmd == "render" && payload != null) {
        sceneIndex = payload;
    }
    var relativeCommands = map[sceneIndex].commands;
    relativeCommands = relativeCommands == null ? [] : relativeCommands;
    var commands = [
        ...relativeCommands,
        "find a way out of here"
    ];

    if (gameShellVars.command.length == 0) {
        gameShellVars.autocomplete = Array.from(
            new Set(
                commands.map((a) => a[0])
            )
        ).join(",");
    } else {
        for (var i=0; i<commands.length; i++) {
            if (commands[i].startsWith(gameShellVars.command)) {
                gameShellVars.autocomplete = commands[i];
                break;
            }
        }
    }


    document.getElementById("gameShell").innerHTML = `<div>
        &gt; <input prompt type="text" value="${gameShellVars.command}"/>
        <input overlay type="text" value="${gameShellVars.autocomplete}"/>
    </div>`;
};
