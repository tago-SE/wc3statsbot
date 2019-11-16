module.exports = class CommandUtils {

    
    /**
     * Takes a list of arguments and looks for a season key and the following argument. 
     * If not found null is returned. 
     * 
     * Example:
     *      
     *      args = ["-season", "1", "-map", "\'Risk Reforged\'", "-mode", "ffa"] returns "Season 1"
     * 
     * @param {*} args 
     */
    static getSeasonFromArgs(args) {
        for (var i = 0; i < args.length; i++) {
            if (args[i] === "-Season" || args[i] === "-season" || args[i] === "-s" || args[i] === "-S") {
                if (args.length > i + 1) {
                    var season = parseInt(args[i + 1]);
                    if (!isNaN(season)) {
                        args.splice(i, 2);
                        return "Season " + season;
                    }
                }
                break;
            }
        }
        return null;
    }

    /**
     * Takes a list of arguments and looks for a mode key and the following argument. 
     * If no mode was found it returns null. 
     * 
     * Example:
     *      
     *      args = ["-season", "1", "-map", "\'Risk Reforged\'", "-mode", "ffa"] returns "ffa"
     * 
     * @param {*} args 
     */
    static getModeFromArgs(args) {
        for (var i = 0; i < args.length; i++) {
            if ((args[i] === "-mode" || args[i] === "-Mode") && args.length > i + 1) {
                return args[i + 1];
            }
        }
        return null;
    }

    /**
     * Takes a list of arguments and looks for a map key and the following map name separated by 
     * ' or ". If no map name was found or the map name was not bound by ' ' it returns null. 
     * 
     * Example:
     *      
     *      args = ["-season", "1", "-map", "\'Risk Reforged\'", "-mode", "ffa"] returns "Risk Reforged"
     * 
     * @param {*} args 
     */
    static getMapFromArgs(args) {
        var mapKeyFound = false;
        var remainingArgs = [];
        for (var i = 0; i < args.length; i++) {
            if (args[i] === "-map" || args[i] === "-Map") {
               mapKeyFound = true;
            } else if (mapKeyFound) {
                remainingArgs.push(args[i]);  
            }
        }
        if (mapKeyFound) {
            remainingArgs = remainingArgs.join(' ').split(/['"]/);
            if (remainingArgs.length > 2) {
                return remainingArgs[1]; // found map argument
            }
        }
        return null;
    }

}