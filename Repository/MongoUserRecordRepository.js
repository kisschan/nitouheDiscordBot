
import { NitoheScore } from '../Entity/NitoheScore.js'

export class MongoUserRecordRepository {
  addNitouheScore(discordId, score, callback) {
    const obj = new NitoheScore({
      discordId: discordId,
      score: score,
      data: Date()
    })
    obj.save(err => {
      if (callback) {
        callback(err)
      }
    })
  }

  findScoresByDiscordId(discordId, callback) {
    NitoheScore.find({discordId: discordId}, callback)
  }
}
