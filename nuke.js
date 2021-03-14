const ADMIN = /719528011707449436|756871421984112701|807177155095429121/;
const PERIOD = 24 * 60 * 60 * 1000;
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
        } else {
          if (++this.count >= REQUIRED)
            this.setMode(true);
        }
        msg.delete();
      } else if (this.isAvailable && BANCOMMAND.test(msg.content)) {
        const unban = RegExp.$1, id = RegExp.$2;
        if (this.banList[id] = !unban) {
          msg.guild.members.ban(id, {days: 7}).catch(()=>0);
          this.deleteLog(msg.channel, id);
        }
        msg.delete();
      }
    }
  }

}


export default Nuke;
