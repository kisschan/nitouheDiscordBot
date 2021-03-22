
/*
 * Discord.jsのクライアントのイベントを持つクラス。
 * NOTE: ボットの実装は各自このクラスを起点に行う。
 */
export class BaseBot {

  constructor(client) {
    this.client = client;
  }

  async onReady() {
  }
  
  async onMessage(msg) {
  }

  async onMessageUpdate(oldMsg, newMsg) {
  }

  async onMessageReactionAdd(msgReaction, user) {
  }
}

/*
 * ボットの実装をDiscord.jsに自動的に割り振るハブです。
 */
export class BotHub {

  constructor(client) {
    this.client = client;
  }

  bots = [];

  add(bot) {
    if (!(bot instanceof BaseBot)) {
      console.error('BotHubに追加できるのはBaseBotの派生クラスのみです。');
      return;
    }
    if (!bot.client) {
      console.warn('BaseBotがclientを持っていません。');
    }
    this.bots.push(bot);
  }

  async onReady() {
    this.bots.forEach(b => b.onReady());
  }

  async onMessage(msg) {
    this.bots.forEach(b => b.onMessage(msg));
  }

  async onMessageUpdate(oldMsg, newMsg) {
    this.bots.forEach(b => b.onMessageUpdate(oldMsg, newMsg));
  }

  async onMessageReactionAdd(msgReaction, user) {
    this.bots.forEach(b => b.onMessageReactionAdd(msgReaction, user));
  }
}


export class ExampleBot extends BaseBot {
  onMessage(msg) {
    super.onMessage(msg);
  }
}
