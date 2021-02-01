class Natsukashiimono {
  onMessage(msg) {
    const targetId = '756871421984112701';
    if (msg.member.id !== targetId) {
      return;
    }
    if (/<@!([0-9]+)>\s*はい\s*([0-9]*)点/.test(msg.content)) {
      const result = /<@!([0-9]+)>\s*はい\s*([0-9]*)点/.exec(msg.content);
      const userId = result[1];
      const score = result[2];
      console.log(`${userId};${score}`);
    }
    
  }
}

export { Natsukashiimono as Natsukashiimono};