import {addNitouheScore, findScoresByDiscordId} from './Repository/MongoUserRecordRepository.js'

export class Natsukashiimono {
  onMessage(msg) {
    const targetId = '756871421984112701';

    if (/<@!([0-9]+)>\s*はい\s*([0-9]*)点/.test(msg.content)) {
      if (msg.member.id !== targetId) {
        return;
      }
      const result = /<@!([0-9]+)>\s*はい\s*([0-9]*)点/.exec(msg.content);
      const userId = result[1];
      const score = result[2];

      addNitouheScore(userId, score, err => {
        if (err) console.log(err)
      });
    }
    if (msg.content === 'スコア') {
      findScoresByDiscordId(msg.member.id, (err, result) => {
        if (err) return;
        if (result.length === 0) return;
        msg.reply(result.reduce((a, c) => a.score + c.score))
      })
    }
  }
}
