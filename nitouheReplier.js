class NitouheReplier {

  constructor() {
    this.status = false;
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
  
  async onMessage(msg) {
    if(msg.content === '!on'){
      this.on();
    }else if(msg.content === '!off'){
      this.off();
    }
    if (!this.isAvailable())
      return;
    if(/(?!\?)(?:はい|入)る[わよか]?$/?.test(msg.content)){
      msg.reply('おうはいれ')
    }else if(/(?!\?)(?:[すスｽ]る)[わよか]?$/.test(msg.content)){
      msg.reply('おうしろ')
    }else if(/(?:たまちゃん|tama)/.test(msg.content)){
      msg.reply('なにがたまちゃんじゃい！')
    }else if(/(?:乞食|[こコｺ][じジｼﾞ][きキｷ]|[死氏市４4しシｼ]ね|[う失]せろ|[消きキｷ][えエｴ][ろロﾛ]|([くクｸ][さサｻ]|臭)い)/.test(msg.content)){
      const randomreply = ['いえいえ','むっ','そういう言葉は控えましょう','さて'];
      msg.reply(randomreply[Math.floor(Math.random() * randomreply.length)])
    }
    
  }

}

export default NitouheReplier;
