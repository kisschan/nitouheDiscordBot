import { DiscordAPIError } from "discord.js";

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
    }
    this.HP--;
  }

   async onMessage(msg) {

    const emoji = msg.guild.emojis.cache.find(e => e.name === 'anzen_kisuke');

          if(msg.content === '!on'){
            this.on();
            msg.reply(`${emoji}はいおは`)
          }else if(msg.content === '!off'){
            this.off();
          }
          if (!this.isAvailable())
            return;
          if(this.isHP()<1){
            msg.reply(`${emoji}ではねます`)
            this.off();
            return;
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
