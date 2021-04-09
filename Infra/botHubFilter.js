/**
 * # botHubFilter
 * msgの内容によってメソッドを呼ぶか呼ばないかを決めるためのフィルターです。
 * trueの場合はそのメソッドが呼ばれます。
 * BaseBotを継承したクラスに実装してください。
 * 使用例：ロールのないユーザーにはボットを使えないようにする。
 */

/**
 * フィルターのインターフェイス
 */
export const Filterable = {
  onMessageFilter(msg) {
    return true;
  },
  onMessageUpdateFilter(oldMsg, newMsg) {
    return true;
  },
  onMessageReactionAddFilter(msgReaction, user) {
    return true;
  },
}

/**
 * DMを使用しないBOTの開発であれば基本的に実装するべきフィルター
 */
export const BasicFilter = {
  onMessageFilter(msg) {
    return !msg.author.bot && msg.member
  },
  onMessageUpdateFilter(oldMsg, newMsg) {
    return !newMsg.author.bot && newMessage.member;
  },
  onMessageReactionAddFilter(msgReaction, user) {
    return !user.bot && msgReaction.message.guild;
  },
}

/**
 * ロールがないと使えないBOTに実装すべきフィルター
 */
export const BasicRoleFilter = {
  onMessageFilter(msg) {
    return !msg.author.bot && msg.member?.roles.cache.size >= 2
  },
  onMessageUpdateFilter(oldMsg, newMsg) {
    return !newMsg.author.bot && newMessage.member?.roles.cache.size >= 2;
  },
  onMessageReactionAddFilter(msgReaction, user) {
    return !user.bot && msgReaction.message.guild;
  },
}

/**
 * ロールがないユーザーになにかするBOTに実装するべきフィルター
 */
export const BasicNoRoleFilter = {
  onMessageFilter(msg) {
    return !msg.author.bot && msg.member?.roles.cache.size < 2
  },
  onMessageUpdateFilter(oldMsg, newMsg) {
    return !newMsg.author.bot && newMessage.member?.roles.cache.size < 2;
  },
  onMessageReactionAddFilter(msgReaction, user) {
    return !user.bot && msgReaction.message.guild;
  },
}
