const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const Discord = require('discord.js');
const MessageUtils = require("../utils/messageutils");
const CommandUtils = require("../utils/commandutils");

module.exports = class ReplayCommand {

    constructor() {
        this.name = 'replay'
        this.alias = ['rep']
        this.usage = this.name + " [id] (-season [index])";
        this.desc = 'Reveals data from a uploaded replay.'
    }

    run(client, msg, args) {
        if (args.length == 0) {
            msg.channel.send(MessageUtils.error("Need to specify a game id."));
            return;
        }
        const id = parseInt(args[0]);
        if (isNaN(id)) {
            msg.channel.send(MessageUtils.error("Invalid replay id {" + args[0] + "}"));
            return;
        }

        var season = CommandUtils.getSeasonFromArgs(args);
        if (season == null) 
            season = config.map.season;
        
        (async () => {  
            var [result, replay] = await Promise.all([
                wc3stats.fetchResultById(id, season), 
                wc3stats.fetchReplayById(id, season) 
            ]);
            if (replay === "No results found." || result === "No results found.") {
                msg.channel.send(MessageUtils.error("Failed to find results for {" + args[0] + "}. This might be because it was posted during a previous season."));
                return;
            }
            result = result[0];
            var playerStr = "";
            var ratingStr = "";
            for (var i = 0; i < result.teams.length; i++) {
                var team = result.teams[i];
                for (var j = 0; j < team.players.length; j++) {
                    var player = team.players[j];
                    playerStr += player.placement + ". " + player.name + " (" + player.apm + ")\n";  
                    ratingStr += ((player.change > 0)? "+": "") + player.change +"\n";
                }
            }
            var title = result.key.map + " #" + result.replayId;
            var description = result.key.season;
            var timestamp = result.timestamp*1000;
            var timeInSeconds = replay.length
            var gameDuration = new Date(null, null, null, null, null, timeInSeconds).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            var mapRequest = result.key.map.split(' ').join('-').toLowerCase();
            const embdedResult = new Discord.RichEmbed()
                .setColor(config.embedcolor)
                .setTitle(title)
                .setDescription("[" + description + "](" + "https://wc3stats.com/" + mapRequest + "/leaderboard)")
                .setURL('https://wc3stats.com/games/' + result.replayId)
                .addField('Player', playerStr, true)
                .addField('Rating change', ratingStr, true)
                .setTimestamp(new Date(timestamp))
                .setFooter(gameDuration, config.map.footer);
            msg.channel.send(embdedResult);  
        })();
    }
}
