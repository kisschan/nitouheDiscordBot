import { BaseBot } from "../Infra/bot.js";
import { BasicRoleFilter } from "../Infra/botHubFilter.js";

class Natsukashiimono extends BaseBot {

  constructor(client, userRecordRepository) {
    super(client);
    this.userRecordRepository = userRecordRepository;
  }

  onMessage(msg) {
    super.onMessage(msg);
    const pattern = /<@!([0-9]+)>\s*はい\s*([0-9]*)[点|てん]/
    if (pattern.test(msg.content)) {
      const result = pattern.exec(msg.content);
      const userId = result[1];
      const score = Number(result[2]);

      this.userRecordRepository.addNitouheScore(userId, score, err => {
        if (err) {
          msg.react('⚠');
        } else {
          msg.react('✅');
        }
      });
    }
    if (msg.content === 'スコア') {
      this.userRecordRepository.findScoresByDiscordId(msg.member.id, (err, result) => {
        if (err) return;
        if (result.length === 0) {
          msg.react('⚠');
          return;
        }
        msg.reply(`スコアは${result.reduce((a, c) => a + c.score, 0)}です。`)
      })
    }
  }
}
Object.assign(Natsukashiimono.prototype, BasicRoleFilter);

export default Natsukashiimono;
