import { MoneyScore } from '../Entity/Money.js'

export class MongoMoneyRecordRepository{
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