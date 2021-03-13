import dotenv from 'dotenv';
dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN; // Discord Botのトークン環境変数

import { Client } from 'discord.js';

import mongoose from 'mongoose';
import { SetupMongoose } from './Infra/setupMongoose.js';
const setupMongoose = new SetupMongoose(mongoose);
setupMongoose.setup(process.env.MONGO_CONNECTION_STRING, 'app', process.env.NODE_ENV);

import Nuke from './nuke.js';
import NitouheReplier from './nitouheReplier.js';
import MessageReplier from './messageReplier.js';
import JukeBox from './jukeBox.js';
import Arashine from './arashine.js';
import { Natsukashiimono } from './Service/natsukashiimono.js';
import { MongoUserRecordRepository } from './Repository/MongoUserRecordRepository.js';

const nuke = new Nuke();
const nitouheReplier = new NitouheReplier();
const messageReplier = new MessageReplier();
const jukeBox = new JukeBox();
const arashine = new Arashine();
const natsukashiimono = new Natsukashiimono(new MongoUserRecordRepository());

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.author.bot || !msg.member)
    return;
  nuke.onMessage(msg);
  nitouheReplier.onMessage(msg);
  if (msg.member.roles.cache.size < 2) {
    arashine.onMessage(msg);
    messageReplier.censorMessage(msg);
    return;
  }
  messageReplier.onMessage(msg);
  jukeBox.onMessage(msg);
  if (setupMongoose.isValid()) {
    natsukashiimono.onMessage(msg);
  }
  messageReplier.censorMessage(msg);
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
  if (!newMessage.author.bot && newMessage.member && newMessage.member.roles.cache.size < 2)
    arashine.onMessage(newMessage);
});

client.on('messageReactionAdd', async (msgReaction, user) => {
  if (user.bot || !msgReaction.message.guild)
    return;
  messageReplier.onReactionAdded(msgReaction, user);
});

client.login(BOT_TOKEN);
