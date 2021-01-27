require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;

const ytdl = require("discord-ytdl-core");
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.content === 'はさみ将棋') {
    msg.reply(`https://sdin.jp/browser/board/hasami/`)
  }
  if (msg.content === 'メンバー') {
    var guild = msg.guild;
    var members = await guild.members.fetch();
    var ryusukeMembers = members.filter(member => {
      var name = member.nickname;
      if (name == null) {
        name = member.user.username
      }
      return name.includes("竜介軍") && member.presence.status !== 'offline'
    })
    msg.reply(`ただいま${ryusukeMembers.size}人です。`)
  }
  if (msg.content.includes("youtu")) {
    if (!msg.member.voice.channel) return msg.channel.send("You're not in a voice channel?");
        let stream = ytdl(msg.content, {
            filter: "audioonly",
            opusEncoded: true,
            encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
        });
        
        msg.member.voice.channel.join()
        .then(connection => {
            let dispatcher = connection.play(stream, {
                type: "opus"
            })
            .on("finish", () => {
                msg.guild.me.voice.channel.leave();
            })
        });
  }
});

client.login(BOT_TOKEN);