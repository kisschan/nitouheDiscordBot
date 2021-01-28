class MessageReplier {
  async onMessage(msg) {
    if (msg.content === 'はさみ将棋') {
      msg.reply(`https://sdin.jp/browser/board/hasami/`);
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
