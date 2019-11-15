const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const Discord = require('discord.js');
const MessageUtils = require("../utils/messageutils");

module.exports = class ReplayCommand {

    constructor() {
        this.name = 'replay'
        this.alias = ['rep']
        this.usage = this.name;
        this.desc = 'Shows player ranking.'
    }

    run(client, msg, args) {
        if (args.length == 0) {
            msg.channel.send(MessageUtils.error("Need to specify a game id."));
            return;
        }
        const id = parseInt(args[0]);
        if (isNaN(id)) {
            msg.channel.send(MessageUtils.error("Invalid replay id {" + args[0] + "}"));
            return;
        }

        (async () => {     
            var replay = await wc3stats.fetchReplayById(id);     
            console.log(replay);    
        })();
    }
}
