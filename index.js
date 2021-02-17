import dotenv from 'dotenv';
dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN; // Discord Botのトークン環境変数

import { Client, MessageReaction, ReactionCollector } from 'discord.js';
import MessageReplier from './messageReplier.js';
import JukeBox from './jukeBox.js';

const messageReplier = new MessageReplier();
const jukeBox = new JukeBox();

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.author.bot) return;
  messageReplier.onMessage(msg);
  jukeBox.onMessage(msg);
});

client.on('messageReactionAdd', (msgReaction, user) => {
  messageReplier.onReactionAdded(msgReaction, user);
});

client.login(BOT_TOKEN);