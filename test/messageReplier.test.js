import MessageReplier from '../messageReplier.js';

test('はさみ将棋と打つと該当のURLをリプライする', async done => {
  const replier = new MessageReplier();
  const msgMock = {
    content: "はさみ将棋",
    reply: (s) => {
      expect(s).toBe("https://sdin.jp/browser/board/hasami/")
      done();
    }
  }
  await replier.onMessage(msgMock);
});

test('ブログと打つと該当のURLをリプライする', async done => {
  const blogs = [
    'https://ryuusukegun.hatenablog.com/',
    'https://ryusukeshibu.hatenablog.com/',
    'https://nnsn.hatenablog.com/',
    'https://rumerume.hatenablog.com/',
    'https://glance.hatenablog.com/',
    'https://noonemona.hatenablog.com/'
  ];
  const replier = new MessageReplier();
  const msgMock = {
    content: "ブログ",
    reply: (s) => {
      expect(blogs).toContain(s)
      done();
    }
  }
  await replier.onMessage(msgMock);
});

test('wikiと打つと竜介軍のWikiをリプライする', async done => {
  const replier = new MessageReplier();
  const generateMsgMock = (done, content) => {
    const url = 'https://w.atwiki.jp/ryusukegun2touhei/';
    return {
      content: content,
      reply: (s) => {
        expect(s).toBe(url);
        done();
      }
    }
  } 
  await replier.onMessage(generateMsgMock(() => {}, 'wiki'));
  await replier.onMessage(generateMsgMock(() => {}, '暇だからwikiでも見るか'));
  await replier.onMessage(generateMsgMock(() => {}, 'WIKI'));
  await replier.onMessage(generateMsgMock(() => {}, 'WikI'));
  await replier.onMessage(generateMsgMock(() => {expect(true).toBe(false)}, 'wiiとkiwiと私'));
  done();
});