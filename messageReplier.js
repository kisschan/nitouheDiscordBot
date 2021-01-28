
class MessageReplier {
  constructor() {

  }

  onMessage(msg) {
    if (msg.content === 'はさみ将棋') {
    msg.reply(`https://sdin.jp/browser/board/hasami/`)
  }
  }


}

export default MessageReplier;