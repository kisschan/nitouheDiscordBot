import { BasicFilter, Filterable } from '../../../Infra/Bot/botHubFilter.js';

const user = {
  bot: false
};
const bot = {
  bot: true
};
const botMsg = {
  author: {
    ...bot
  },
  member: { // Guild Member
    id: '12345'
  }
};
const noBotMsg = {
  author: {
    ...user
  },
  member: {
    id: '67890'
  }
};
const reaction = {
  message: {
    guild: {
      id: '11111'
    }
  }
};
const noGuildReaction = {
  message: {
    guild: null
  }
};

test("インターフェースのテスト", () => {
  const msg = undefined;
  const newMsg = undefined;
  const reaction = undefined;
  const user = undefined;
  expect(Filterable.onMessageFilter(msg)).toBe(true);
  expect(Filterable.onMessageUpdateFilter(msg, newMsg)).toBe(true);
  expect(Filterable.onMessageReactionAddFilter(reaction, user)).toBe(true);
});

// BasicFilterのテスト

test("BasicFilter#onMessageFilterの正常系テスト", () => {
  expect(BasicFilter.onMessageFilter(botMsg)).toBeFalsy();
  expect(BasicFilter.onMessageFilter(noBotMsg)).toBeTruthy();
});

test("BasicFilter#onMessageFilterの異常系テスト", () => {
  expect(() => { // 引数なしだとTypeError
    BasicFilter.onMessageFilter()
  }).toThrow(TypeError);
});

test("BasicFilter#onMessageUpdateFilterの正常系テスト", () => {
  expect(BasicFilter.onMessageUpdateFilter(noBotMsg, noBotMsg)).toBeTruthy();
  expect(BasicFilter.onMessageUpdateFilter(noBotMsg, botMsg)).toBeFalsy();
  expect(BasicFilter.onMessageUpdateFilter(undefined, botMsg)).toBeFalsy();
  expect(BasicFilter.onMessageUpdateFilter(botMsg, noBotMsg)).toBeTruthy();
});

test("BasicFilter#onMessageUpdateFilterの異常系テスト", () => {
  expect(() => { // 引数なしだとTypeError
    BasicFilter.onMessageUpdateFilter()
  }).toThrow(TypeError);
  expect(() => { // 第二引数なしだとTypeError
    BasicFilter.onMessageUpdateFilter(undefined)
  }).toThrow(TypeError);
});

test("BasicFilter#onMessageFilterの正常系テスト", () => {
  expect(BasicFilter.onMessageReactionAddFilter(reaction, user)).toBeTruthy();
  expect(BasicFilter.onMessageReactionAddFilter(reaction, bot)).toBeFalsy();
  expect(BasicFilter.onMessageReactionAddFilter(noGuildReaction, user)).toBeFalsy();
});

test("BasicFilter#onMessageFilterの異常系テスト", () => {
  expect(() => { // 第一数なしだとTypeError
    BasicFilter.onMessageReactionAddFilter()
  }).toThrow(TypeError);
  expect(() => { // 第二引数なしだとTypeError
    BasicFilter.onMessageReactionAddFilter(user)
  }).toThrow(TypeError);
});
