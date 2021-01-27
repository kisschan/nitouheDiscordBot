require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;

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
});

client.login(BOT_TOKEN);