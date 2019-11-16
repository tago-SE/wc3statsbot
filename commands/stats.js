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

function getMapNameFromArgs(args) {
    var mapName = config.map.name;    // default map name
    if (args.length > 1) {
        args.splice(0, 1);
        mapName = args.join(' ');
    } 
    return mapName;
}

module.exports = class StatsCommand {

    constructor() {
        this.name = 'stats'
        this.alias = ['st']
        this.usage = this.name + " (player) (-map [name]) (-season [index])"
        this.desc = 'Reveals player stats for the current of specified season.'
    }

    run(client, msg, args) {
        

        var season = CommandUtils.getSeasonFromArgs(args);
        if (season == null) 
            season = config.map.season;
            
        var username = getCommandPlayerName(msg, args);
        var map = getMapNameFromArgs(args);

        (async () => {            
            var profiles = await wc3stats.fetchUserProfileByMap(map, username, season);
            if (profiles === "No results found.") {
                msg.channel.send(MessageUtils.error("No results found for {" + username + "}."));
                return;
            }
            var id = profiles[0].id;
            var user = await (wc3stats.fetchUserStatsByIdAndMap(id, map, username, season));
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