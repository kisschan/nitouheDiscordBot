import random from 'random';
import { getYtdlConnectionDispatcher } from './Infra/youtubeConnection.js';

var onPlaying = false;
var requestBox = {};

const playMusic = function(msg, url) {
  if (!url) return;

  onPlaying = true;
  msg.member.voice.channel.join()
  .then(connection => {
    const dispatcher = getYtdlConnectionDispatcher(connection, url);
    dispatcher.on("finish", () => {
      var keys = Object.keys(requestBox);
      if (keys.length) {
        var memberId = keys[random.int(0, keys.length - 1)];
        var nickname = requestBox[memberId].name;
        var nextIndex = random.int(0, requestBox[memberId].list.length - 1);
        var next = requestBox[memberId].list.splice(nextIndex, 1)[0];
        if (!requestBox[memberId].list.length)
          delete requestBox[memberId];
        msg.channel.send(`${nickname}さんより\n${next}`);
        playMusic(msg, next);
      } else {
        msg.guild.me.voice.channel.leave();
        onPlaying = false;
      }
    });
  });
}

class JukeBox {

  constructor() {
    this.cancelVoted = null;
  }

  async onMessage(msg) {
    if (!msg.channel.name.includes('配信者用'))
      return;
    if (msg.content.includes("youtu")) {
      if (!msg.member.voice.channel) {
        return msg.reply("配信ルームに入ってからリクエストしてください。");
      }
      if (onPlaying) {
        // 抽選箱に入れる
        if (!requestBox[msg.member.id])
          requestBox[msg.member.id] = { name: msg.member.nickname, list: []};
        const n = requestBox[msg.member.id].list.push(msg.content);
        return msg.reply(`抽選箱に入れました。${n}曲抽選待ちです。`);
      }
      playMusic(msg, msg.content);
    } else if (msg.content === "cancel") {
      this.cancel(msg);
    } else if (msg.content === "clear") {
      delete requestBox[msg.member.id];
      msg.reply("クリアしました。");
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
    } else if (this.cancelVoted !== msg.member.id) {
      this.cancelVoted = null;
      this.onCanceled(msg);
      return msg.reply("キャンセル投票が二人以上あったため、キャンセルします。");
    }
  }
}

export default JukeBox;