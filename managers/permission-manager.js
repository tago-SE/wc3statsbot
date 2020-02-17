const config = require('../config.json');

module.exports = class Permissions {

    static isBotOwner(msg) {
        return config.owners.includes(msg.author.username + "#" + msg.author.discriminator);
    }

    static hasAdminRights(msg) {
        return Permissions.isBotOwner(msg) || msg.member.hasPermission("ADMINISTRATOR");
    }

}