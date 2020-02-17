const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const config = require('../config.json');
const ChannelsManager = require("../managers/channel-settings-manager");

var embedResponse = null;

var embedPublicCommands = null;
var embedAdminCommands = null;

/**
 * Produces the embeded commands at run-time. 
 */
function initEmbedCommands() {
    const folder = __dirname + "/";
    const fs = require("fs");
    const files = fs.readdirSync(folder);
    files.filter(f => fs.statSync(folder + f).isDirectory())
        .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
    
    const jsFiles = files.filter(f => f.endsWith('.js'));
    if (files.length <= 0) 
        throw new Error('No commands to load!');

    embedAdminCommands = new Discord.RichEmbed()
        .setTitle("Commands (Admin)")
        .setDescription("Optional argument are denoted by () and required arguments are denoted by []. View admin commands: \'" + config.prefix + "commands -a\'.");
    embedPublicCommands = new Discord.RichEmbed()
        .setTitle("Commands")
        .setDescription("Optional argument are denoted by () and required arguments are denoted by []. View admin commands: \'" + config.prefix + "commands -a\'.");

    
        
    for (const f of jsFiles) {
        const file = require(folder + f);
        const cmd = new file();
        
        if (typeof cmd.adminCommand === 'undefined' || !cmd.adminCommand) {
            embedPublicCommands.addField(config.prefix + cmd.usage, cmd.desc + "\n");
        } else if (cmd.adminCommand) {
            embedAdminCommands.addField(config.prefix + cmd.usage, cmd.desc + "\n");
        }
    
    }
    
    
}
setTimeout(initEmbedCommands, 10); // initialize default embeded message after short delay



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

                var showAdminCommands = args.length > 0 && args[0].toLowerCase() == "-a";
                if (showAdminCommands) {
                    embedAdminCommands.setColor(channelConfig.color? channelConfig.color : config.embedcolor);
                    msg.channel.send(embedAdminCommands);    
                } else {
                    embedPublicCommands.setColor(channelConfig.color? channelConfig.color : config.embedcolor);
                    msg.channel.send(embedPublicCommands);    
                }
                if (msg.member.guild.me.hasPermission("MANAGE_MESSAGES")) 
                    msg.delete();
            } catch (err) {
                console.log(err);
            }
        })();
    }
}