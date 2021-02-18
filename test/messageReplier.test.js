import MessageReplier from '../messageReplier.js';

test('はさみ将棋と打つと該当のURLをリプライする', done => {
  const replier = new MessageReplier();
  const msgMock = {
    content: "はさみ将棋",
    reply: (s) => {
      expect(s).toBe("https://sdin.jp/browser/board/hasami/")
      done();
    }
  }
  replier.onMessage(msgMock);
});