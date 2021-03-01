import { DiscordAPIError} from "discord.js";

class NitouheReplier {

  constructor() {
    this.status = false;
    this.HP = 20;
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
    if(msg.member.id === '719528011707449436' || msg.member.roles.cache.size < 2 || msg.member.id === "813000558503788584" || msg.member.id === '812703512407834686'){
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
    msg.reply(`ﾆﾄｳﾍは戻ってきたようだ(疲労度:${this.count})`);
    this.status = true;
    this.count++;
    if(this.count<4){
      this.HP = 20-(this.count*this.count);
    }else{
      this.HP = 5;
    }
    setTimeout(() => {
      this.count--;
    },1000*60*30)
  }

  arashi(msg){
    this.arashiarray.push(msg.author.id);
    let arashicount = this.arashiarray.filter((x) => {return x===msg.author.id}).length;
    if(arashicount > 9){
      this.blocklist(msg);
    }
    if(msg.member.roles.cache.size > 1 || msg.member.id !== "813000558503788584" || msg.member.id !== '812703512407834686'){
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
         var emoji = `${msg.guild.emojis.cache.find(e => e.name === 'nitouhe')}<`;
         }else if(msg.guild.id === '804641873847255051'){
         var emoji = `${msg.guild.emojis.cache.find(e => e.name === 'anzen_kisuke')}<`;
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

          if(/(?!\?)(?:はい|入)る[わよか]?$/?.test(msg.content)){
            this.deleteHP(msg);
            msg.reply(`HP(${this.isHP()})${emoji}おうはいれ`)
          }else if(/(?!\?)(?:[すスｽ]る)[わよか]?$/.test(msg.content)){
            this.deleteHP(msg);
            msg.reply(`HP(${this.isHP()})${emoji}おうしろ`)
          }else if(/(?:たまちゃん|tama)/.test(msg.content)){
            this.deleteHP(msg);
            msg.reply(`HP(${this.isHP()})${emoji}なにがたまちゃんじゃい！`)
          }else if(/(?:乞食|[こコｺ][じジｼﾞ][きキｷ]|[死氏市４4しシｼ]ね|[う失]せろ|[消きキｷ][えエｴ][ろロﾛ]|([くクｸ][さサｻ]|臭)い)/.test(msg.content)){
            const randomreply = ['いえいえ','むっ','そういう言葉は控えましょう','さて'];
            this.deleteHP(msg);
            msg.reply(`HP(${this.isHP()})${emoji}` + randomreply[Math.floor(Math.random() * randomreply.length)])
          }

          if(this.isHP() <1){
            const random = Math.floor(Math.random()*3)+1;
          if(random === 1){
            msg.reply(`HP(${this.isHP()})${emoji}うんこしてくる`)
            this.addHP(60*this.iscount(), () => {
              this.resur(msg);
            });
            return;
          }else if(random === 2){
            msg.reply(`HP(${this.isHP()})${emoji}飯食うわ`)
            this.addHP(60*2*this.iscount(), () => {
              this.resur(msg);
            });
            return;
          }else if(random === 3){
            msg.reply(`HP(${this.isHP()})${emoji}ではねます`)
            this.addHP(60*3*this.iscount(), () => {
              this.resur(msg);
            });
            return;
          }
      
        }
      
        }
      

  
      }

export default NitouheReplier;
