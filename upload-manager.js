const Discord = require('discord.js');

const wc3stats = require("./controllers/wc3stats");
const ReplayCommand = require('./commands/replay');

module.exports = class UploadManager {
 
    static handleUploadedFile(client, msg) {
        try {
            let attached = msg.attachments.array()[0];
            let fname = attached.filename;
            if (fname.substring(fname.length - 4, fname.length) !== ".w3g") { 
                // unandled exception
            } else {
                wc3stats.postReplayAttachment(attached)
                .then(json => {
                    new ReplayCommand().run(client, msg, [json.body.id]); 
                });
                msg.delete();
            }
        } catch (err) {
            console.log(err);
        }
    }
}