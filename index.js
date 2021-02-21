import dotenv from 'dotenv';
dotenv.config();
const BOT_TOKEN = process.env.BOT_TOKEN; // Discord Botのトークン環境変数

import { Client } from 'discord.js';

import mongoose from 'mongoose';
import { SetupMongoose } from './Infra/setupMongoose.js';
const setupMongoose = new SetupMongoose(mongoose);
setupMongoose.setup(process.env.MONGO_CONNECTION_STRING, 'app', process.env.NODE_ENV);

import MessageReplier from './messageReplier.js';
import JukeBox from './jukeBox.js';
import { Natsukashiimono } from './Service/natsukashiimono.js';
import { MongoUserRecordRepository } from './Repository/MongoUserRecordRepository.js';

const messageReplier = new MessageReplier();
const jukeBox = new JukeBox();
const natsukashiimono = new Natsukashiimono(new MongoUserRecordRepository());

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  if (msg.author.bot) return;
  messageReplier.onMessage(msg);
  jukeBox.onMessage(msg);
  natsukashiimono.onMessage(msg);
});

client.on('messageReactionAdd', async (msgReaction, user) => {
  if(user.bot) return;
  messageReplier.onReactionAdded(msgReaction, user);
});

client.login(BOT_TOKEN);