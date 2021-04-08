import { BasicRoleFilter } from "../Infra/botHubFilter.js";
import { BaseBot} from "../Infra/bot.js";

class Bank extends BaseBot {

    constructor(client, userRecordRepository) {
      super(client);

      this.userRecordRepository = userRecordRepository;
      this.moneyNum = 1;
      this.Moneymultiple = 1;
      this.PreUNIX = 0;
      this.Autoboost = 0;
      this.createrole_Lv = 0;
      this.createrole_userId = '';
      this.createrole_Name = '';
      this.createrole_Wrongcolor = false;
      this.createrole_Color = '';
    }

    ismoney(){
      return this.moneyNum;
    }

    ismoneymultiple(){
      return this.Moneymultiple;
    }

    isDate(){
      return new Date();
    }

    ispreUNIX(){
      return this.PreUNIX;
    }

    isautoboost(){
      return this.Autoboost;
    }

    iscreate_roleLv(){
      return this.createrole_Lv;
    }

    iscreate_userid(){
      return this.createrole_userId;
    }

    iscreate_rolename(){
      return this.createrole_Name;
    }

    iscreate_wrongcolor(){
      return this.createrole_Wrongcolor;
    }

    iscreate_rolecolor(){
      return this.createrole_Color;
    }


    addmoney(dealmoney){
     this.moneyNum = dealmoney;
    }
    
    moneymultiple(multiple,boostmin,callback){
     this.Moneymultiple = multiple;
     setTimeout(callback,boostmin*1000*60);
    }

    boostfin(msg){
     this.Moneymultiple = 1;
     msg.reply('ブーストは終わりました');
    }

    preUNIX(){
     this.PreUNIX = Math.floor(this.isDate().getTime()/1000);
    }

    autoboost(notchathour){
      this.Autoboost = notchathour * 100;
    }

    resetautoboost(){
      this.Autoboost = 0;
    }

    createrole_Lvadd(){
      this.createrole_Lv++;
    }

    createrole_Lvdown(){
      this.createrole_Lv--;
    }

    createrole_Lvset(Lv){
      this.createrole_Lv = Lv;
    }

    createrole_userid(msg){
      this.createrole_userId = msg.member.id;
    }

    createrole_name(msg){
      this.createrole_Name = msg.content;
    }

    createrole_wrongcolor(){
      this.createrole_Wrongcolor = true;
    }

    createrole_color(msg){
      if(msg.content === 'ホワイト'){
      this.createrole_Color = 'WHITE';
      }else if(msg.content === 'アクア'){
       this.createrole_Color = 'AQUA' ;
      }else if(msg.content === 'グリーン'){
       this.createrole_Color = 'GREEN';
      }else if(msg.content === 'ブルー'){
        this.createrole_Color = 'BLUE';
      }else if(msg.content === 'イエロー'){
        this.createrole_Color = 'YELLOW';
      }else if(msg.content === '鮮やかなピンク'){
        this.createrole_Color = 'LUMINOUS_VIVID_PINK'
      }else if(msg.content === 'ゴールド'){
        this.createrole_Color = 'GOLD';
      }else if(msg.content === 'レッド'){
        this.createrole_Color = 'RED';
      }else if(msg.content === 'グレー'){
        this.createrole_Color = 'GREY';
      }
    };

    reset_craterole(){
    this.createrole_Lv = 0;
    this.createrole_userId = '';
    this.createrole_Name = '';
    this.createrole_Wrongcolor = false;
    this.createrole_Color = '';
    }

  
  
    async onMessage(msg) {
    super.onMessage(msg);
    if(/^[$＄]オリジナル$/.test(msg.content) && this.iscreate_roleLv() === 0){
      this.addmoney(-3000);
      const money = this.ismoney();
    this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
      if(err) return;
      if(result.reduce((a, c) => a + c.money, 0) + money < 0){
       msg.react('⚠');
       return;
      }
      　})
    this.createrole_userid(msg);
    this.createrole_Lvadd();
    msg.reply('作りたいロールの名前を言ってください');
    
    }else if(/^(?:[きキｷ][ゃャｬ][んンﾝ][せセｾ][るルﾙ])$/.test(msg.content) && this.iscreate_roleLv() > 0){
     msg.reply('キャンセルされました');
     this.reset_craterole();
    }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 1){
    this.createrole_name(msg);
    msg.reply(`作りたいロールは${this.iscreate_rolename()}でよろしいですか❓\nはいかいいえでお願いします。`)
    this.createrole_Lvadd();
    }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 2 && msg.content !== 'いいえ' && msg.content !== 'はい'){
      msg.reply('はいかいいえで答えないと進みません');
    }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 2 && msg.content === 'いいえ'){
     this.createrole_Lvdown(); 
     msg.reply('もう一回作りたいロール名をお願い致します')
    }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 2 && (msg.content === 'はい' || this.iscreate_wrongcolor())){
      msg.reply(`次に作りたいロールの色を以下の中からお願い致します。\nホワイト\nアクア\nグリーン\nブルー\nイエロー\n鮮やかなピンク\nゴールド\nレッド\nグレー`)
    this.createrole_Lvadd();
    }else if(!/^(ホワイト|アクア|グリーン|ブルー|イエロー|鮮やかなピンク|ゴールド|レッド|グレー)$/.test(msg.content) && msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 3){
    this.createrole_Lvdown();
    this.createrole_wrongcolor();
    msg.reply('不正な値です。なにか話すとロールの色選択に戻ります')
    }else if(/^(ホワイト|アクア|グリーン|ブルー|イエロー|鮮やかなピンク|ゴールド|レッド|グレー)$/.test(msg.content) && msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 3){
      this.createrole_color(msg);
      this.createrole_Lvadd();
      msg.reply(`作りたいロールの名前(${this.iscreate_rolename()})\n色(${this.iscreate_rolecolor()})でよろしいですね？\nはいかいいえでお願いします\n※色が英語になるのは仕様です`);
    }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 4 && msg.content !== 'いいえ' && msg.content !== 'はい'){
      msg.reply('はいかいいえで答えないと進みません');
    }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 4 && msg.content === 'いいえ'){
      this.createrole_Lvset(1);
      msg.reply('ロールの名前からもう一度お伺いします');
    }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 4 && msg.content === 'はい'){
    const Role = await msg.guild.roles.create({
    data:{
    name: this.iscreate_rolename(),
    color: this.iscreate_rolecolor(),
     },
    reason:'要請があったため',
    })
    msg.member.roles.add(Role);
    this.addmoney(-3000);
    const userId = this.iscreate_userid();
    const money = this.ismoney(); 
    this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
    if(err) return;
    if(result.reduce((a, c) => a + c.money, 0) + money < 0){
    msg.react('⚠');
    return;
    }
      　})
    this.userRecordRepository.addMoneyscore(userId, money, err => {
    msg.react(err?'⚠':'💸');
    msg.reply(err?'購入できせん':'購入できました');
    });
    this.reset_craterole();
    }
    if(msg.guild.id === '804641873847255051' || msg.guild.id === '822064180219084820'){
    const userId = msg.member.id
    if(this.ispreUNIX() !== 0){
    const nowUNIX = Math.floor(this.isDate().getTime()/1000);
    const CalUNIX = Math.floor((nowUNIX - this.ispreUNIX())/3600);
    if(CalUNIX > 0){
    this.autoboost(CalUNIX);
    }
    }
    if(msg.member.id === '719528011707449436' && msg.content === 'debug'){
    this.addmoney(100000);
    }else{
    this.addmoney(1*this.ismoneymultiple() + this.isautoboost())
    }
    if(this.isautoboost() > 0){
    msg.reply(`過疎防止ボーナスとして${this.isautoboost()}インジャネドルを追加でプレゼント！`)
    this.resetautoboost();
    }

    
    const money = this.ismoney();
    this.preUNIX();




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
    const rolesarray = ['うんこ','ブースト','強ブースト','支配人','上級もなちゃと民','中級もなちゃと民','下級もなちゃと民'];
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

   if(rolesarray.indexOf(rolename,3) !== -1 && msg.guild.id === '804641873847255051'){
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
    }else if(rolename === 'ブースト'){
    if(this.ismoneymultiple() !== 1){
    msg.react('🔍')
    return;
    }
    this.addmoney(-250);
    }else if(rolename === '強ブースト'){
    if(this.ismoneymultiple() !== 1){
    msg.react('🔍')
    return; 
    }
    this.addmoney(-1000);
    }

   const money = this.ismoney();
    
    this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
    if(err) return;
    if(result.reduce((a, c) => a + c.money, 0) + money > 0){
    msg.reply('購入できました')
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
    }else if(rolename === 'ブースト'){
    this.moneymultiple(2,60,() =>{
    this.boostfin(msg);
    });
    msg.reply(`1時間の間、インジャネドルの獲得が${this.ismoneymultiple()}倍になった`);
    }else if(rolename === '強ブースト'){
    this.moneymultiple(5,80,() =>{
    this.boostfin(msg);
    });
    msg.reply(`1.2時間の間、インジャネドルの獲得が${this.ismoneymultiple()}倍になった`);
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