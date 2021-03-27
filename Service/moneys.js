export class Moneys {

    constructor(userRecordRepository) {
      this.userRecordRepository = userRecordRepository;
    }
  
    onMessage(msg) {
      if(msg.guild.id === '804641873847255051' || msg.guild.id === '822064180219084820'){
      const userId = msg.member.id
      const money = 1;

        this.userRecordRepository.addMoneyscore(userId, money, err => {
          if (err) {
            msg.react('⚠');
          } 
          if(!err && msg.guild.id === "804641873847255051"){
            msg.react('✅');
          }
        });
      }
      if (msg.content === '金') {
        this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
          if (err) return;
          msg.reply(`所持金は${result.reduce((a, c) => a + c.money, 0)}インジャネドルです。`)
        })
      }
      if(/^[$＄]/.test(msg.content) && (msg.guild.id === '804641873847255051' || msg.guild.id === '822064180219084820')){
        const userId = msg.member.id
        if(msg.content.indexOf('うんこ') !== -1){
        if(msg.guild.id !== '804641873847255051'){
          return;
        }
        var money = -50;
        }
       this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
         if(err) return;
         if(result.reduce((a, c) => a + c.money, 0) + money > 0){
           msg.reply('ロールが買えました')
           if(msg.content.indexOf('うんこ') !== -1){msg.member.roles.add('825277808925868062');}
           this.userRecordRepository.addMoneyscore(userId, money, err => {
            if (err) {
              msg.react('⚠');
            } 
            if(!err){
              msg.react('💸');
            }
          });
         }
       })
      }
    }
}
    
  