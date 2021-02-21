import random from 'random';
import https from 'https';
import { getYtdlConnectionDispatcher } from './Infra/youtubeConnection.js';

var onPlaying = false;
const JUKEBOXCH_PATTERN = /^動画bgm/i;

const notifyError = function(msg, err) {
  console.error(err);
  msg.channel.send((err + '').includes('Status code: 429') ? 'Googleからの妨害を受けている為しばらく使えません' : 'エラーで再生できませんでした');
  const req = https.request(process.env.ERROR_WEBHOOK, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  });
  req.on('error', err => {
    msg.channel.send('WEBHOOKのPOSTが失敗しました。envあってるかみてください');
  });
  req.write(JSON.stringify({
    username: 'エラー',
    content: err.stack
  }));
  req.end();
};

const playMusic = function(msg, url, onFinish) {
  if (!url) return;

  onPlaying = true;
  msg.guild.channels.cache.find(channel => channel.type === 'voice' && JUKEBOXCH_PATTERN.test(channel.name)).join()
  .then(connection => {
    const dispatcher = getYtdlConnectionDispatcher(connection, url);
    dispatcher.on("finish", onFinish);
    dispatcher.on("error", err => {
      notifyError(msg, err);
      onFinish();
    });
  })
  .catch(err => {
    notifyError(msg, err);
    onFinish();
  });
};

class JukeBox {

  constructor() {
    this.cancelVoted = null;
    this.requestBox = {};
  }

  async onMessage(msg) {
    if (!JUKEBOXCH_PATTERN.test(msg.channel.name))
      return;
    if (/^https?:\/\/(?:www\.)?youtu/.test(msg.content)) {
      if (!msg.member.voice.channel || !JUKEBOXCH_PATTERN.test(msg.member.voice.channel.name)) {
        return msg.reply("配信ルームに入ってからリクエストしてください。");
      }
      if (onPlaying) {
        // 抽選箱に入れる
        if (!this.requestBox[msg.member.id])
          this.requestBox[msg.member.id] = { name: msg.member.nickname, list: []};
        const n = this.requestBox[msg.member.id].list.push(msg.content);
        return msg.reply(`抽選箱に入れました。${n}曲抽選待ちです。`);
      }
      playMusic(msg, msg.content, this.playNext.bind(this, msg));
    } else if (msg.content === "cancel") {
      this.cancel(msg);
    } else if (msg.content === "clear") {
      delete this.requestBox[msg.member.id];
      msg.reply("クリアしました。");
    }
  }

  playNext(msg) {
    var keys = Object.keys(this.requestBox);
    if (keys.length) {
      var memberId = keys[random.int(0, keys.length - 1)];
      var nickname = this.requestBox[memberId].name;
      var nextIndex = random.int(0, this.requestBox[memberId].list.length - 1);
      var next = this.requestBox[memberId].list.splice(nextIndex, 1)[0];
      if (!this.requestBox[memberId].list.length)
        delete this.requestBox[memberId];
      msg.channel.send(`${nickname}さんより\n${next}`);
      playMusic(msg, next, this.playNext.bind(this, msg));
    } else {
      msg.guild.me.voice.channel.leave();
      onPlaying = false;
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
