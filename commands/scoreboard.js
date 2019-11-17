const Discord = require('discord.js');
const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const MessageUtils = require("../utils/messageutils");
const CommandUtils = require("../utils/commandutils");

const userLimit = 15;

function getFirstRankFromArgs(args) {
    if (args.length > 0) {
        var first = parseInt(args[0]);
        if (!isNaN(first)) {
            return first;
        }
    }
    return 0; // default
}

module.exports = class ScoreboardCommand {

    constructor() {
        this.name = 'scoreboard'
        this.alias = ['sb']
        this.usage = this.name + " (rank) (-season [index]) (-map 'name') (-mode [name])";
        this.desc = 'Shows player ranking starting from the provided number.'
    }

    run(client, msg, args) {

        var first = getFirstRankFromArgs(args);

        var season = CommandUtils.getSeasonFromArgs(args);
        if (season == null) 
            season = config.map.season;

        var mapName = CommandUtils.getMapFromArgs(args);
        if (mapName == null)
            mapName = config.map.name;

        var mode = CommandUtils.getModeFromArgs(args);

        var names = "";
        var winLossRatios = "";
        var ratings = "";
        
        (async () => {            
            try {
                var users = await wc3stats.fetchTopRankedUsersByMap(mapName, first + userLimit, season, mode);
                if (users === "No results found.") {
                    msg.channel.send(MessageUtils.error("No results found for {" + mapName + ", " + season + "}."));
                    return;
                }
                for (var i = first; i < users.length; i++) {
                    var user = users[i];
                    names += (i + 1) + ". [" + user.name + "](https://wc3stats.com/players/" + user.name  + ")\n";
                    winLossRatios += user.wins + " - " + user.losses + "\n";
                    ratings += user.rating + "\n"; 
                }
                if (names.length > 0) {
                    args = mapName.split(' ');
                    for (var i = 0; i < args.length; i++) {
                        args[i] = args[i].charAt(0).toUpperCase() + args[i].substring(1); 
                    }
                    var title = args.join(' ') + " Leaderboard";
                    var embed = new Discord.RichEmbed()
                        .setTitle(title)
                        .setURL("https://wc3stats.com/" +  args.join('-') + "/leaderboard")
                        .setDescription(season)
                        .setColor(config.embedcolor)
                        .addField("Player", names, true)
                        .addField("Score", winLossRatios, true)
                        .addField("Rating", ratings, true); 
                    msg.channel.send(embed);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }
}
