const AGREE_emoji = '👍'
const DISAGREE_emoji = '👎'

class voting{
    constructor(){
     this.votename = "";
     this.voteid = "";
     this.voteMembers = [];
     this.agreeMembers = [];
     this.disagreeMembers = [];
     this.voteLv = 0;
     this.agree = 0;
     this.disagree = 0;
    }

 
    
    voteName(msg){
     this.votename = msg.content;
    }

    voteID(msg){
        this.voteid = msg.member.id;
    }

    addvoteLv(){
        this.voteLv++;
    }
    
    resetvoteLv(){
        this.vote = 0;
    }
    
    isvotename(){
       return this.votename;
    }

    isvoteID(){
        return this.voteid;
    }

    isvoteLv(){
        return this.voteLv;
    }

    isagree(){
        return this.agree;
    }

    isdisagree(){
        return this.disagree;
    }

    isvoiter(){
        return this.voteMembers;
    }

    isagreemembers(){
        if(this.agreeMembers.length === 0){
            return "なし"
        }else{
        return this.agreeMembers;}
    }

    isdisagreemembers(){
        if(this.disagreeMembers.length === 0){
            return "なし"
        }else{
        return this.disagreeMembers;}
    }

    voter(msgReaction){
        this.voteMembers.push(msgReaction.message.member.user.id);
    }

    addagreemembers(msgReaction){
        this.agreeMembers.push(msgReaction.message.member.user.id);
    }

    adddisagreemembers(msgReaction){
        this.disagreeMembers.push(msgReaction.message.member.user.id);
    }

    deleteagreemembers(msgReaction){
        this.agreeMembers.forEach((item, index) => {
            if(item === msgReaction.message.member.user.id){
                return this.agreeMembers.splice(index, msgReaction.message.member.user.id);
            }
        });
    }

    deleteadisagreemembers(msgReaction){
        this.disagreeMembers.forEach((item, index) => {
            if(item === msgReaction.message.member.user.id){
                return this.disagreeMembers.splice(index, msgReaction.message.member.user.id);
            }
        });
    }


    addagree(){
     this.agree++;
    }

    adddisagree(){
     this.disagree++;
    }

    deleteagree(){
        this.agree--;
    }

    deletedisagree(){
        this.disagree--;
    }
    

 

    async onMessage(msg){
      if(msg.content === '投票' && this.isvoteLv() === 0){
        msg.reply('投票内容を言ってください')
        this.addvoteLv();
        this.voteID(msg);
        }else if(this.isvoteLv() === 1 && this.isvoteID() === msg.member.id){
          msg.reply(`${msg.content}の投票を開始します`)
          this.addvoteLv()
          this.voteName(msg)
      }else if(/^(?:[しシｼ][ゅュｭ][うウｳ][けケｹ][いイｲ]|集計|[けケｹ][っッｯ][かカｶ]|結果)/.test(msg.content)){
　　　　　msg.reply(`投票内容:${this.isvotename()}\n賛成${this.isagree()}賛成したメンバー:${this.isagreemembers()}\n反対${this.isdisagree()}反対したメンバー${this.isdisagreemembers()}`)
      }
    }
    async onReactionAdded(msgReaction, user){
        if((msgReaction.emoji.name === AGREE_emoji || msgReaction.emoji.name === DISAGREE_emoji) &&
         msgReaction.message.content === this.isvotename() && 
         msgReaction.users.cache.filter(user => {
             if (user.bot)
               return false;
             const member = msgReaction.message.guild.member(user.id);
             return member && member.roles.cache.size > 1
           }).size >= 1
     ){
        if(msgReaction.emoji.name === AGREE_emoji){
            if(this.isagreemembers().includes(msgReaction.message.member.user.id))
            return;
            if(this.isdisagreemembers().includes(msgReaction.message.member.user.id)){
              this.deletedisagree()
              this.deleteadisagreemembers(msgReaction)
            }
            this.addagree();
            this.addagreemembers(msgReaction);
        }
        if(msgReaction.emoji.name === DISAGREE_emoji){ 
            if(this.isdisagreemembers().includes(msgReaction.message.member.user.id))
            return;
            if(this.isagreemembers().includes(msgReaction.message.member.user.id)){
            this.deleteagree()
            this.deleteagreemembers(msgReaction)
          }
            this.adddisagree();
            this.adddisagreemembers(msgReaction);
        }
        return;
     }
       }
}
export default voting;