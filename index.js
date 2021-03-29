import dotenv from 'dotenv';
dotenv.config();

import { Client } from 'discord.js';
import { ExampleBot, BotHub } from './Infra/bot.js';

import mongoose from 'mongoose';
import { SetupMongoose } from './Infra/setupMongoose.js';
const setupMongoose = new SetupMongoose(mongoose);
setupMongoose.setup(process.env.MONGO_CONNECTION_STRING, 'app', process.env.NODE_ENV);

import Voting from './Bots/voting.js';
import Nuke from './Bots/nuke.js';
import NitouheReplier from './Bots/nitouheReplier.js';
import MessageReplier from './messageReplier.js';
import JukeBox from './Bots/jukeBox.js';
import Arashine from './Bots/arashine.js';
import Natsukashiimono from './Bots/natsukashiimono.js';
import { Bank } from './Service/moneys.js'
import { MongoUserRecordRepository } from './Repository/MongoUserRecordRepository.js';
import { MongoMoneyRecordRepository} from './Repository/MongoMoneyRecordRepository.js'

const client = new Client();
const bank = new Bank(new MongoMoneyRecordRepository());
const botHub = new BotHub();
botHub.add(new ExampleBot(client));
botHub.add(new NitouheReplier(client));
botHub.add(new Nuke(client));
botHub.add(new Voting(client));
botHub.add(new Arashine(client));
botHub.add(new JukeBox(client));
if (setupMongoose.isValid()) {
  botHub.add(new Natsukashiimono(client, new MongoUserRecordRepository()));
}

const messageReplier = new MessageReplier();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  botHub.onReady();
});

client.on('message', async msg => {
  botHub.onMessage(msg);
  if (msg.author.bot || !msg.member) return;
    messageReplier.censorMessage(msg);
  messageReplier.censorMessage(msg);
  if (msg.member.roles.cache.size < 2) return;
  messageReplier.onMessage(msg);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  botHub.onMessageUpdate(oldMessage, newMessage);
});

client.on('messageReactionAdd', async (msgReaction, user) => {
  botHub.onMessageReactionAdd(msgReaction, user);
  if (user.bot || !msgReaction.message.guild) return;
  messageReplier.onReactionAdded(msgReaction, user);
});

const BOT_TOKEN = process.env.BOT_TOKEN; // Discord Botのトークン環境変数
client.login(BOT_TOKEN);
