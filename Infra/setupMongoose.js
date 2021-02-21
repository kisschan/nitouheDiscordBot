export class SetupMongoose {

  constructor(mongoose) { // mongooseオブジェクト
    this.mongoose = mongoose
    this.valid = false;
  }

  setup(baseURL, dbName, nodeEnv) {
    if (!baseURL) {
      console.log('警告：環境変数(.env)にMONGO_CONNECTION_STRINGが指定されていません。');
      this.valid = false;
      return;
    }
    const uri = this.getMognoCompleteUri(baseURL, dbName, nodeEnv);
    if (uri) { // TODO: nullでないときに有効という甘い条件なので、ここは要検討
      this.valid = true;
    }
    this.mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  }

  getMognoCompleteUri(baseURL, dbName, nodeEnv) {
  if (!baseURL || !dbName) return null;
    const prefixByEnv = nodeEnv === 'production' ? '' : 'dev-';
    return baseURL + prefixByEnv + dbName;
  };

  isValid() {
    return this.valid;
  }

}