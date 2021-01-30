import random from 'random';
import ytdl from "discord-ytdl-core";

var onPlaying = false;
var requestBox = {};

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
        var keys = Object.keys(requestBox)
        var index = random.int(0, keys.length - 1);
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

class JukeBox {

  constructor() {
    this.cancelVoted = null;
  }

  async onMessage(msg) {
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
      this.cancel(msg);
    }
  }

  onCanceled(msg) {
    const myVoiceChannel = msg.guild.me.voice.channel;
    myVoiceChannel.leave(); 
    onPlaying = false; // TODO: これがグローバル変数を参照してる
  }

  cancel(msg) {
    const myVoiceChannel = msg.guild.me.voice.channel;
    if (myVoiceChannel === null) { // myVoiceがnullであればキャンセルする必要がないとみなす。
      return; 
    }
    if (msg.member.roles.cache.size === 1) { // ロールのを与えていない人の投票はキャンセル
      msg.member.user.createDM().then(channel => {
        channel.send("エラー。ロールのない人はキャンセル投票はできません。");
      });
      return;
    }
    if (this.cancelVoted === null) {
      this.cancelVoted = msg.member.id;
      msg.reply("キャンセル投票を受け付けました。\nもう一人の投票でキャンセルになります。");
    }
    if (this.cancelVoted !== msg.member.id) {
      this.cancelVoted = null;
      this.onCanceled(msg);
      return msg.reply("キャンセル投票が二人以上あったため、キャンセルします。");
    }
  }
}

export default JukeBox;