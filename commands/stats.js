const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const Discord = require('discord.js');
const MathUtils = require("../utils/mathutils");

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

function getMapName(args) {
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
        this.usage = this.name;
        this.desc = 'Display user stats'
    }

    run(client, msg, args) {
        var username = getCommandPlayerName(msg, args);
        var map = getMapName(args);
        (async () => {            
            var profiles = await wc3stats.fetchUserProfileByMap(map, username);
            console.log(profiles);
            if (profiles === "No results found.") {
                return;
            }
            var id = profiles[0].id;
            var user = await (wc3stats.fetchUserStatsByIdAndMap(id, map, username));
            console.log(user);
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