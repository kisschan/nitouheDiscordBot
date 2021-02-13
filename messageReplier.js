class MessageReplier {

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
        
    } else if (/^(?:ほほ?ー?う|なんと|いえいえ|[うふ]ー?む|おう)[wWｗＷ!！]?$/.test(msg.content)) {
    
      msg.react('🖕');
      
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
      
    }

  }

}
export default MessageReplier;
