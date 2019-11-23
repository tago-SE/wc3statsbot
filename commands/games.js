const dateFormat = require('dateformat');
const Discord = require('discord.js');

const wc3stats = require("../controllers/wc3stats");
const config = require('../config.json');
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

module.exports = class GamesCommand {

    constructor() {
        this.name = 'games'
        this.alias = ['g']
        this.usage = this.name + " (player)";
        this.desc = 'Lists the most recent games.'
    }

    run(client, msg, args) {

        var mapName = CommandUtils.getMapFromArgs(args);
        if (mapName == null)
            mapName = config.map.name;

        var season = CommandUtils.getSeasonFromArgs(args);
        if (season == null) 
            season = config.map.season;
         
        var username = getCommandPlayerName(msg, args);

        (async () => {  
            try {
                var replays = await wc3stats.fetchUserGamesByMapSeasonMode(username, mapName, season);
                if (replays === "No results found.") {
                    msg.channel.send(MessageUtils.error("No results found for {" + username + ", " + mapName + ", " + season + "}."));
                    return;
                }
                var ids = "";
                var dates = "";
                for (var i = replays.length - 1; i >= 0; i--) {
                    let replay = replays[i];
                    ids += "[#" + replay.id + "](" + "https://wc3stats.com/games/" + replay.id + ")\n";
                    dates += dateFormat(new Date(replay.playedOn*1000), "d/m/yyyy") + "\n";
                }
                msg.channel.send(new Discord.RichEmbed()
                .setColor(config.embedcolor)
                .setTitle(username)
                .addField('Replay', ids, true)
                //.addField('Result', results, true)
                .addField('Date', dates, true));
            } catch (err) {
                console.log(err);
            }
        })();
    }
}
