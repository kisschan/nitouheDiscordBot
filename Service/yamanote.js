export class Yamanote {

  constructor() {
    this.state = yamanoteStateTypes.stop;
    this.mode = null;
  }

  async onMessage(msg) {
    switch(this.state) {
      case yamanoteStateTypes.stop:
        this.onMessageStopped(msg);
      case yamanoteStateTypes.select:
        this.onMessageSelecting(msg);
      case yamanoteStateTypes.ongoing:
        this.onMessageOngoing(msg);
    }
  }

  onMessageStopped(msg) {
    if (msg.content === 'yamanote') {
      msg.reply('山手線ゲームはじまるどー');
      this.state = yamanoteStateTypes.select
    }
  }

  onMessageSelecting(msg) {
    if (msg.content === 'country') {
      msg.reply('国モードだお〜');
      this.state = yamanoteStateTypes.ongoing;
    }
  }

  onMessageOngoing(msg) {
    if (msg.content === '日本') {
      msg.react('🇯🇵');
      msg.reply('うーむｗ')
      this.state = yamanoteStateTypes.stop;
    }
  }

}

const yamanoteStateTypes = {
  stop: 'stop',
  select: 'select',
  ongoing: 'ongoing',
  result: 'result'
}

const yamanoteModeTypes = {
  country: 'country'
}