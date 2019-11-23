const wc3stats = require("../controllers/wc3stats");
const config = require('../config.json');
const Discord = require('discord.js');
const MathUtils = require("../utils/mathutils");
const MessageUtils = require("../utils/messageutils");
const CommandUtils = require("../utils/commandutils");
const ChannelsManager = require("../channels-manager");

function getCommandPlayerName(msg, args) {
    if (args.length > 0) {
        return args[0].toLowerCase();
    }
    var name =  msg.member.nickname;
    if (name == null) {
        name = msg.author.username;
    }
    return name.toLowerCase();
}

module.exports = class StatsCommand {

    constructor() {
        this.name = 'stats'
        this.alias = ['st']
        this.usage = this.name + " (player) (-map [name]) (-season [index])"
        this.desc = 'Reveals player stats for the current of specified season.'
    }

    run(client, msg, args) {
        (async () => {      
            
            var channelConfig = await ChannelsManager.asyncGetChannel(msg.channel.id);
            if (channelConfig == null)
                return;
    
            var username = getCommandPlayerName(msg, args);

            var mapName = CommandUtils.getMapFromArgs(args);
            if (mapName == null)
                mapName = channelConfig.map;

            var season = CommandUtils.getSeasonFromArgs(args);
            if (season == null) 
                season =channelConfig.season;
            
            var profiles = await wc3stats.fetchUserProfileByMap(mapName, username, season);
            if (profiles === "No results found.") {
                msg.channel.send(MessageUtils.error("No results found for {" + username + ", " + mapName + ", " + season + "}."));
                return;
            }
            var modeStr = "";
            var score = "";
            var ratio = "";
            var displayName;
            for (var i = 0; i < profiles.length; i++) {
                var stats = await (wc3stats.fetchUserStatsByIdAndMap(profiles[i].id, mapName, username, season));
                displayName = stats.name;
                modeStr += stats.key.mode + "\n";
                score += stats.wins + " - " + stats.losses + "\n";
                ratio += (MathUtils.ratio(stats.wins, stats.losses + stats.wins)*100).toFixed(1) + "%\n";
            }
            var embed = new Discord.RichEmbed()
                .setColor(config.embedcolor)
                .setTitle(displayName)
                .setURL('https://wc3stats.com/players/' + username)
                .addField('Mode', modeStr, true)
                .addField('Score', score, true)
                .addField('Ratio', ratio, true);
            msg.channel.send(embed);
        })();
    }
}
