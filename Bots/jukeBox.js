import random from 'random';
import { BaseBot } from '../Infra/Bot/core.js';
import { BasicRoleFilter } from '../Infra/Bot/botHubFilter.js';
import { log } from '../Infra/log.js';
import { getYtdlConnectionDispatcher } from '../Infra/youtubeConnection.js';

const JUKEBOXCH_PATTERN = /^動画bgm/i;
const REPLACE_IDLIST = {'804051889909006427': '768556789636792372'};

const playMusic = function(req, jukebox) {

  const onerror = err => {
    req.msg.channel.send((err + '').includes('Status code: 429') ? 'Googleからの妨害を受けている為しばらく使えないかも' : 'エラーで再生できませんでした');
    log('エラー', err.stack, req.msg);
    jukebox.playNext();
  };
  jukebox.lastRequest = req;
  jukebox.cancelVoted = null;
  req.msg.guild.channels.cache.find(channel => channel.type === 'voice' && JUKEBOXCH_PATTERN.test(channel.name)).join()
  .then(connection => {
    const dispatcher = getYtdlConnectionDispatcher(connection, req.url);
    dispatcher.on("finish", jukebox.playNext.bind(jukebox));
    dispatcher.on("error", onerror);
  })
  .catch(onerror);
  
};

class JukeBox extends BaseBot {

  constructor(client) {
    super(client);
    this.lastRequest = this.cancelVoted = null;
    this.requestBox = {};
  }

  async onMessage(msg) {
    super.onMessage(msg);
    if (!JUKEBOXCH_PATTERN.test(msg.channel.name))
      return;
    var matches = msg.content.match(/https?:\/\/(?:www\.youtube\.com|youtu\.be).+/g);
    if (matches) {
      if (!msg.member.voice.channel || !JUKEBOXCH_PATTERN.test(msg.member.voice.channel.name)) {
        msg.reply("配信ルームに入ってからリクエストしてください。");
        return;
      }
      var before = (this.requestBox[msg.member.id] || []).length;
      var myRequest = this.requestBox[msg.member.id] = (this.requestBox[msg.member.id] || [])
        .concat(matches.map(url => ({msg: msg, url: url})))
        .filter((req, i, arr) => !(arr.find((req2, j) => i < j && req.url === req2.url) || (this.lastRequest && this.lastRequest.url === req.url)));
      if (myRequest.length - before !== matches.length)
        msg.reply('重複した曲は追加されません。');
      if (!this.lastRequest)
        playMusic(myRequest.shift(), this);
      if (myRequest.length > before)
        msg.reply('抽選箱に入れました。' + myRequest.length + '曲抽選待ちです。');
      if (!myRequest.length)
        delete this.requestBox[msg.member.id];
    } else if (msg.content === "cancel") {
      this[this.lastRequest && msg.member.id === this.lastRequest.msg.member.id ? 'playNext' : 'cancel'](msg);
    } else if (msg.content === "clear") {
      delete this.requestBox[msg.member.id];
      msg.reply("クリアしました。");
    }
  }

  playNext() {
    var keys = Object.keys(this.requestBox);
    if (this.lastRequest.msg.guild.me.voice.channel && this.lastRequest.msg.guild.me.voice.channel.members.size > 1 && keys.length) {
      var memberId = keys[random.int(0, keys.length - 1)];
      var nextIndex = random.int(0, this.requestBox[memberId].length - 1);
      var next = this.requestBox[memberId].splice(nextIndex, 1)[0];
      if (!this.requestBox[memberId].length)
        delete this.requestBox[memberId];
      if (next.msg.deleted) {
        this.playNext();
        return;
      }
      next.msg.channel.send(`${next.msg.member.displayName}さんより\n${next.url}`);
      playMusic(next, this);
    } else {
      this.onCanceled(this.lastRequest.msg);
    }
  }

  onCanceled(msg) {
    const myVoiceChannel = msg.guild.me.voice.channel;
    if (myVoiceChannel)
      myVoiceChannel.leave();
    this.lastRequest = null;
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
Object.assign(JukeBox.prototype, BasicRoleFilter);

export default JukeBox;
