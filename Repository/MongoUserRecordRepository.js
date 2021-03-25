
import { NitoheScore } from '../Entity/NitoheScore.js'
import { MoneyScore } from '../Entity/Money.js'

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

  addMoneyscore(discordId,money,callback){
    const obj_money = new MoneyScore({
      discordId: discordId,
      money: money,
      date:Date()
    })
    obj_money.save(err => {
      if (callback) {
        callback(err)
      }
    })
  }
  

findMoneyByDiscordId(discordId, callback) {
  MoneyScore.find({discordId: discordId}, callback)
}

  

}
