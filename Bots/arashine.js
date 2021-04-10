import { BaseBot } from "../Infra/Bot/core.js";
import { BasicNoRoleFilter } from "../Infra/Bot/botHubFilter.js";

const REPEAT_LIMIT = 2;
const SAMPLING_LENGTH = 3;
const SPEED_LIMIT = 3000;

class Arashine extends BaseBot {

  constructor(client) {
    super(client);
    this.guestInfo = {};
  }

  async onMessage(msg) {
    super.onMessage(msg);
  
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
Object.assign(Arashine.prototype, BasicNoRoleFilter);

export default Arashine;
