import { BaseBot } from '../Infra/bot.js';

class NitouheReplier extends BaseBot {

  constructor(client) {
    super(client);
    this.status = false;
    this.HP = 20;
    this.count = 1;
    this.arashiarray =[];
    this.blocklistarray=[];
    this.debugstage=0;
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

  changeHP(msg){
    this.HP=msg.content;
  }

  changecount(msg){
    this.count=msg.content;
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

  adddebug(debugnum){
   this.debugstage+=debugnum;
   return this.debugstage;
  }

  resetdebug(){
   this.debugstage = 0;
  }

  isdebug(){
   return this.debugstage;
  }

   async onMessage(msg) {
        super.onMessage(msg);
        if(msg.guild.id === '794882838666543114'){
         var emoji = `${msg.guild.emojis.cache.find(e => e.name === 'nitouhe')}<`;
         }else if(msg.guild.id === '804641873847255051'){
         var emoji = `${msg.guild.emojis.cache.find(e => e.name === 'anzen_kisuke')}<`;
         }
        if(emoji === void 0){
        var emoji = `🐱<`
        }
    
        if(this.isBlocklist(msg))
          return;

          if(msg.content === '!on' && this.isHP()>0){
            this.on();
            msg.reply(`${emoji}はいおは`)
            this.deleteHP(msg);
          }else if(msg.content === '!off'){
            this.off();
          }
          if (!this.isAvailable())
            return;
          if(this.iscount()>2 && ( msg.member.roles.cache.size < 2 || msg.member.id === "813000558503788584" || msg.member.id === '812703512407834686'))
          return;
     
          if(msg.content === '!debug' && msg.guild.id === '804641873847255051' && this.isdebug() === 0){
            msg.channel.send(`何を変更しますか？\n体力:hp\n疲労度:count\nと発言`)
            this.adddebug(1);}
          else if (( !/^(?!\?)(?:([HＨ][PＰ]|[CＣ][oＯ][UＵ][NＮ][TＴ]))$/i.test(msg.content) && this.isdebug() === 1 ) || (!/^\d+$/.test(msg.content) && this.isdebug() === 2)){
            msg.reply('デバッグ中に予期しない文字が入力されました')
            this.resetdebug();
            return;
          }
          else if (/^(?!\?)(?:([HＨ][PＰ]))$/i.test(msg.content) && this.isdebug() === 1){
            msg.channel.send(`体力に代入したい数をどうぞ(現在の体力${this.isHP()})`)
            this.adddebug(1);}
          else if(/^\d+$/.test(msg.content) && this.isdebug() === 2){
          this.changeHP(msg);
          msg.channel.send(`体力は${this.isHP()}になりました`)
          this.resetdebug();
          }
          else if(/^(?!\?)(?:([CＣ][oＯ][UＵ][NＮ][TＴ]))$/i.test(msg.content) && this.isdebug() === 1){
          msg.channel.send(`疲労度に代入したい数をどうぞ(現在の疲労度${this.iscount()})`)
          this.adddebug(2);}
          else if(/^\d+$/.test(msg.content) && this.isdebug() === 3){
          this.changecount(msg);
          msg.channel.send(`疲労度は${this.iscount()}になりました`)
          this.resetdebug();
            }
          else if(msg.content === 'debugstage'){
            msg.reply(`デバッグステージは${this.isdebug()}です`)
          }
          
          if((/(?!\?)(?:はい|入)る[わよか]?$/.test(msg.content) || 
          (/(?!\?)(?:[すスｽ]る)[わよか]?$/.test(msg.content) || 
          /(?:たまちゃん|tama)/.test(msg.content) || 
          /(?:乞食|[こコｺ][じジｼﾞ][きキｷ]|[死氏市４4しシｼ][ねネﾈ]|[うウｳ失][せセｾ][ろロﾛ]|[消きキｷ][えエｴ][ろロﾛ]|([くクｸ][さサｻ]|臭)い)/.test(msg.content) || 
          /(?!\?)(?:([あアｱ][らラﾗ]|荒)[ぶブﾌﾞ][りリﾘ][そソｿ][うウｳ][だダﾀﾞ])/.test(msg.content) ||
          /^(?!\?)(?:([りリﾘ][ゅュｭ][うウｳ]|[竜龍])([すスｽ][けケｹ]|[介助]))$/.test(msg.content)
           ) && this.iscount()>1)){
            let random = Math.floor(Math.random()*10)+1;
            if(random<(this.iscount())){
              const randomreply_tekitou = ['今いそがしくてｗ','ああねむい！','もう疲れてるんですよｗ','ou','ほほーう','ほう','ho-u','hou','はいはいｗ','ああ体がだるい！']
            　msg.reply(`HP(${this.isHP()})${emoji}` + randomreply_tekitou[Math.floor(Math.random() * randomreply_tekitou.length)])
              return;
            }
          }

          if(/(?!\?)(?:はい|入)る[わよか]?$/.test(msg.content)){ 
            this.deleteHP(msg);
            msg.reply(`HP(${this.isHP()})${emoji}おうはいれ`)
          }else if(/(?!\?)(?:[すスｽ]る)[わよか]?$/.test(msg.content)){
            this.deleteHP(msg);
            msg.reply(`HP(${this.isHP()})${emoji}おうしろ`)
          }else if(/(?:たまちゃん|tama)/.test(msg.content)){
            this.deleteHP(msg);
            msg.reply(`HP(${this.isHP()})${emoji}なにがたまちゃんじゃい！`)
          }else if(/(?:乞食|[こコｺ][じジｼﾞ][きキｷ]|[死氏市４4しシｼ][ねネﾈ]|[うウｳ失][せセｾ][ろロﾛ]|[消きキｷ][えエｴ][ろロﾛ]|([くクｸ][さサｻ]|臭)い)/.test(msg.content)){
            const randomreply = ['いえいえ','むっ','そういう言葉は控えましょう','さて','許せんなー','むっまたぐだついてきたな！'];
            this.deleteHP(msg);
            msg.reply(`HP(${this.isHP()})${emoji}` + randomreply[Math.floor(Math.random() * randomreply.length)])
          }else if(/(?!\?)(?:([あアｱ][らラﾗ]|荒)[ぶブﾌﾞ][りリﾘ][そソｿ][うウｳ][だダﾀﾞ])/.test(msg.content)){
            this.deleteHP(msg);
            const randomreply_araburi = ['いえいえｗ','あらぶらんでくださーいｗ','すぐ荒ぶるｗ','あっまたｗ','もうやめましょうw']
            msg.reply(`HP(${this.isHP()})${emoji}` + randomreply_araburi[Math.floor(Math.random() * randomreply_araburi.length)])
          }else if(/^(?!\?)(?:([りリﾘ][ゅュｭ][うウｳ]|[竜龍])([すスｽ][けケｹ]|[介助]))$/.test(msg.content)){
　　　　　　　this.deleteHP(msg);
             const randomreply_ryuusuke = ['おう','むっなにかな','はいなんでしょう','うむ','なにかな？','よんだかな'];
             msg.reply(`HP(${this.isHP()})${emoji}` + randomreply_ryuusuke[Math.floor(Math.random() * randomreply_ryuusuke.length)])
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
