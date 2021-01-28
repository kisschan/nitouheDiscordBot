import dotenv from 'dotenv';
dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN; // Discord Botのトークン環境変数

import ytdl from "discord-ytdl-core";
import { Client } from 'discord.js';
import MessageReplier from './messageReplier.js';

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

var onPlaying = false;
var requestBox = {};
var cancelVoted = null;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const playMusic = function(msg, url) {
  if (!url) return;
  let stream = ytdl(url, {
    filter: "audioonly",
    opusEncoded: true,
    encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
  });

  msg.member.voice.channel.join()
  .then(connection => {
    onPlaying = true;
    let dispatcher = connection.play(stream, {
      type: "opus"
    })
    .on("finish", () => {
      if (requestBox.size !== 0) {
        keys = Object.keys(requestBox)
        var index = getRandomInt(keys.length);
        var next = requestBox[keys[index]];
        requestBox = {};
        msg.channel.send(next)
        playMusic(msg, next);
      }
      onPlaying = false;
      if (requestBox.size === 0) { 
        msg.guild.me.voice.channel.leave(); 
      }
    })
  });
}

const messageReplier = new MessageReplier();

client.on('message', async msg => {
  if (msg.author.bot) return;
  messageReplier.onMessage(msg);
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
    if (!msg.member.voice.channel) {
      return msg.reply("配信ルームに入ってからリクエストしてください。");
    }
    if (onPlaying) {
      // 抽選箱に入れる
      requestBox[msg.member.id] = msg.content;
      return msg.reply(msg.member.id + " 抽選箱に入れました。")
    }
    playMusic(msg, msg.content)
  }
  if (msg.content === "cancel") {
    if (cancelVoted === null) {
      cancelVoted = msg.member.id;
      return msg.reply("キャンセル投票を受け付けました。もうひとりの投票でキャンセルになります。")
    }
    if (cancelVoted !== msg.member.id) {
      cancelVoted = null;
      msg.guild.me.voice.channel.leave(); 
      onPlaying = false;
      return msg.reply("キャンセル投票が二人以上あったため、キャンセルします。")
    }
  }
});

client.login(BOT_TOKEN);