
import { NitoheScore } from '../Entity/NitoheScore.js'
<<<<<<< HEAD
=======
import { MoneyScore } from '../Entity/Money.js'
>>>>>>> parent of 3861686 (エラー吐く)

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
<<<<<<< HEAD
=======

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

  

>>>>>>> parent of 3861686 (エラー吐く)
}
