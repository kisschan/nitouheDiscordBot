import { BasicRoleFilter } from "../Infra/botHubFilter.js";
import { BaseBot} from "../Infra/bot.js";

class Bank extends BaseBot {

    constructor(client, userRecordRepository) {
      super(client);

      this.userRecordRepository = userRecordRepository;
      this.moneyNum = 1;
    }

    ismoney(){
      return this.moneyNum;
    }

    addmoney(dealmoney){
     this.moneyNum = dealmoney;
    }
  
    onMessage(msg) {
    super.onMessage(msg);
    if(msg.guild.id === '804641873847255051' || msg.guild.id === '822064180219084820'){
    const userId = msg.member.id
    if(msg.member.id === '719528011707449436' && msg.content === 'debug'){
    this.addmoney(100000);
    }else{
    this.addmoney(1);
    }
    const money = this.ismoney();



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
    return;
    })
    }
    if(/^[$＄]/.test(msg.content)){
    const rolesarray = ['うんこ','支配人','上級もなちゃと民','中級もなちゃと民','下級もなちゃと民'];
    const rolename = msg.content.slice(1);
    const userId = msg.member.id
    if(rolesarray.indexOf(rolename) === -1){
    msg.react('🤔')
    return;}
    if(msg.content.indexOf('うんこ') !== -1){
    if(msg.guild.id !== '804641873847255051'){
    msg.react('⚠');
    return;
    }
    if(msg.member.roles.cache.has('825277808925868062')){
     msg.react('🔍')
    return;
    }
    this.addmoney(-50);
    }

   if(rolesarray.indexOf(rolename,1) !== -1 && msg.guild.id === '804641873847255051'){
    msg.reply('指定されたロールはこのギルドにありません');
    return;}
      
        
    if(rolename === '支配人'){
    if(msg.member.roles.cache.has('822064757908439060')){
    msg.react('🔍')
    return;
    }
    this.addmoney(-100000);
    }else if(rolename === '上級もなちゃと民'){
    if(msg.member.roles.cache.has('822065804760842260')){
    msg.react('🔍')
    return;
    }
    this.addmoney(-10000);
    }else if(rolename === '中級もなちゃと民'){
    if(msg.member.roles.cache.has('822069302860447764')){
    msg.react('🔍')
    return;
    }
    this.addmoney(-1000);
    }else if(rolename === '下級もなちゃと民'){
    if(msg.member.roles.cache.has('822114345416785991')){
    msg.react('🔍')
    return;
    }
    this.addmoney(-100);
    }

   const money = this.ismoney();
    
    this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
    if(err) return;
    if(result.reduce((a, c) => a + c.money, 0) + money > 0){
    msg.reply('ロールが買えました')
    if(msg.content.indexOf('うんこ') !== -1){
    msg.member.roles.add('825277808925868062');}
    else if(rolename === '支配人'){
    msg.member.roles.add('822064757908439060');
    }else if(rolename === '上級もなちゃと民'){
    msg.member.roles.add('822065804760842260');
    }else if(rolename === '中級もなちゃと民'){
    msg.member.roles.add('822069302860447764');
    }else if(rolename === '下級もなちゃと民'){
    msg.member.roles.add('822114345416785991');
    }
    this.userRecordRepository.addMoneyscore(userId, money, err => {
    msg.react(err?'⚠':'💸');
    });
  }
  })
  }
  }
}

Object.assign(Bank.prototype, BasicRoleFilter);
export { Bank as Bank };