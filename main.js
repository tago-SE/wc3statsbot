  
const Discord = require('discord.js');
const client = new Discord.Client();   
const { CommandHandler } = require('djs-commands');

const config = require('./config.json');
//const MessageUtils = require("./utils/messageutils");
//const Wc3StatsController = require('./controller/wc3stats-controller');

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
            msg.channel.send(MessageUtils.error("Invalid file format. Can only read w3g files."));
        } else {
            //Wc3StatsController.postReplayAttachment(attached)
            //.then(json => {
            //    const SubmitCommand = require('./commands/submit');
            //    new SubmitCommand().run(client, msg, [json.body.id]); 
            //})
            //.catch(err => {
            //    //msg.channel.send(MessageUtils.error("Upload to wc3stats.com failed"));
            //});
        }
        //msg.delete();
    }


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
