const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const config = require('../config.json');

module.exports = class CommandsCommand {

    constructor() {
        this.name = 'commands'
        this.alias = ['cmd']
        this.usage = this.name
        this.desc = "Reveal bot commands."
    }

    run(client, msg, args) {
        
        const folder = __dirname + "/";
        const fs = require("fs");
        const files = fs.readdirSync(folder);
        files.filter(f => fs.statSync(folder + f).isDirectory())
            .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
        const jsFiles = files.filter(f => f.endsWith('.js'));

        if (files.length <= 0) 
            throw new Error('No commands to load!');

        const embed = new Discord.RichEmbed().setColor(config.embedcolor).setTitle("Commands");
        const prefix = config.prefix;

        var showAdminCommands = args.length > 0 && args[0].toLowerCase() == "-a";
        if (showAdminCommands) {
            
        }

        for (const f of jsFiles) {
            const file = require(folder + f);
            const cmd = new file();
          
            if ((typeof cmd.adminCommand === 'undefined' && !showAdminCommands) || // Only show public commands
                (typeof cmd.adminCommand !== 'undefined' && cmd.adminCommand && showAdminCommands)) { // Only show admin commands
                    embed.addField(prefix + cmd.usage, cmd.desc + "\n");
                }
        }

        msg.delete();

        
        msg.channel.send(embed);

    }
}