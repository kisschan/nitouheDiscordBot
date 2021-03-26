export class Moneys {

    constructor(userRecordRepository) {
      this.userRecordRepository = userRecordRepository;
    }
  
    onMessage(msg) {
      const userId = msg.member.id
      const money = 1;

        this.userRecordRepository.addMoneyscore(userId, money, err => {
          if (err) {
            msg.react('⚠');
          } else {
            msg.react('✅');
          }
        });
      if (msg.content === '金') {
        this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
          if (err) return;
          msg.reply(`所持金は${result.reduce((a, c) => a + c.money, 0)}です。`)
        })
      }
    }
  }