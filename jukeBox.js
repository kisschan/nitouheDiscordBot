import random from 'random';
import https from 'https';
import { getYtdlConnectionDispatcher } from './Infra/youtubeConnection.js';

const JUKEBOXCH_PATTERN = /^動画bgm/i;
const REPLACE_IDLIST = {'804051889909006427': '768556789636792372'};

const notifyError = function(msg, err) {
  console.error(err);
  msg.channel.send((err + '').includes('Status code: 429') ? 'Googleからの妨害を受けている為しばらく使えないかも' : 'エラーで再生できませんでした');
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

const playMusic = function(msg, jukebox) {

  jukebox.lastMsg = msg;
  jukebox.cancelVoted = null;
  msg.guild.channels.cache.find(channel => channel.type === 'voice' && JUKEBOXCH_PATTERN.test(channel.name)).join()
  .then(connection => {
    const dispatcher = getYtdlConnectionDispatcher(connection, msg.content);
    dispatcher.on("finish", jukebox.playNext.bind(jukebox));
    dispatcher.on("error", err => {
      notifyError(msg, err);
      jukebox.playNext();
    });
  })
  .catch(err => {
    notifyError(msg, err);
    jukebox.playNext();
  });
  
};

class JukeBox {

  constructor() {
    this.lastMsg = this.cancelVoted = null;
    this.requestBox = {};
  }

  async onMessage(msg) {
    if (!JUKEBOXCH_PATTERN.test(msg.channel.name))
      return;
    if (/^https?:\/\/(?:www\.)?youtu/.test(msg.content)) {
      if (!msg.member.voice.channel || !JUKEBOXCH_PATTERN.test(msg.member.voice.channel.name)) {
        msg.reply("配信ルームに入ってからリクエストしてください。");
        return;
      }
      if (this.lastMsg) {
        // 抽選箱に入れる
        if ((this.requestBox[msg.member.id] || []).some(requested => requested.content === msg.content)) {
          msg.reply('その曲は既に抽選待ちです。');
        } else if (this.lastMsg.content === msg.content) {
          msg.reply('その曲は今再生してます。');
        } else {
          if (!this.requestBox[msg.member.id])
            this.requestBox[msg.member.id] = [];
          const n = this.requestBox[msg.member.id].push(msg);
          msg.reply(`抽選箱に入れました。${n}曲抽選待ちです。`);
        }
        return;
      }
      playMusic(msg, this);
    } else if (msg.content === "cancel") {
      this[this.lastMsg && msg.member.id === this.lastMsg.member.id ? 'playNext' : 'cancel'](msg);
    } else if (msg.content === "clear") {
      delete this.requestBox[msg.member.id];
      msg.reply("クリアしました。");
    }
  }

  playNext() {
    var keys = Object.keys(this.requestBox);
    if (this.lastMsg.guild.me.voice.channel && this.lastMsg.guild.me.voice.channel.members.size > 1 && keys.length) {
      var memberId = keys[random.int(0, keys.length - 1)];
      var nextIndex = random.int(0, this.requestBox[memberId].length - 1);
      var nextMsg = this.requestBox[memberId].splice(nextIndex, 1)[0];
      if (!this.requestBox[memberId].length)
        delete this.requestBox[memberId];
      if (nextMsg.deleted) {
        this.playNext();
        return;
      }
      nextMsg.channel.send(`${nextMsg.member.displayName}さんより\n${nextMsg.content}`);
      playMusic(nextMsg, this);
    } else {
      this.onCanceled(this.lastMsg);
    }
  }

  onCanceled(msg) {
    const myVoiceChannel = msg.guild.me.voice.channel;
    if (myVoiceChannel)
      myVoiceChannel.leave();
    this.lastMsg = null;
  }

  cancel(msg) {
    const myVoiceChannel = msg.guild.me.voice.channel;
    if (myVoiceChannel === null) { // myVoiceがnullであればキャンセルする必要がないとみなす。
      return; 
    }
    if (this.cancelVoted === null) {
      this.cancelVoted = REPLACE_IDLIST[msg.member.id] || msg.member.id;
      msg.reply("キャンセル投票を受け付けました。\nもう一人の投票でキャンセルになります。");
    } else if (this.cancelVoted !== (REPLACE_IDLIST[msg.member.id] || msg.member.id)) {
      this.cancelVoted = null;
      msg.reply("キャンセル投票が二人以上あったため、キャンセルします。");
      this.playNext();
    }
  }
}

export default JukeBox;
