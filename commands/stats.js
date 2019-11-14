const wc3stats = require("../controllers/Wc3Stats");
const config = require('../config.json');
const Discord = require('discord.js');
const userLimit = 15;

module.exports = class ScoreboardCommand {

    constructor() {
        this.name = 'stats'
        this.alias = ['st']
        this.usage = this.name;
        this.desc = 'Display user stats'
    }

    run(client, msg, args) {
        (async () => {            
            var profiles = await wc3stats.fetchUserProfileByMap("Risk Reforged", "cornzee");
            var id = profiles[0].id;
            console.log(profiles[0].id);
            var user = await (wc3stats.fetchUserStatsByIdAndMap(id, "Risk Reforged"));

            console.log("wins: " + user.wins);

            console.log(user);


            msg.channel.send(new Discord.RichEmbed()
                .setColor(config.embedcolor)
                .setTitle(user.name)
                .setDescription("Current winstreak of " + user.winstreak + " and a record of " + user.bestWinstreak)
                .addField('Wins', user.wins, true)
                .addField('Losses', user.losses, true)
            );
        })();
    }
}