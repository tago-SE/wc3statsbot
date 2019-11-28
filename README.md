This discord bot is made in partnership with [wc3stats](https://wc3stats.com) and utilizes their [api](https://wiki.wc3stats.com/Help:API).

There is a version of this bot up and running already. If you want your map and discord channel to be serviced by it you can reach out to [Pinzu@discord](https://discordapp.com/invite/N3VGkUM). 

# Features

* Automatically upload posted replay files to wc3stats.com.
* Query scoreboards, replays, stats and last played games from wc3stats.com

# Discord Setup

    https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/

# Configuration 

1) Change the filename of '.secretTemplate.json' to '.secret.json' and insert your discord bot token. 

2) You can edit the settings inside the config.json file. 

# Linux Installation & Run 

1. Open the command prompt inside the root folder where the bot source code is stored (you should see main.js) and install the dependencies with the following command: 

    npm install

2. A known issue is that some dependencies might not be installed correctly, if so you will have to do that yourself, example:

    npm install dateformat --save

3. Now you need to give the bot the necessary permissions (or if lazy, and dont care about security type. "chmod 777 -R /path/to/folder/*")

4. To run the bot go to the folder and type one of the following commands

    node main.js 
    npm start

# Making the bot a service on ubuntu

1. goto /etc/systemd/system/
2. create a text tile, named as "name.service" where name is what you'd like the bot to be named
3. in a file, type and replace items as needed
    [Unit]
    Description=My app

    [Service]
    ExecStart=/var/www/myapp/app.js
    Restart=always
    User=nobody
    # Note Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
    Group=nogroup
    Environment=PATH=/usr/bin:/usr/local/bin
    Environment=NODE_ENV=production
    WorkingDirectory=/var/www/myapp

    [Install]
    WantedBy=multi-user.target

4. then to start, restart, or stop the service, use the following.

    Type "systemctl start name.service"
    Type "systemctl restart name.service"
    Type "systemctl stop name.service"

5. to enable the bot to run on boot, type  "systemctl enable name.service"