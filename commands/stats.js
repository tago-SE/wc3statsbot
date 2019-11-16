const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const Discord = require('discord.js');
const MathUtils = require("../utils/mathutils");
const MessageUtils = require("../utils/messageutils");
const CommandUtils = require("../utils/commandutils");

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
        

        var mapName = CommandUtils.getMapFromArgs(args);
        if (mapName == null)
            mapName = config.map.name;

        console.log(args);

        var season = CommandUtils.getSeasonFromArgs(args);
        if (season == null) 
            season = config.map.season;
            
        console.log(args);

        var username = getCommandPlayerName(msg, args);

        (async () => {            
            var profiles = await wc3stats.fetchUserProfileByMap(mapName, username, season);
            if (profiles === "No results found.") {
                msg.channel.send(MessageUtils.error("No results found for {" + username + ", " + mapName + ", " + season + "}."));
                return;
            }
            var id = profiles[0].id;
            var user = await (wc3stats.fetchUserStatsByIdAndMap(id, mapName, username, season));
            msg.channel.send(new Discord.RichEmbed()
                .setColor(config.embedcolor)
                .setTitle(user.name + " #" + user.rank)
                .setURL('https://wc3stats.com/players/' + user.name)
                .setDescription("Has a current winstreak of " + user.winstreak + " and a record of " + user.bestWinstreak + ".")
                .addField('Wins', user.wins, true)
                .addField('Losses', user.losses, true)
                .addField('Ratio', MathUtils.ratio(user.wins, user.losses + user.wins).toFixed(2)*100 + "%", true)
            );
        })();
    }
}