const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const config = require('../config.json');
const ChannelsManager = require("../channels-manager");

var embedResponse = null;

module.exports = class CommandsCommand {

    constructor() {
        this.name = 'commands'
        this.alias = ['cmd']
        this.usage = this.name
        this.desc = "Bot commands."
    }

    run(client, msg, args) {
        (async () => {            
            try {
                var channelConfig = await ChannelsManager.asyncGetChannel(msg.channel.id);
                if (channelConfig == null)
                    return;

                // Embed factory 
                if (embedResponse == null) {   
                    const folder = __dirname + "/";
                    const fs = require("fs");
                    const files = fs.readdirSync(folder);
                    files.filter(f => fs.statSync(folder + f).isDirectory())
                        .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
                    
                    const jsFiles = files.filter(f => f.endsWith('.js'));
                    if (files.length <= 0) 
                        throw new Error('No commands to load!');
            
                
                    embedResponse = new Discord.RichEmbed()
                    .setTitle("Commands")
                    .setDescription("Optional argument are denoted by () and required arguments are denoted by []. View admin commands: \'" + config.prefix + " commands -a\'.");
                    
                    const prefix = config.prefix;
                    var showAdminCommands = args.length > 0 && args[0].toLowerCase() == "-a";
                    
                    for (const f of jsFiles) {
                        const file = require(folder + f);
                        const cmd = new file();
                        if ((typeof cmd.adminCommand === 'undefined' && !showAdminCommands) || // Only show public commands
                            (typeof cmd.adminCommand !== 'undefined' && cmd.adminCommand && showAdminCommands)) { // Only show admin commands
                                embedResponse.addField(prefix + cmd.usage, cmd.desc + "\n");
                        }   
                    }
                }
                // Customize color
                embedResponse.setColor(channelConfig.color? channelConfig.color : config.embedcolor);
                if (msg.member.guild.me.hasPermission("MANAGE_MESSAGES")) 
                    msg.delete();
                msg.channel.send(embedResponse);    
            } catch (err) {
                console.log(err);
            }
        })();
    }
}