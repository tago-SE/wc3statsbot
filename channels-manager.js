const fs = require('fs');
const request = require('request-promise');

module.exports = class ChannelsManager {

    /**
     * Gets channel configuration by matching id
     * 
     * @param {String} channel_id 
     */
    static async asyncGetChannel(channel_id) {
        return await new Promise((resolve, reject) => {
            fs.readFile('channels.json', (err, data) => {
                if (err) 
                    reject(err);   
                let channels = JSON.parse(data);
                for (var i = 0; i < channels.length; i++) {
                    if (channels[i].id === channel_id) {
                        resolve(channels[i]);
                    }
                }
                resolve(null);
            }); 
        });
    }

    /**
     * Inserts or updates a channel object into the channel file. 
     * 
     * @param {String} channel_id
     * @param {JSON} channel JSON object containing map, season and footer references. 
     */
    static async asynUpsertChannel(channel, settings) {
        return await new Promise((resolve, reject) => {
            fs.readFile('channels.json', (err, data) => {
                if (err) 
                    reject(err);   
                let channels = JSON.parse(data);
                for (var i = 0; i < channels.length; i++) {
                    if (channels[i].id === channel.id) {
                        // Update 
                        channels[i].guild = channel.guild.name;
                        channels[i].map = settings.map;
                        channels[i].season = settings.season;
                        channels[i].footer = settings.footer;
                        channels[i].color = settings.color;
                        fs.writeFileSync('channels.json', JSON.stringify(channels));
                        //console.log("ChannelsManager_asynUpsertChannel: updated channel: " + channel_id);
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
                //console.log("ChannelsManager_asynUpsertChannel: inserted channel: " + channel_id);
                resolve(newChannel);
            }); 
        });
    }

    /**
     * Removes a channel with matching id from the channels file. 
     * 
     * @param {String} channel_id
     */
    static async asyncRemoveChannel(channel_id) {
        return await new Promise((resolve, reject) => {
            fs.readFile('channels.json', (err, data) => {
                if (err) 
                    reject(err);   
                let channels = JSON.parse(data);
                for (var i = 0; i < channels.length; i++) {
                    if (channels[i].id === channel_id) {
                        channels.splice(i, 1);
                        fs.writeFileSync('channels.json', JSON.stringify(channels));
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            }); 
        });
    }
}