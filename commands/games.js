const dateFormat = require('dateformat');
const Discord = require('discord.js');

const wc3stats = require("../controllers/wc3stats");
const config = require('../config.json');
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

module.exports = class GamesCommand {

    constructor() {
        this.name = 'games'
        this.alias = ['g']
        this.usage = this.name + " (player) (-map ['name']) (-season [index]) (-mode [name])";
        this.desc = 'Last played games by a specified player.'
    }

    run(client, msg, args) {
        (async () => {  
            try {
                var channelConfig = await ChannelsManager.asyncGetChannel(msg.channel.id);
                if (channelConfig == null)
                    return;

                var mode = CommandUtils.getModeFromArgs(args);  // can be null

                var mapName = CommandUtils.getMapFromArgs(args);
                if (mapName == null)
                    mapName = channelConfig.map;

                var season = CommandUtils.getSeasonFromArgs(args);
                if (season == null) 
                    season = channelConfig.season;
                
                var username = getCommandPlayerName(msg, args);

                var replays = await wc3stats.fetchUserGamesByMapSeasonMode(username, mapName, season, mode);
                if (replays === "No results found.") {
                    msg.channel.send(MessageUtils.error("No results found for {" + username + ", " + mapName + ", " + season + ", " + mode + "}."));
                    return;
                }

                var foundGameName = false;
                var ids = "";
                var dates = "";
                var results = "";
                for (var i = replays.length - 1; i >= 0; i--) {
                    let replay = replays[i];
                    // In game name is extracted from the first replay
                    if (!foundGameName) {
                        for (var j = 0; j < replay.players.length; j++) {
                            if (replay.players[j].name.toLowerCase() === username) {
                                username = replay.players[j].name;
                                foundGameName = true;
                                break;
                            }
                        }
                    }
                    ids += "[#" + replay.id + " " + replay.map + " | " + ((replay.mode)? replay.mode : "N/A") +"](" + "https://wc3stats.com/games/" + replay.id + ")\n";
                    if (replay.mode) 
                        results += ((replay.isWinner)? "Won" : "Lost") + "\n";
                    else 
                        results += "N/A\n";
                    dates += dateFormat(new Date(replay.playedOn*1000), "d/m/yyyy") + "\n";
                }
                msg.channel.send(new Discord.RichEmbed()
                .setColor(channelConfig.color? channelConfig.color : config.embedcolor)
                .setTitle(username)
                .setURL("https://wc3stats.com/players/" + username)
                .addField('Replay', ids, true)
                .addField('Result', results, true)
                .addField('Date', dates, true));
            } catch (err) {
                console.log(err);
            }
        })();
    }
}
