const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const Discord = require('discord.js');

var userLimit = 15;

module.exports = class ScoreboardCommand {

    constructor() {
        this.name = 'scoreboard'
        this.alias = ['sb']
        this.usage = this.name;
        this.desc = 'Updates the scoreboard.'
    }

    run(client, msg, args) {
        var names = "";
        var winLossRatios = "";
        var ratings = "";
        var first = 0;
        if (args.length > 0 && !isNaN(args[0])) {
            first = parseInt(args[0]);
            if (first < 0) first = 0;
        }
    
        (async () => {            
            try {
                var users = await wc3stats.fetchTopRankedUsersByMap(config.map.name, first + userLimit);
                for (var i = first; i < users.length; i++) {
                    var user = users[i];
                    names += (i + 1) + ". [" + user.name + "](https://wc3stats.com/players/" + user.name  + ")\n";
                    
                    winLossRatios += user.wins + " - " + user.losses + "\n";
                    ratings += user.rating + "\n"; 
                }
                if (names.length > 0) {
                    var embed = ScoreboardCommand.getEmbededScoreboard(names, winLossRatios, ratings);  
                    msg.channel.send(embed);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }

    static getEmbededScoreboard(names, winLossRatios, ratings) {
        var title = config.map.name;
        var embed = new Discord.RichEmbed()
        .setTitle(title)
        .setColor(config.embedcolor)
        .addField("Player", names, true)
        .addField("Score", winLossRatios, true)
        .addField("Rating", ratings, true);
        return embed;
    }
}
