import { SetupMongoose } from '../../Infra/setupMongoose.js';

const testBaseURL = 'mongodb+srv://example.com/';
const testDBName = 'testDB'

test('URLの組み立てが正常に行われることのテスト', () => {
  const setupMongoose = new SetupMongoose(null);
  const uri = setupMongoose.getMognoCompleteUri(testBaseURL, testDBName, 'production');
  expect(uri).toBe('mongodb+srv://example.com/testDB');
});

test('URLの組み立てのときに開発環境を指定しているときのテスト', () => {
  const setupMongoose = new SetupMongoose(null);
  const uri = setupMongoose.getMognoCompleteUri(testBaseURL, testDBName, 'developement');
  expect(uri).toBe('mongodb+srv://example.com/dev-testDB');
});

test('URLの組み立てのときに環境を指定していないときのテスト', () => {
  const setupMongoose = new SetupMongoose(null);
  const uri = setupMongoose.getMognoCompleteUri(testBaseURL, testDBName, '');
  expect(uri).toBe('mongodb+srv://example.com/dev-testDB');
});

test('mongoose.connectが呼ばれることのテスト', done => {
  const setupMongoose = new SetupMongoose({
    connect: uri => {
      expect(uri).toBe('mongodb+srv://example.com/testDB');
      done();
    }
  });
  setupMongoose.setup(testBaseURL, testDBName, 'production');
})

// 異常系

test('URLの組み立てのときにurlが入ってないときのテスト', () => {
  const setupMongoose = new SetupMongoose(null);
  const uri = setupMongoose.getMognoCompleteUri('', testDBName, 'production');
  expect(uri).toBeNull();
});

test('URLの組み立てのときにdbNameが入ってないときのテスト', () => {
  const setupMongoose = new SetupMongoose(null);
  const uri = setupMongoose.getMognoCompleteUri(testBaseURL, '', 'production');
  expect(uri).toBeNull();
});

