const wc3stats = require("../api/wc3stats");
const config = require('../config.json');
const Discord = require('discord.js');
const MessageUtils = require("../utils/messageutils");
const CommandUtils = require("../utils/commandutils");
const ChannelsManager = require("../managers/channel-settings-manager");
const Wc3ColorManager = require("../managers/wc3-color-manager");

const MAX_NUMBER_OF_PLAYERS = 24;

module.exports = class ReplayCommand {

    constructor() {
        this.name = 'replay'
        this.alias = ['rep']
        this.usage = this.name + " [id]";
        this.desc = 'Replay information.'
    }

    run(client, msg, args) {
        (async () => {  
            var channelConfig = await ChannelsManager.asyncGetChannel(msg.channel.id);
            if (channelConfig == null)
                return;
                
            if (args.length == 0) {
                msg.channel.send(MessageUtils.error("Need to specify a game id."));
                return;
            }
            const id = parseInt(args[0]);
            if (isNaN(id)) {
                msg.channel.send(MessageUtils.error("Invalid replay id {" + id + "}"));
                return;
            }
            var [result, replay] = await Promise.all([
                wc3stats.fetchResultById(id), 
                wc3stats.fetchReplayById(id) 
            ]);
            if (replay === "No results found." || result === "No results found." ) {
                msg.channel.send(MessageUtils.error("Failed to find results for {" + id + "}."));
                return;
            }
            result = result[0];

            var title = result.key.map + " #" + result.replayId;
            var description = result.key.season;
            var timestamp = result.timestamp*1000;
            var timeInSeconds = replay.length
            var gameDuration = new Date(null, null, null, null, null, timeInSeconds).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
            var mapRequest = result.key.map.split(' ').join('-').toLowerCase();
            
            var maxShownPlayers = MAX_NUMBER_OF_PLAYERS;
            var tryAgain = false; 

            // Because Rich Embeds may fail if too many characters are used we try to create it inside a do while-loop. Each time it fails 
            // we reduce the maximum number of players that are shown in the result.
            do {
                var playerStr = "";
                var changeStr = "";
                var ratingStr = "";

                var curShownPlayers = 0;
                tryAgain = false;

                for (var i = 0; i < result.teams.length; i++) {
                    var team = result.teams[i];
                    for (var j = 0; j < team.players.length && curShownPlayers < maxShownPlayers; j++) {
                        var player = team.players[j];
                        var colorEmoji = Wc3ColorManager.getClientColorEmoji(client, player.colour);
                        playerStr += ((colorEmoji)? colorEmoji + " " : "") + player.placement + ". " + player.name + " (" + player.apm + ")\n";  
                        changeStr += ((player.change > 0)? "+": "") + player.change +"\n";
                        ratingStr += player.rating + "\n";
                        curShownPlayers++;
                    }
                }
                try  {
                    const embdedResult = new Discord.RichEmbed()
                    .setColor(channelConfig.color? channelConfig.color : config.embedcolor)
                    .setTitle(title)
                    .setDescription("[" + description + "](" + "https://wc3stats.com/" + mapRequest + ") ")
                    .setURL('https://wc3stats.com/games/' + result.replayId)
                    .addField('Player', playerStr, true)
                    .addField('Change', changeStr, true)
                    .addField('Rating', ratingStr, true)
                    .setTimestamp(new Date(timestamp))
                    .setFooter(gameDuration, channelConfig.footer);
                    msg.channel.send(embdedResult);  
                } catch (err) {
                    tryAgain = true;
                    if (maxShownPlayers == MAX_NUMBER_OF_PLAYERS) {
                        maxShownPlayers = curShownPlayers; 
                    }
                    maxShownPlayers--;
                }
            } while (tryAgain && maxShownPlayers > 0);
            
        })();
    }
}
