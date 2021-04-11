import { log } from '../Infra/log.js';
import { BaseBot } from '../Infra/Bot/core.js';

const LOG_TITLE = '緊急事態宣言';
const ADMIN = /719528011707449436|756871421984112701|807177155095429121/;
const PERIOD = 7 * 24 * 60 * 60 * 1000;
const REQUIRED = 2;
const COMMAND = /^(?:緊急事態宣言|きんじたせ)(解除)?$/;
const BANCOMMAND = /^(un)?ban[ 　]+(\d+)(?:[ 　]+(\d+))?$/i;
const PARDON = /^(?:釈放|恩赦)(?:[ 　]+(\d+))?$/;
const ROLLBACK = /^(?:[ろロﾛ][おオｵーうウｳ][るルﾙ][ばバﾊﾞ][っッｯ][くクｸ]|rollback)(?:[ 　]+(\d+))?$/i;
const MAX_DELETE = 1000;

class Nuke extends BaseBot {

  constructor(client) {
    super(client);
    this.isAvailable = false;
    this.count = 0;
    this.banList = {};
  }
  
  setMode(mode) {
    clearTimeout(this.timerId);
    this.count = 0;
    if (this.isAvailable = mode)
      this.timerId = setTimeout(this.setMode.bind(this, false), PERIOD);
  }
  
  deleteLog(guild, id) {
    let options = {limit: 100}, lastId;
    guild.channels.cache.each(async channel => {
      for (var i = 0; i < MAX_DELETE; i += options.limit) {
        if (lastId)
          options.before = lastId;
        let msgs = await channel.messages.fetch(options);
        if (!msgs.size)
          return;
        channel.bulkDelete(msgs.filter(msg => msg.member.id === id)).catch(()=>0);
        lastId = msgs.last().id;
      }
    });
  }
  
  async onMessage(msg) {
    super.onMessage(msg);
    if (this.isAvailable && this.banList[msg.member.id]) {
      msg.delete();
      return;
    }
    if (ADMIN.test(msg.member.id)) {
      if (COMMAND.test(msg.content)) {
        if (RegExp.$1) {
          this.setMode(false);
          log(LOG_TITLE, msg.member.user.tag + 'により強制終了');
        } else {
          if (++this.count >= REQUIRED) {
            this.setMode(true);
            log(LOG_TITLE, msg.member.user.tag + 'により有効');
          } else {
            log(LOG_TITLE, `${msg.member.user.tag}が緊急事態宣言\nあと${REQUIRED - this.count}人宣言したら有効`);
          }
        }
        msg.delete();
      } else if (BANCOMMAND.test(msg.content)) {
        const unban = RegExp.$1, id = RegExp.$2, guild = (RegExp.$3 && msg.client.guilds.cache.find(guild => guild.id === RegExp.$3)) || msg.guild;
        if (this.banList[id] = !unban) {
          if (this.isAvailable) {
            guild.members.ban(id, {days: 7}).catch(err => log(guild.name + 'にてbanできねえ', err.stack));
            this.deleteLog(guild, id);
            log(LOG_TITLE, guild.name + 'にて' + msg.member.user.tag + 'が' + id + 'をBAN');
          } else {
            log(LOG_TITLE, guild.name + 'にて' + msg.member.user.tag + 'が' + id + 'をBANしようとしたが緊急事態宣言期間中でないため失敗');
          }
        } else {
          guild.members.unban(id).catch(err => log(guild.name + 'にてunbanできねえ', err.stack));
          log(LOG_TITLE, guild.name + 'にて' + msg.member.user.tag + 'が' + id + 'をBAN解除');
        }
        msg.delete();
      } else if (PARDON.test(msg.content)) {
        const guild = (RegExp.$1 && msg.client.guilds.cache.find(guild => guild.id === RegExp.$1)) || msg.guild;
        guild.fetchBans().then(bans => {
          let failedList = [], count = 0;
          bans.each(banInfo =>
            guild.members.unban(banInfo.user).catch(err => failedList.push(banInfo.user.id)).finally(() =>
              ++count === bans.size && failedList.length && log(LOG_TITLE, '釈放失敗リスト\n' + failedList.join('\n'))
            )
          );
          log(LOG_TITLE, guild.name + 'にて' + msg.member.user.tag + 'が' + bans.size + '人全員釈放');
        }).catch(err => log(guild.name + 'にてfetchBANできねえ', err.stack));
        msg.delete();
      } else if (ROLLBACK.test(msg.content)) {
        const channel = (RegExp.$1 && msg.client.channels.cache.find(channel => channel.id === RegExp.$1)) || msg.channel;
        const filtered = (await channel.messages.fetch({ limit: 100 })).filter(msg => (msg.member.roles && msg.member.roles.cache.size < 2) || msg.author.bot);
        channel.bulkDelete(filtered);
        msg.delete();
        log(channel.name + 'にてロールバック実行', msg.member.user.tag);
      }
    }
  }

}


export default Nuke;
