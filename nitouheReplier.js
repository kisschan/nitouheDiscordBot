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
  deleteHP() {
    this.HP--;
  }
   async onMessage(msg) {
          if(msg.content === '!on'){
            this.on();
            msg.reply('はいおは')
          }else if(msg.content === '!off'){
            this.off();
          }
          if (!this.isAvailable())
            return;
          if(this.isHP()<1){
            msg.reply('ではねます')
            this.off();
            return;
          }
          if(/(?!\?)(?:はい|入)る[わよか]?$/?.test(msg.content)){
            msg.reply('おうはいれ')
            this.deleteHP();
          }else if(/(?!\?)(?:[すスｽ]る)[わよか]?$/.test(msg.content)){
            msg.reply('おうしろ')
            this.deleteHP();
          }else if(/(?:たまちゃん|tama)/.test(msg.content)){
            msg.reply('なにがたまちゃんじゃい！')
            this.deleteHP();
          }else if(/(?:乞食|[こコｺ][じジｼﾞ][きキｷ]|[死氏市４4しシｼ]ね|[う失]せろ|[消きキｷ][えエｴ][ろロﾛ]|([くクｸ][さサｻ]|臭)い)/.test(msg.content)){
            const randomreply = ['いえいえ','むっ','そういう言葉は控えましょう','さて'];
            msg.reply(randomreply[Math.floor(Math.random() * randomreply.length)])
            this.deleteHP();
          }
      
        }
      
      }

export default NitouheReplier;
