const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const Discord = require('discord.js');
const MessageUtils = require("../utils/messageutils");

module.exports = class ReplayCommand {

    constructor() {
        this.name = 'replay'
        this.alias = ['rep']
        this.usage = this.name;
        this.desc = 'Shows player ranking.'
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

        (async () => {     
            var result = await wc3stats.fetchResultById(id);
            result = result[0];
            var playerStr = "";
            var ratingStr = "";
            var kdStr = "";
            console.log(result.teams);
 
            console.log("number of teams: " + result.teams.length);
            for (var i = 0; i < result.teams.length; i++) {
                var team = result.teams[i];
                for (var j = 0; j < team.players.length; j++) {
                    var player = team.players[j];
                    playerStr += player.placement + ". " + player.name + " (" + player.apm + ")\n";  
                    ratingStr += ((player.change > 0)? "+": "") + player.change +"\n";
                }
            }

            var title = result.key.map + " #" + result.replayId;

            /*
            var players = result.scheme.teams.players;
            for (var i = 0; i < players.length; i++) 
            {
                var player = players[i];
                playerStr += player.name + " (" + player.apm + ")\n";  
                console.log(player.name);
            }
            */

            const embdedResult = new Discord.RichEmbed()
                .setColor(config.embedcolor)
                .setTitle(title)
                .setURL('https://wc3stats.com/games/' + result.replayId)
                .setDescription("desc")
                .addField('Players', playerStr, true)
                .addField('Rating', ratingStr, true)
                //.addField('K/D', kdStr, true)
               // .setTimestamp(new Date(replay.timestamp))
                .setFooter("duration", config.map.footer);
                //.setFooter(replay.turns + ' turns', 'https://cdn.discordapp.com/attachments/413107471222308864/614788523526193193/risk_avatar_trees_big.png');
            msg.channel.send(embdedResult);  
        })();
    }
}
