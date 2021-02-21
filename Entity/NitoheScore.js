import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NitoheScoreSchema = new Schema({
  discordId: String,
  score: Number,
  date: Date,
});
export const NitoheScore = mongoose.model('NitoheScore', NitoheScoreSchema)