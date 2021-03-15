import { log } from './Infra/log.js';

const LOG_TITLE = '緊急事態宣言';
const ADMIN = /719528011707449436|756871421984112701|807177155095429121/;
const PERIOD = 7 * 24 * 60 * 60 * 1000;
const REQUIRED = 2;
const COMMAND = /^(?:緊急事態宣言|きんじたせ)(解除)?$/;
const BANCOMMAND = /^(un)?ban[ 　]+(\d+)$/i;
const MAX_DELETE = 1000;

class Nuke {

  constructor() {
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
  
  async deleteLog(channel, id) {
    let options = {limit: 100}, lastId;
    for (var i = 0; i < MAX_DELETE; i += options.limit) {
      if (lastId)
        options.before = lastId;
      let msgs = await channel.messages.fetch(options);
      if (!msgs.size)
        return;
      channel.bulkDelete(msgs.filter(msg => msg.member.id === id)).catch(()=>0);
      lastId = msgs.last().id;
    }
  }
  
  async onMessage(msg) {
    if (this.isAvailable && this.banList[msg.member.id]) {
      msg.delete();
      return;
    }
    if (ADMIN.test(msg.member.id)) {
      if (COMMAND.test(msg.content)) {
        if (RegExp.$1) {
          this.setMode(false);
          log(LOG_TITLE, msg.member.id + 'により強制終了');
        } else {
          if (++this.count >= REQUIRED) {
            this.setMode(true);
            log(LOG_TITLE, msg.member.id + 'により有効');
          } else {
            log(LOG_TITLE, `${msg.member.id}が緊急事態宣言\nあと${REQUIRED - this.count}人宣言したら有効`);
          }
        }
        msg.delete();
      } else if (BANCOMMAND.test(msg.content)) {
        const unban = RegExp.$1, id = RegExp.$2;
        if (this.banList[id] = !unban) {
          if (this.isAvailable) {
            msg.guild.members.ban(id, {days: 7}).catch(err => log('banできねえ', err.stack));
            this.deleteLog(msg.channel, id);
            log(LOG_TITLE, msg.member.id + 'が' + id + 'をBAN');
          } else {
            log(LOG_TITLE, msg.member.id + 'が' + id + 'をBANしようとしたが緊急事態宣言期間中でないため失敗');
          }
        } else {
          msg.guild.members.unban(id).catch(err => log('unbanできねえ', err.stack));
          log(LOG_TITLE, msg.member.id + 'が' + id + 'をBAN解除');
        }
        msg.delete();
      } else if (msg.content === '釈放') {
        msg.guild.fetchBans().then(bans => {
          const failedList = [];
          bans.each(banInfo => msg.guild.members.unban(banInfo.user).catch(()=>failedList.push(banInfo.user.id)));
          log(LOG_TITLE, msg.member.id + 'が' + (bans.size - failedList.length) + '人全員釈放\n' + failedList.length + '人釈放失敗');
          if (failedList.length)
            log(LOG_TITLE, '釈放失敗リスト\n' + failedList.join('\n'));
        }).catch(err => log('fetchBANできねえ', err.stack));
        msg.delete();
      }
    }
  }

}


export default Nuke;
