
// それぞれのイベントに対応するメソッドを呼ぶかどうかのフィルター
const Filterable = {
  onMessageFilter(msg) {
    return !msg.author.bot && msg.member
  },
  onMessageUpdateFilter(oldMsg, newMsg) {
    return !newMsg.author.bot && newMessage.member?.roles.cache.size >= 2;
  },
  onMessageReactionAddFilter(msgReaction, user) {
    return !user.bot && msgReaction.message.guild;
  },
}

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

// mix-in https://ja.javascript.info/mixins
Object.assign(BaseBot.prototype, Filterable)

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
    this.bots.forEach(b => {
      if (b.onMessageFilter(msg))
        b.onMessage(msg);
    });
  }

  async onMessageUpdate(oldMsg, newMsg) {
    this.bots.forEach(b => {
      if (b.onMessageFilter(oldMsg, newMsg))
        b.onMessageUpdate(oldMsg, newMsg);
    });
  }

  async onMessageReactionAdd(msgReaction, user) {
    this.bots.forEach(b => {
      if (b.onMessageReactionAddFilter(msgReaction, user))
        b.onMessageReactionAdd(msgReaction, user);
    });
  }
}

export class ExampleBot extends BaseBot {
  onMessage(msg) {
    super.onMessage(msg);
  }

  onMessageReactionAdd(reaction, user) {
    super.onMessageReactionAdd(reaction, user);
  }
}
