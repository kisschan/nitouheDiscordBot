import { DiscordAPIError} from "discord.js";

class NitouheReplier {

  constructor() {
    this.status = false;
    this.HP = 10;

  }
  
  on() {
    this.status = true;
  }
  
  off() {
    this.status = false;
  }
  
  isAvailable() {
    return this.status;
  }
  isHP(){
    return this.HP;
  }
  deleteHP(msg) {
    if(msg.member.displayName === 'Amateur"キスケ"' || msg.member.roles.cache.size < 2){
    this.HP = this.HP-2;
    }else{
    this.HP--;}
  }

  addHP(recoverTimeSec, callback){
  this.status = false;
  setTimeout(callback ,1000*recoverTimeSec);
  }

  resur(msg){
    msg.reply('おう');
    this.status === true;
    this.HP = 10;
  }

   async onMessage(msg) {

    if(msg.guild.id === '794882838666543114'){
      var emoji = `HP(${this.isHP()})${msg.guild.emojis.cache.find(e => e.name === 'nitouhe')}<`;
    }else if(msg.guild.id === '804641873847255051'){
      var emoji = `HP(${this.isHP()})${msg.guild.emojis.cache.find(e => e.name === 'anzen_kisuke')}<`;
    }
    

          if(msg.content === '!on'){
            this.on();
            msg.reply(`${emoji}はいおは`)
          }else if(msg.content === '!off'){
            this.off();
          }
          if (!this.isAvailable())
            return;
          if(this.isHP() <1){
            const random = Math.floor(Math.random()*3)+1;
          if(random === 1){
            msg.reply(`うんこしてくる`)
            this.addHP(60, () => {
              this.resur(msg);
            });
          }else if(random === 2){
            msg.reply(`飯食うわ`)
          }else if(random === 3){
          msg.reply(`ではねます`)
          }
            this.addHP(60, () => {
              this.resur(msg);
            });
          }

          if(/(?!\?)(?:はい|入)る[わよか]?$/?.test(msg.content)){
            msg.reply(`${emoji}おうはいれ`)
            this.deleteHP(msg);
          }else if(/(?!\?)(?:[すスｽ]る)[わよか]?$/.test(msg.content)){
            msg.reply(`${emoji}おうしろ`)
            this.deleteHP(msg);
          }else if(/(?:たまちゃん|tama)/.test(msg.content)){
            msg.reply(`${emoji}なにがたまちゃんじゃい！`)
            this.deleteHP(msg);
          }else if(/(?:乞食|[こコｺ][じジｼﾞ][きキｷ]|[死氏市４4しシｼ]ね|[う失]せろ|[消きキｷ][えエｴ][ろロﾛ]|([くクｸ][さサｻ]|臭)い)/.test(msg.content)){
            const randomreply = ['いえいえ','むっ','そういう言葉は控えましょう','さて'];
            msg.reply(`${emoji}` + randomreply[Math.floor(Math.random() * randomreply.length)])
            this.deleteHP(msg);
          }
      
        }
      

  
      }

export default NitouheReplier;
