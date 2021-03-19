
class voting{
    constructor(){

    }

    async onMessage(msg){
      if(msg.content === '投票'){
        msg.reply('投票内容を言ってください')
      }
    }
}