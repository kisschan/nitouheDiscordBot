import { DiscordAPIError} from "discord.js";

class NitouheReplier {

  constructor() {
    this.status = false;
    this.HP = 10;
    this.count = 1;
    this.arashiarray =[];
    this.blocklistarray=[];
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

  iscount(){
    return this.count;
  }
  
  isBlocklist(msg){
    return this.blocklistarray.includes(msg.author.id);
  }
  deleteHP(msg) {
    if(msg.member.displayName === 'Amateur"キスケ"' || msg.member.roles.cache.size < 2){
    this.HP = this.HP-2;
    }else{
    this.HP--;}
   this.arashi(msg);
  }

  addHP(recoverTimeSec, callback){
  this.status = false;
  setTimeout(callback ,1000*recoverTimeSec);
  }

  resur(msg){
    msg.reply('ﾆﾄｳﾍは戻ってきたようだ');
    this.status = true;
    this.HP = 10;
    this.count++;
    setTimeout(() => {
      this.count--;
    },1000*60*15)
  }

  arashi(msg){
    this.arashiarray.push(msg.author.id);
    let arashicount = this.arashiarray.filter((x) => {return x===msg.author.id}).length;
    if(arashicount > 4){
      this.blocklist(msg);
    }
    if(msg.member.roles.cache.size > 1){
      setTimeout(() => {
        if(this.arashiarray.length>0){
        this.arashiarray.shift();
        }},1000*30)
    }
  }

  
  blocklist(msg){
    this.blocklistarray.push(msg.author.id);
    msg.reply(`${msg.member.displayName}をブロックリストに追加`)
  }

   async onMessage(msg) {

        if(msg.guild.id === '794882838666543114'){
         var emoji = `HP(${this.isHP()})${msg.guild.emojis.cache.find(e => e.name === 'nitouhe')}<`;
         }else if(msg.guild.id === '804641873847255051'){
         var emoji = `HP(${this.isHP()})${msg.guild.emojis.cache.find(e => e.name === 'anzen_kisuke')}<`;
         }
    
        if(this.isBlocklist(msg))
          return;

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
            msg.reply(`${emoji}うんこしてくる`)
            this.addHP(60*this.iscount(), () => {
              this.resur(msg);
            });
          }else if(random === 2){
            msg.reply(`${emoji}飯食うわ`)
            this.addHP(60*2*this.iscount(), () => {
              this.resur(msg);
            });
          }else if(random === 3){
            msg.reply(`${emoji}ではねます`)
            this.addHP(60*3*this.iscount(), () => {
              this.resur(msg);
            });
            return;
          }
        
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
