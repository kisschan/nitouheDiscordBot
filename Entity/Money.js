import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MoneySchema = new Schema({
  discordId: String,
  money: Number,
  date: Date,
});
export const MoneyScore = mongoose.model('MoneyScore', MoneySchema)