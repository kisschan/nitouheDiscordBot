import { BaseBot, BotHub } from '../../../Infra/Bot/core.js';

const client = {};

class DerivedBot extends BaseBot {

}

test('BaseBotの標準機能のテスト', () => {
  const baseBot = new BaseBot(client);
  expect(baseBot.botName).toBe('BaseBot');
  expect(baseBot.botName).not.toBe(client);
});

test('BaseBotにBasicFilterが標準で組み込まれている', () => {
  const baseBot = new BaseBot(client);
  expect(baseBot.onMessageFilter).toBeTruthy();
})

test('派生クラスだとbotNameプロパティがそのクラス名になる', () => {
  const derivedBot = new DerivedBot(client);
  expect(derivedBot.botName).toBe('DerivedBot');
});

test('BotHubの初期状態テスト', () => {
  const botHub = new BotHub(client);
  expect(botHub.bots).toHaveLength(0);
});

test('BotHubにBotを追加するテスト', () => {
  const botHub = new BotHub(client);
  expect(botHub.bots).toHaveLength(0);
  
  const derivedBot = new DerivedBot(client);
  botHub.add(derivedBot);
  expect(botHub.bots).toHaveLength(1);

  const derivedBot2 = new DerivedBot(client);
  botHub.add(derivedBot2);
  expect(botHub.bots).toHaveLength(2);
});

test('BotHubの追加のバリデーター', () => {
  const bothub = new BotHub(client);
  bothub.add(new Date());
  bothub.add({});
  bothub.add();
  expect(bothub.bots).toHaveLength(0);
});
