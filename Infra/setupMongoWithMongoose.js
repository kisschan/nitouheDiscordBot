import mongoose from 'mongoose';

export const setupMongoWithMongoose = function(connectionString) {
  mongoose.connect(connectionString)
}