import { BasicRoleFilter } from "../Infra/Bot/botHubFilter.js";
import { BaseBot} from "../Infra/Bot/core.js";

class Bank extends BaseBot {

  constructor(client, userRecordRepository) {
      super(client);

      this.userRecordRepository = userRecordRepository;
      this.role_cost = 1;
      this.role_costarray = {'うんこ':-1000,'ブースト':-100,'強ブースト':-500,'オリジナル':-1000,'支配人':-100000,'上級もなちゃと民':-10000,'中級もなちゃと民':-1000,'下級もなちゃと民':-100,'debug':100000,'undebug':-100000,'ナースコール':-2000,'バーベキュー':-4000,'デスバインド':-2000}
      this.Moneymultiple = 1;
      this.PreUNIX = 0;
      this.Autoboost = 0;
      this.createrole_Lv = 0;
      this.createrole_userId = '';
      this.createrole_Name = '';
      this.createrole_Wrongcolor = false;
      this.createrole_Color = '';
      this.createrole_ColorName = {'ホワイト':'WHITE','アクア':'AQUA','グリーン':'GREEN','ブルー':'BLUE','イエロー':'YELLOW','パープル':'PURPLE',
      '鮮やかなピンク':'LUMINOUS_VIVID_PINK','ゴールド':'GOLD','オレンジ':'ORANGE','レッド':'RED','グレー':'GREY','暗めのグレー':'DARKER_GREY',
      'ネイビー':'NAVY','ダークアクア':'DARK_AQUA','ダークグリーン':'DARK_GREEN','ダークブルー':'DARK_BLUE','ダークパープル':'DARK_PURPLE',
      'ダークピンク':'DARK_VIVID_PINK','ダークゴールド':'DARK_GOLD','ダークオレンジ':'DARK_ORANGE','ダークレッド':'DARK_RED','ダークグレー':'DARK_GREY',
      'ライトグレー':'LIGHT_GREY','ダークネイビー':'DARK_NAVY','ブループル':'BLURPLE','グレイプル':'GREYPLE','ダーク':'DARK_BUT_NOT_BLACK',
      'ややブラック':'NOT_QUITE_BLACK','ランダム':'RANDOM'};
      this.Deathbind_msg_count = 0;
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

    iscost(){
      return this.role_cost;
    }

    isBBQ(msg){
    if(msg.member.roles.cache.has('833386640096755713') && this.ismoneymultiple() !== 1){
      return 3;
    }else{
      return 1;
    }
    }

    israndom(random_number){
     return Math.floor(Math.random() * random_number) + 1;
    }

    isDeathbind_kuji(msg){
      if(this.Deathbind_msg_count !== 0 && this.Deathbind_msg_count%25 === 0 && msg.member.roles.cache.has('835437532568092693')){
        const kuji = this.israndom(8)*25;
        msg.guild.channels.cache.get('835443857482842152').send(`デスバインドの効果でクジを引く!\n${msg.member.displayName}に${kuji}ポイントがデスバインドの効果で追加された！`);
        return kuji;
      }else{
        return 0;
      }
    }

    cost(rolename){
      if(this.role_costarray.hasOwnProperty(rolename) && typeof rolename == "string"){
        this.role_cost = this.role_costarray[rolename];
      }else if(typeof rolename == "number"){
        this.role_cost = rolename;
      }

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

    autoboost(notchathour,msg){
      if(msg.member.roles.cache.has('832935326758600725')){
        this.Autoboost = notchathour * 75 * 2;
      }else{
      this.Autoboost = notchathour * 75;
      }
    }

    resetautoboost(){
      this.Autoboost = 0;
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
      this.createrole_Color = this.createrole_ColorName[msg.content];
    };

    reset_craterole(){
      this.createrole_Lv = 0;
      this.createrole_userId = '';
      this.createrole_Name = '';
      this.createrole_Wrongcolor = false;
      this.createrole_Color = '';
    }

    deathbind_msg_count_add(){
     this.Deathbind_msg_count++;
    }

  
  
    async onMessage(msg) {
      super.onMessage(msg);
      if(/^[$＄]オリジナル$/.test(msg.content) && this.iscreate_roleLv() === 0 && (msg.guild.id === '804641873847255051' || msg.guild.id === '822064180219084820')){
        this.cost('オリジナル');
        const money = this.iscost();
        this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
          if(err) return;
          if(result.reduce((a, c) => a + c.money, 0) + money > 0){
            msg.react('👌');
            this.createrole_userid(msg);
            this.createrole_Lvset(1);
            msg.reply(`作りたいロールの名前を言ってください\nキャンセルの場合はキャンセルといってください`);
            return;
          }else{
            msg.react('⚠');
            return;
          }
      　})
        
    
      }else if(/^(?:[きキｷ][ゃャｬ][んンﾝ][せセｾ][るルﾙ])$/.test(msg.content) && this.iscreate_roleLv() > 0 ){
        msg.reply('キャンセルされました');
        this.reset_craterole();
      }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 1){
        this.createrole_name(msg);
        msg.reply(`作りたいロールは${this.iscreate_rolename()}でよろしいですか❓\nはいかいいえでお願いします。`)
        this.createrole_Lvset(2);
      }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 2 && msg.content !== 'いいえ' && msg.content !== 'はい' && !this.iscreate_wrongcolor()){
        msg.reply('はいかいいえで答えないと進みません');
      }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 2 && msg.content === 'いいえ'){
        this.createrole_Lvset(1);
        msg.reply('もう一回作りたいロール名をお願い致します')
      }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 2 && (msg.content === 'はい' || this.iscreate_wrongcolor())){
        msg.reply(`次に作りたいロールの色を以下の中からお願い致します。\nホワイト:アクア\nグリーン:ブルー\nイエロー:パープル\n鮮やかなピンク:ゴールド\nオレンジ:レッド\nグレー:暗めのグレー\nネイビー:ダークアクア\nダークグリーン:ダークブルー\nダークパープル:ダークピンク\nダークゴールド:ダークオレンジ\nダークレッド:ダークグレー\nライトグレー:ダークネイビー\nブループル:グレイプル\nダーク:ややブラック\nランダム`)
        this.createrole_Lvset(3);
      }else if(!/^(ホワイト|アクア|グリーン|ブルー|イエロー|パープル|鮮やかなピンク|ゴールド|オレンジ|レッド|グレー|暗めのグレー|ネイビー|ダークアクア|ダークグリーン|ダークブルー|ダークパープル|ダークピンク|ダークゴールド|ダークオレンジ|ダークレッド|ダークグレー|ライトグレー|ダークネイビー|ブループル|グレイプル|ダーク|ややブラック|ランダム)$/.test(msg.content) && msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 3){
        this.createrole_Lvset(2);
        this.createrole_wrongcolor();
        msg.reply('不正な値です。なにか話すとロールの色選択に戻ります')
      }else if(/^(ホワイト|アクア|グリーン|ブルー|イエロー|パープル|鮮やかなピンク|ゴールド|オレンジ|レッド|グレー|暗めのグレー|ネイビー|ダークアクア|ダークグリーン|ダークブルー|ダークパープル|ダークピンク|ダークゴールド|ダークオレンジ|ダークレッド|ダークグレー|ライトグレー|ダークネイビー|ブループル|グレイプル|ダーク|ややブラック|ランダム)$/.test(msg.content) && msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 3){
        this.createrole_color(msg);
        this.createrole_Lvset(4);
        msg.reply(`作りたいロールの名前(${this.iscreate_rolename()})\n色(${this.iscreate_rolecolor()})でよろしいですね？\nはいかいいえでお願いします\n※色が英語になるのは仕様です`);
      }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 4 && msg.content !== 'いいえ' && msg.content !== 'はい'){
        msg.reply('はいかいいえで答えないと進みません');
      }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 4 && msg.content === 'いいえ'){
        this.createrole_Lvset(1);
        msg.reply('ロールの名前からもう一度お伺いします');
      }else if(msg.member.id === this.iscreate_userid() && this.iscreate_roleLv() === 4 && msg.content === 'はい'){
        const userId = this.iscreate_userid();
        const money = -1000;
        this.userRecordRepository.findMoneyByDiscordId(msg.member.id, async (err, result) => {
        if(err) return;
        if(result.reduce((a, c) => a + c.money, 0) + money > 0){
          const Role = await msg.guild.roles.create({
            data:{
              name: this.iscreate_rolename(),
              color: this.iscreate_rolecolor(),
         },
          reason:'要請があったため',
        })
          msg.member.roles.add(Role);
          this.userRecordRepository.addMoneyscore(userId, money, err => {
          msg.react(err?'⚠':'💸');
          msg.reply(err?'購入できません':'購入できました');
          });
        }
        this.reset_craterole();
        return;
      　})
      }
      if(msg.guild.id === '804641873847255051' || msg.guild.id === '822064180219084820'){
        const userId = msg.member.id
      if(this.ispreUNIX() !== 0){
        const nowUNIX = Math.floor(this.isDate().getTime()/1000);
        const CalUNIX = Math.floor((nowUNIX - this.ispreUNIX())/1800);//3600で一時間
      if(CalUNIX > 0){
        this.autoboost(CalUNIX,msg);
      }
      }
      if((msg.member.id === '719528011707449436' || msg.guild.id === '804641873847255051' ) && msg.content === 'debug'){
        this.cost('debug');
      }else if((msg.member.id === '719528011707449436' || msg.guild.id === '804641873847255051' ) && msg.content === 'undebug'){
        this.cost('undebug');  
      }else{
        this.cost(1*this.ismoneymultiple()*this.isBBQ(msg) + this.isautoboost() + this.isDeathbind_kuji(msg));
      }
     if(this.isautoboost() > 0){
        msg.reply(`過疎防止ボーナスとして${this.isautoboost()}インジャネドルを追加でプレゼント！`)
        this.resetautoboost();
      }
      if(msg.member.roles.cache.has('835437532568092693')){
      this.deathbind_msg_count_add();
      }

    
    const money = this.iscost();
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
      const rolesarray = ['うんこ','ブースト','強ブースト','支配人','上級もなちゃと民','中級もなちゃと民','下級もなちゃと民','ナースコール','バーベキュー','デスバインド'];
      const rolename = msg.content.slice(1);
      const userId = msg.member.id;
    if(rolesarray.indexOf(rolename) === -1){
      msg.react('🤔')
      return;
    }
    if(msg.content.indexOf('うんこ') !== -1){
      if(msg.guild.id !== '804641873847255051'){
        msg.react('⚠');
        return;
    }
    if(msg.member.roles.cache.has('830428707104751645')){
      msg.react('🔍')
      return;
    }
    }

   if(rolesarray.indexOf(rolename,3) !== -1 && msg.guild.id === '804641873847255051'){
     msg.reply('指定されたロールはこのギルドにありません');
      return;
    }
      
    if((rolename === '支配人' && msg.member.roles.cache.has('822064757908439060')) ||
    (rolename === '上級もなちゃと民' && msg.member.roles.cache.has('822065804760842260')) || 
    (rolename === '中級もなちゃと民' && msg.member.roles.cache.has('822069302860447764')) || 
    (rolename === '下級もなちゃと民' && msg.member.roles.cache.has('822114345416785991')) || 
    ((rolename === 'ブースト' || rolename === '強ブースト') && this.ismoneymultiple() !== 1) ||
    (rolename === 'ナースコール' && msg.member.roles.cache.has('832935326758600725')) ||
    (rolename === 'バーベキュー' && msg.member.roles.cache.has('833386640096755713')) ||
    (rolename === 'デスバインド' && msg.member.roles.cache.has('835437532568092693'))
    ){
      msg.react('🔍')
      return;
    }
    this.cost(rolename);
    const money = this.iscost();
    
    this.userRecordRepository.findMoneyByDiscordId(msg.member.id, (err, result) => {
      if(err) return;
      if(result.reduce((a, c) => a + c.money, 0) + money > 0){
        msg.reply('購入できました')
      if(msg.content.indexOf('うんこ') !== -1){
        msg.member.roles.add('830428707104751645');}
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
      }else if(rolename === 'ナースコール'){
        msg.member.roles.add('832935326758600725');
      }else if(rolename === 'バーベキュー'){
        msg.member.roles.add('833386640096755713');
      }else if(rolename === 'デスバインド'){
        msg.member.roles.add('835437532568092693');
      }
      this.userRecordRepository.addMoneyscore(userId, money, err => {
        msg.react(err?'⚠':'💸');
      });
    }else{
      msg.react('⚠');
      return;
    }
  })
  }
  }
}

Object.assign(Bank.prototype, BasicRoleFilter);
export { Bank as Bank };