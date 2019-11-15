const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const Discord = require('discord.js');
const userLimit = 15;

module.exports = class ScoreboardCommand {

    constructor() {
        this.name = 'scoreboard'
        this.alias = ['sb']
        this.usage = this.name + " (rank)";
        this.desc = 'Shows player ranking starting from the provided number.'
    }

    run(client, msg, args) {

        var names = "";
        var winLossRatios = "";
        var ratings = "";
        var first = 0;

        if (args.length > 0 && !isNaN(args[args.length - 1])) {
            first = parseInt(args[args.length - 1]);
            args.pop();
            if (first < 0) 
                first = 0;
        }
        var mapName = config.map.name;    // default map name
        if (args.length > 0) {
            mapName = args.join(' ');
        } 

        // TODO - make it possible to specify which season
        var season = config.map.season;

        (async () => {            
            try {
                var users = await wc3stats.fetchTopRankedUsersByMap(mapName, first + userLimit, season);
                if (users === "No results found.") {
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
