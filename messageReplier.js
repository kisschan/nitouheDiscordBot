const DELETE_COUNT = 3;
const DELETE_EMOJI = '🗑️';


const getContents = function (msg) {
  let contents = [];
  if (msg.content)
    contents.push(/^https?:\/\/.+/.test(msg.content) ? msg.content.match(/([^\/]+)\/*$/)[1] : msg.content);
  if (msg.attachments.size)
    msg.attachments.each(media => contents.push(media.url.match(/([^\/]+)\/*$/)[1]));
  return contents;
};


class MessageReplier {

  constructor() {
    this.deletedContents = {};
  }
  
  async onMessage(msg) {
  
    if (msg.content === 'はさみ将棋') {
    
      msg.reply(`https://sdin.jp/browser/board/hasami/`);
      
    } else if (msg.content === 'ブログ') {//blogランダム表示
    
      var blogs = [
        'https://ryuusukegun.hatenablog.com/',
        'https://ryusukeshibu.hatenablog.com/',
        'https://nnsn.hatenablog.com/',
        'https://rumerume.hatenablog.com/',
        'https://glance.hatenablog.com/',
        'https://noonemona.hatenablog.com/'
      ];
      var random = Math.floor(Math.random() * blogs.length);
      msg.reply(blogs[random]);
      
    } else if(/^wiki$/i.test(msg.content)) {
    
      msg.reply('https://w.atwiki.jp/ryusukegun2touhei/');
    
    } else if (/[死氏市四４4しシｼ][ねネﾈ][よヨょョﾖｮ]?$/.test(msg.content)) {
    
        //TODO: 二等兵に怒られない範囲でなにかしたい
        //msg.delete()
        
    } else if (/^(?:ほほ?ー?う|なんと|いえいえ|[うふ]ー?む|おうよ?)[wWｗＷ!！]?$/.test(msg.content)) {
    
      msg.react('🖕');
      
    } else if (/(?:[うウｳ][んンﾝ][こコｺ]|unn?ko|💩)/.test(msg.content)) {
    
      msg.react('💩');
      
    }  else if (/(?<![死氏市四４4しシｼ][んンﾝ][でデﾃﾞ]|sh?inn?de)(?:いいか)[？❓?❔¿‽]?$/i.test(msg.content)) {
      msg.react('👍');
      
    } else if (msg.content === '竜介軍') {
    
      const members = await msg.guild.members.fetch();
      const rolemembers = members.filter(member => {
        return member.roles.cache.has('803689557173207062') && member.presence.status !== 'offline'
      });
      msg.reply(`竜介軍は${rolemembers.size}人いますお`);
      
    } else if (msg.content === 'メンバー') {
    
      const members = await msg.guild.members.fetch();
      const ryusukeMembers = members.filter(member => {
        return member.displayName.includes('竜介軍') && member.presence.status !== 'offline'
      });
      msg.reply(`竜介軍は${ryusukeMembers.size}人いますお`);
      
    } else if(msg.content === 'ping'){
      const version = process.env.npm_package_version;
      msg.reply(`バージョンは${version}です`);
    } else if(/^(?:[ろロﾛ][おオｵーうウｳ][るルﾙ][ばバﾊﾞ][っッｯ][くクｸ]|rollback)/i.test(msg.content)) {
      const messages = await msg.channel.messages.fetch({ limit: 100 });
      const filtered = messages.filter(msg => (msg.member.roles && msg.member.roles.cache.size < 2) || msg.author.bot);
      msg.channel.bulkDelete(filtered);
      msg.delete();
    } else if (/^解除\s\d+$/.test(msg.content)) {
      msg.guild.members.unban(msg.content.split(/\s/)[1]).then(() => msg.react('✅')).catch(err => {
        console.error(err);
        msg.react('⚠');
      });
    }

  }

   async onReactionAdded(msgReaction, user) {
     if (
       msgReaction.emoji.name === DELETE_EMOJI &&
       msgReaction.users.cache.filter(user => {
         if (user.bot)
           return false;
         const member = msgReaction.message.guild.member(user.id);
         return member && member.roles.cache.size > 1
       }).size >= DELETE_COUNT
     ) {
       const msg = msgReaction.message;
       msg.delete();
       getContents(msg).forEach(content => this.deletedContents[content] = true);
       return;
     }
     msgReaction.message.react(msgReaction.emoji);
   }

   censorMessage(msg) {
     if (!msg.deleted && getContents(msg).some(content => this.deletedContents[content]))
       msg.delete();
   }

}


export default MessageReplier;
