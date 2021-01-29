import dotenv from 'dotenv';
dotenv.config();
import includedInWhitelist from './whitelist.js';
const BOT_TOKEN = process.env.BOT_TOKEN; // Discord Botのトークン環境変数

import { Client } from 'discord.js';
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
  if (!includedInWhitelist(msg)) return;
  messageReplier.onMessage(msg);
  jukeBox.onMessage(msg);
});

client.login(BOT_TOKEN);