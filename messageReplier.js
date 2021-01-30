class MessageReplier {
  async onMessage(msg) {
    if (msg.content === 'はさみ将棋') {
      msg.reply(`https://sdin.jp/browser/board/hasami/`);
    }
    if (msg.content === 'ブログ') {//blogランダム表示
    var blogs = ['https://ryuusukegun.hatenablog.com/','https://ryusukeshibu.hatenablog.com/','https://nnsn.hatenablog.com/','https://rumerume.hatenablog.com/','https://glance.hatenablog.com/'];
    var random = Math.floor(Math.random() * blogs.length);
      msg.reply(blogs[random]);
    }
    if(/^wiki$/i.test(msg.content)){
        msg.reply('https://w.atwiki.jp/ryusukegun2touhei/')
    }
    if (msg.content === 'メンバー') {
    const members = await msg.guild.members.fetch();
    const ryusukeMembers = members.filter(member => {
      return member.displayName.includes("竜介軍") && member.presence.status !== 'offline'
    });
    msg.reply(`竜介軍は${ryusukeMembers.size}人いますお`);
  }
  }
}
export default MessageReplier;
