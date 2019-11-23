const CommandUtils = require("../../utils/commandutils");
const ChannelsManager = require("../../channels-manager");
const MessageUtils = require("../../utils/messageutils");

module.exports = class SetupChannelCommand {

    constructor() {
        this.name = 'set'
        this.alias = ['set']
        this.usage = this.name
        this.usage = this.name + " (-map ['name']) (-season [index]) (-footer [image-reference])"
        this.desc = "Configure bot settings on the targeted channel."
        this.adminCommand = true
    }

    run(client, msg, args) {

        if (!msg.member.hasPermission("ADMINISTRATOR")) {
            return;
        }
        var map = CommandUtils.getMapFromArgs(args); 
        var season = CommandUtils.getSeasonFromArgs(args);
        var footer = CommandUtils.getArgAfterKey(args, "-footer");

        (async () => {            
            try {
                var result = await ChannelsManager.asyncGetChannel(msg.channel.id);
                if (result == null)
                    result = {};
                if (map != null) 
                    result.map = map;
                if (season != null)
                    result.season = season;
                if (footer != null) 
                    result.footer = footer;
                if (footer != null || map != null || season != null)
                    result = await ChannelsManager.asynUpsertChannel(msg.channel.id, result);
                msg.channel.send(MessageUtils.system(
                    "Settings { id: " + result.id + ", " +
                    "map: " +  ((result.map !== 'undefined' && result.map)? "\"" + result.map + "\"" : "undefined") + ", " +
                    "season: " +  ((result.season !== 'undefined' && result.season)? "\"" + result.season + "\"" : "undefined") + ", " +
                    "footer: " +  ((result.footer !== 'undefined' && result.footer)? "\"" + result.footer + "\"" : "undefined") + " " +
                    "}"
                ));
            } catch (err) {
                console.log(err);
            }
        })();
    }
}