const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "]";

client.on('ready', () => {
    console.log("Ready!")
    client.user.setActivity("]help");
    client.user.setUsername("EZReminder");
});

client.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const reminderTitle = args.slice(1).join(" ");
    const amount = parseInt(args[0]);

    const incorrectUsageEmbed = new Discord.RichEmbed()
           .setTitle(":x: Incorrect Usage!")
           .setDescription("**Correct usage**: `]addreminder <number in minutes> <title of reminder>`!\n**Example**: `]addreminder 5 go to bed`")
           .setColor(0xff0000)

    const reminderDoneEmbed = new Discord.RichEmbed()
    .setTitle("Did you forget?")
    .setDescription(`${amount} minute(s) have passed, you wanted to be reminded about: **${reminderTitle}**!`)
    .setColor(0x4d94ff)

    const reminderAddedEmbed = new Discord.RichEmbed()
    .setTitle(":alarm_clock: Reminder successfully added")
    .setDescription(`${reminderTitle}`)
    .addField('Time', `${amount} minute(s).`)
    .addField(`Channel`, `${msg.author}'s DMs.`)
    .setColor(0x4d94ff)
    .setFooter(`Reminder requested by ${msg.author.username}#${msg.author.discriminator}`)
    .setThumbnail(msg.author.avatarURL)

    const helpEmbed = new Discord.RichEmbed()
    .setTitle("Available commands")
    .setDescription("`addreminder`, `ping`, `help`, `invite`, `info`")
    .addField("How do I add a reminder?", "To add a reminder, type `]addreminder <number in minutes> <title of reminder>!`\nFor example: `]addreminder 5 get dinner outta the oven`!")
    .setFooter("EZReminder developed and created by Pete#4164")
    .setColor(0x4d94ff)
    
    if(command === "addreminder") {
       if(!args.length) return msg.channel.send(incorrectUsageEmbed)
        
       if(isNaN(amount)) { 
        return msg.channel.send(incorrectUsageEmbed);
       } else if(amount > 10080) return msg.channel.send(`You can't make reminders longer than 1 week (10080 minutes)!\nMinutes requested: **${amount}**`);
       if(amount < 1) return msg.channel.send(`You can't make reminders less than 1 (1 minute)!\nMinutes requested: **${amount}**`)
       if(!reminderTitle) return msg.channel.send(incorrectUsageEmbed)
       if(amount) { // x amount 60000 ms (1 minute)
           setTimeout(async () => {
            msg.author.send(reminderDoneEmbed)
           }, amount * 60000)
        msg.channel.send(reminderAddedEmbed)
       }
    } else if(command === "invite") {
        const embed = new Discord.RichEmbed()
        .setTitle("Invite/Join EZReminder")
        .setDescription("Click [here](https://discordapp.com/oauth2/authorize/?permissions=1341643969&scope=bot&client_id=419321520733814807) to invite EZReminder to your Discord Server!\nClick [here](https://discord.gg/rNAvE2X) to join EZReminder\'s support server!")
        .setColor()

        msg.channel.send({embed});
    } else if(command === "help") {
        msg.channel.send(helpEmbed);
    } else if(command === "ping") {
        msg.channel.send(`Pong! My connection to the server is ${Date.now() - msg.createdTimestamp}ms.\n**Heartbeat**: ${Math.round(client.ping)}ms`)
    } else if(command === "info") {
        const embed = new Discord.RichEmbed()
        .setTitle("Current Bot Statistics")
        .setDescription("Type `]invite` to invite EZReminder to your server or join the support server!")
        .addField("Servers:", client.guilds.size, true)
        .addField("Users:", client.users.size, true)
        .setFooter("EZReminder developed and created by Pete#4164")
        .setColor(0x4d94ff);

        msg.channel.send({embed});
    }
});

client.on('guildCreate', guild => {
    let defaultChannel = "";
    guild.channels.forEach((channel) => {
      if(channel.type == "text" && defaultChannel == "") {
        if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
          defaultChannel = channel;
        }
      }
    })
    if (!defaultChannel) return;
    //defaultChannel will be the channel object that it first finds the bot has permissions for
    const embed = new Discord.RichEmbed()
    .setTitle('Howdy folks!')
    .setDescription("Thanks for inviting me to **" + guild.name + "**! My prefix is currently `]`, and is not customizable yet.\n\nTo add a reminder, type `]addreminder <number in minutes> <title of reminder>`!\nFor example: `]addreminder 5 get dinner outta the oven`!\n\n__**If you are having any issues, join the support server -**__ type `]invite`")
    .setColor(0x2471a3)
  
    defaultChannel.send({embed})
});

client.login('NDE5MzIxNTIwNzMzODE0ODA3.DXudgA.GjjubNd0RjsuKDMCrZ7cPP39WOc');