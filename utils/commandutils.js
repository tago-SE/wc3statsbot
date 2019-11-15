module.exports = class CommandUtils {

    static getSeasonFromArgs(msg, args) {
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
        return config.map.season;   // default Season
    }

}