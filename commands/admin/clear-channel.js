const ChannelsManager = require("../../managers/channel-settings-manager");
const MessageUtils = require("../../utils/messageutils");
const Permissions = require("../../managers/permission-manager");

module.exports = class ClearChannelCommand {

    constructor() {
        this.name = 'clear'
        this.alias = ['c']
        this.usage = this.name
        this.desc = "Purges configured bot settings and access from the targeted channel."
        this.adminCommand = true
    }

    run(client, msg, args) {
        if (!Permissions.hasAdminRights(msg)) {
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