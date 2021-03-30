// それぞれのイベントに対応するメソッドを呼ぶかどうかのフィルター
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
