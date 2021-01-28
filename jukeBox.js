import random from 'random';
import ytdl from "discord-ytdl-core";

var onPlaying = false;
var requestBox = {};
var cancelVoted = null;

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
  }
}

export default JukeBox;