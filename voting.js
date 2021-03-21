
class voting{
    constructor(){
     this.votename = "";
     this.voteid = "";
     this.voteMembers = [];
     this.agreeMembers = [];
     this.disagreeMembers = [];
     this.agreeMembersName =[];
     this.disagreeMembersName = [];
     this.voteLv = 0;
     this.agree = 0;
     this.disagree = 0;
     this.arashiarray=[];
     this.blocklistarray=[];
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

    isagreemembersname(){
        if(this.agreeMembersName.length === 0){
            return "なし"
        }else{
        return this.agreeMembersName;}
    }
    
    isdisagreemembersname(){
        if(this.disagreeMembersName.length === 0){
            return "なし"
        }else{
        return this.disagreeMembersName;}
    }
    
    voter(msg){
        this.voteMembers.push(msg.member.id);
    }

    votetime(votingtimetec,callback){
      setTimeout(callback,votingtimetec*1000)
    }

    votefin(msg){
        msg.reply(`投票内容:${this.isvotename()}\n賛成${this.isagree()}賛成したメンバー:${this.isagreemembersname()}\n反対${this.isdisagree()}反対したメンバー${this.isdisagreemembersname()}`);
        msg.pin({reason:"投票結果"})
        this.votename = "";
        this.voteid = "";
        this.voteMembers = [];
        this.agreeMembers = [];
        this.disagreeMembers = [];
        this.agreeMembersName =[];
        this.disagreeMembersName = [];
        this.voteLv = 0;
        this.agree = 0;
        this.disagree = 0;
        msg.reply('投票を終わります');
    }

    votecooltime(votecooltimetec,callback){
        this.voteLv++;
        setTimeout(callback,votecooltimetec*1000);
    }

    deletevoteLv(){
        this.voteLv--;
    }


    addagreemembers(msg){
        this.agreeMembers.push(msg.member.id);
        this.agreeMembersName.push(msg.member.displayName);
    }

    adddisagreemembers(msg){
        this.disagreeMembers.push(msg.member.id);
        this.disagreeMembersName.push(msg.member.displayName);
    }

    deleteagreemembers(msg){
        this.agreeMembers.forEach((item, index) => {
            if(item === msg.member.id){
                return this.agreeMembers.splice(index, 1);
            }
        
        });
        this.agreeMembersName.forEach((item, index) => {
            if(item === msg.member.displayName){
                return this.agreeMembersName.splice(index,1);
            }
        
        });

    }

    deletedisagreemembers(msg){
        this.disagreeMembers.forEach((item, index) => {
            if(item === msg.member.id){
                return this.disagreeMembers.splice(index, 1);
            }
        });

        this.disagreeMembersName.forEach((item, index) => {
            if(item === msg.member.displayName){
                return this.disagreeMembersName.splice(index, 1);
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

    arashi(msg){
        this.arashiarray.push(msg.author.id);
        let arashicount = this.arashiarray.filter((x) => {return x===msg.author.id}).length;
        if(arashicount > 2){
          this.blocklist(msg);
        }
        if(msg.member.roles.cache.size > 1 || msg.member.id !== "813000558503788584" || msg.member.id !== '812703512407834686'){
          setTimeout(() => {
            if(this.arashiarray.length>0){
            this.arashiarray.shift();
            }},1000*60*2)
        }
      }

    blocklist(msg){
        this.blocklistarray.push(msg.author.id);
        msg.reply(`${msg.member.displayName}をブロックリストに追加`)
      }

    unblock(msg){
       this.blocklistarray = [];
       this.arashiarray = [];
       msg.reply('ブロックリストを空にしました')
    }
    
    

 

    async onMessage(msg){

      if(msg.member.roles.cache.size < 2 || msg.member.id === "813000558503788584" || msg.member.id === '812703512407834686')
       return;

      if(msg.content === '投票' && this.isvoteLv() === 0){
        msg.reply('投票内容を言ってください')
        this.addvoteLv();
        this.voteID(msg);
        }else if(this.isvoteLv() === 1 && this.isvoteID() === msg.member.id){
          msg.pin({reason:"投票内容"})
          msg.reply(`${msg.content}の投票を開始します 期限は3時間です`)
          this.voteName(msg)
          this.addvoteLv();
          this.votetime(60*60*3,() => {
              this.votefin(msg);
            })
      }else if(/^(?:[しシｼ][ゅュｭ][うウｳ][けケｹ][いイｲ]|集計|[けケｹ][っッｯ][かカｶ]|結果)/.test(msg.content) && this.isvoteLv() === 2){
　　　　　msg.reply(`投票内容:${this.isvotename()}\n賛成${this.isagree()}\n賛成したメンバー:${this.isagreemembersname()}\n反対${this.isdisagree()}\n反対したメンバー${this.isdisagreemembersname()}`)
         this.arashi(msg);
         this.votecooltime(60,() => {
             this.deletevoteLv();
         });
      }else if(msg.content === '投票解禁' &&( msg.member.id === '719528011707449436'|| msg.member.id === '756871421984112701' || msg.member.id === '807177155095429121')){
         this.unblock(msg);
      }else if(/^(?:[まマﾏ][るルﾙ]|maru|[◎〇○丸])$/i.test(msg.content) && this.isvoteLv() > 1){
        if(this.isagreemembers().includes(msg.member.id))
        return;
        if(this.isdisagreemembers().includes(msg.member.id)){
          this.deletedisagree()
          this.deletedisagreemembers(msg)
        }
        this.addagree();
        this.addagreemembers(msg);
    }else if(/^(?:[ばバﾊﾞ][つツﾂ]|batu|[×☓✖✕✗✘])$/i.test(msg.content) && this.isvoteLv() >1){
        if(this.isdisagreemembers().includes(msg.member.id))
        return;
        if(this.isagreemembers().includes(msg.member.id)){
        this.deleteagree()
        this.deleteagreemembers(msg)
      }
        this.adddisagree();
        this.adddisagreemembers(msg);
    }
      }
    }
export default voting;