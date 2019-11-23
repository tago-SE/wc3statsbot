const CommandUtils = require("../../utils/commandutils");
const ChannelsManager = require("../../channels-manager");
const MessageUtils = require("../../utils/messageutils");

module.exports = class ClearChannelCommand {

    constructor() {
        this.name = 'clear'
        this.alias = ['c']
        this.usage = this.name
        this.desc = "Purges configured bot settings and access from the targeted channel."
        this.adminCommand = true
    }

    run(client, msg, args) {
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
            return;
        }
        (async () => {            
            try {
                var result = await ChannelsManager.asyncRemoveChannel(msg.channel.id);
                if (result) {
                    msg.channel.send(MessageUtils.system("Cleared channel { id: " + msg.channel.id + " }"));
                } 
            } catch (err) {
                console.log(err);
            }
        })();
    }
}