  
const Discord = require('discord.js');
const client = new Discord.Client();   
const { CommandHandler } = require('djs-commands');

const config = require('./config.json');
const MessageUtils = require("./utils/messageutils");
const wc3stats = require("./controllers/wc3stats");
const UploadManager = require("./upload-manager");

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
        UploadManager.handleUploadedFile(client, msg);
    }

    // Ignore none command messages 
    if (msg.content.indexOf(config.prefix) !== 0) return

    // Execute command if it exists 
    const foundCommand = CH.getCommand(config.prefix + command);
    if (!foundCommand) 
        return;
    try {
        console.log("command: " + command + ", args: " + args);
        foundCommand.run(client, msg, args);
    } catch (e) {
        console.log(e);
    }
});

const secret = require('./.secret.json');
client.login(secret.token);
