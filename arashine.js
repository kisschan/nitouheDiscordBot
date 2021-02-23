const REPEAT_LIMIT = 2;
const SAMPLING_LENGTH = 3;
const SPEED_LIMIT = 3000;

class Arashine {

  constructor() {
    this.guestInfo = {};
  }

  async onMessage(msg) {
  
    let guestInfo = this.guestInfo[msg.member.id] || (this.guestInfo[msg.member.id] = {sample: []});
    
    if (guestInfo.lastMessage === msg.content) {
      if (++guestInfo.repeatCount > REPEAT_LIMIT)
        msg.member.ban({days: 7});
    } else {
      guestInfo.repeatCount = 1;
      guestInfo.lastMessage = msg.content;
    }
    
    let time = (new Date()).getTime();
    guestInfo.sample.push(time);
    if (guestInfo.sample.length === SAMPLING_LENGTH && time - guestInfo.sample.shift() < SPEED_LIMIT)
      msg.member.ban({days: 7});
    else if (msg.mentions.everyone || msg.mentions.roles.size)
      msg.delete();

  }

}


export default Arashine;
