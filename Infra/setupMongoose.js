export class SetupMongoose {

  constructor(mongoose) { // mongooseオブジェクト
    this.mongoose = mongoose
  }

  setup(baseURL, dbName, nodeEnv) {
    const uri = this.getMognoCompleteUri(baseURL, dbName, nodeEnv);
    this.mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  getMognoCompleteUri(baseURL, dbName, nodeEnv) {
  if (!baseURL || !dbName) return null;
    const prefixByEnv = nodeEnv === 'production' ? '' : 'dev-';
    return baseURL + prefixByEnv + dbName;
  };
}