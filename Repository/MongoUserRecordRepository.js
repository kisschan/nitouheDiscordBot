
import {NitoheScore} from '../Entity/NitoheScore.js'

export const addNitouheScore = (discordId, score, callback) => {
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

export const findScoresByDiscordId = (discordId, callback) => {
  NitoheScore.find({discordId: discordId}, callback)
}

