const Discord = require('discord.js');
const config = require('../config.json');
module.exports = class CommandsCommand {

    constructor() {
        this.name = 'help'
        this.alias = ['h']
        this.usage = this.name
        this.desc = "General information."
    }

    run(client, msg, args) {
        msg.channel.send(new Discord.RichEmbed()
            .setColor(config.embedcolor)
            .setTitle("Help")
            .addField("Participation", "To participate in the league you must attach your replays in this channel or upload them " +
            "directly to https://wc3stats.com/upload.")
            .addField("Auto-uploader", "You can use wc3stats-auto-uploader to enable automatic replay uploads to wc3stats.com.\n" +
            "Download: https://github.com/komodo123/wc3stats-auto-uploader.")
            .addField("Commands", "Type '!commands' to see a list of available commands.")
        );
    }
}