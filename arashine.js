const REPEAT_LIMIT = 2;

class Arashine {

  constructor() {
    this.guestInfo = {};
  }

  async onMessage(msg) {
  
    let guestInfo = this.guestInfo[msg.member.id] || (this.guestInfo[msg.member.id] = {});
    
    if (guestInfo.lastMessage === msg.content) {
      if (++guestInfo.repeatCount > REPEAT_LIMIT)
        msg.member.ban({days: 7});
    } else {
      guestInfo.repeatCount = 1;
      guestInfo.lastMessage = msg.content;
    }
    
    if (msg.mentions.everyone || msg.mentions.roles.size)
      msg.delete();

  }

}


export default Arashine;
