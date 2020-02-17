const Discord = require('discord.js');

const wc3stats = require("../api/wc3stats");
const ReplayCommand = require('../commands/replay');

// We include a delay from that the upload has completed, until the replay command is executed to give the server time to update the statistics
const DELAY = 5000; 


function executeReplayCommand(data) {
    new ReplayCommand().run(data.client, data.msg, data.args); 
}

module.exports = class UploadManager {
 
    static handleUploadedFile(client, msg) {
        try {
            let attached = msg.attachments.array()[0];
            let fname = attached.filename;
            if (fname.substring(fname.length - 4, fname.length) !== ".w3g") { 
                //
                // unandled exception
                //
            } else {
                wc3stats.postReplayAttachment(attached)
                .then(json => {
                    setTimeout(executeReplayCommand, DELAY, {
                        client: client, 
                        msg: msg, 
                        args: [json.body.id]
                    });
                });
                if (msg.member.guild.me.hasPermission("MANAGE_MESSAGES")) {
                    msg.delete();
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}