const fs = require('fs');

// Cache
var channels = [];

module.exports = class ChannelsManager {

    /**
     * Returns a list of all channels configured in the channels file. 
     */
    static async asyncGetChannels() {
        return await new Promise((resolve, reject) => {
            if (channels.length == 0) {
                fs.readFile('channels.json', (err, data) => {
                    if (err) 
                        reject(err);   
                    channels = JSON.parse(data);
                    resolve(channels);
                }); 
            } else {
                resolve(channels);
            }
        });
    }

    /**
     * Gets channel configuration by matching id
     * 
     * @param {String} channel_id 
     */
    static async asyncGetChannel(channel_id) {
        channels = await ChannelsManager.asyncGetChannels();
        for (var i = 0; i < channels.length; i++) {
            if (channels[i].id === channel_id) {
                return channels[i];
            }
        }
        return null;
    }

     /**
      * Inserts or updates a channel object into the channel file. 
      * 
      * @param {*} channel  JSON object containing the old channel.
      * @param {*} settings JSON object containing the new channel settings. 
      */
    static async asynUpsertChannel(channel, settings) {
        return await new Promise((resolve, reject) => {
            for (var i = 0; i < channels.length; i++) {
                if (channels[i].id === channel.id) {
                    // Update 
                    channels[i].guild = channel.guild.name;
                    channels[i].map = settings.map;
                    channels[i].season = settings.season;
                    channels[i].footer = settings.footer;
                    channels[i].color = settings.color;
                    fs.writeFileSync('channels.json', JSON.stringify(channels));
                    resolve(channels[i]);
                    return;
                }
            }
            // Insert
            let newChannel = {
                "id": channel.id,
                "guild": channel.guild.name,
                "map": settings.map,
                "season": settings.season,
                "footer": settings.footer,
                "color": settings.color
            }
            channels.push(newChannel);
            fs.writeFileSync('channels.json', JSON.stringify(channels));
            resolve(newChannel);
        });
    }

    /**
     * Removes a channel with matching id from the channels file. 
     * 
     * @param {String} channel_id
     */
    static async asyncRemoveChannel(channel_id) {
        for (var i = 0; i < channels.length; i++) {
            if (channels[i].id === channel_id) {
                channels.splice(i, 1);
                fs.writeFileSync('channels.json', JSON.stringify(channels));
                return true;
            }
        }
        return false;
    }
    
}