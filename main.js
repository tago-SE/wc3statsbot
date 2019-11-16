  
const Discord = require('discord.js');
const client = new Discord.Client();   
const { CommandHandler } = require('djs-commands');

const config = require('./config.json');
const MessageUtils = require("./utils/messageutils");
const wc3stats = require("./controllers/Wc3Stats");
const CH = new CommandHandler({
    folder: __dirname + "/commands/",
    prefix: config.prefix
});


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    
    if (msg.author.bot)  
        return;

    // Ignore messages posted in wrong channels
    if (!config.actionableChannels.includes(msg.channel.id)) return;

    // Handle command
   
    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "!say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Handle uploaded files
    if (msg.attachments.size > 0) {
        let attached = msg.attachments.array()[0];
        let fname = attached.filename;
        if (fname.substring(fname.length - 4, fname.length) !== ".w3g") { 
            if (config.attachementShowError) {
                msg.channel.send(MessageUtils.error("Invalid file format. Can only read w3g files."));
            }
        } else {
            wc3stats.postReplayAttachment(attached)
            .then(json => {
                const ReplayCommand = require('./commands/replay');
                new ReplayCommand().run(client, msg, [json.body.id]); 
            });
            msg.delete();
        }
    }

    // Ignore none command messages 
    if (msg.content.indexOf(config.prefix) !== 0) return

    // Execute command if it exists 
    const foundCommand = CH.getCommand(config.prefix + command);
    if (!foundCommand) 
        return;
    try {
        foundCommand.run(client, msg, args);
    } catch (e) {
        console.log(e);
    }
});

const secret = require('./.secret.json');
client.login(secret.token);
