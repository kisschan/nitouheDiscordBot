import Arashine from '../arashine.js';

const generateBanMock = shouldBeCalled => {
  const shouldBeCalledFunc = option => {
    expect(option.days).toBe(7);
    done();
  }
  const shouldNotBeCalledFunc = option => {
    throw new Error('theis ban method should not be called');
  }
  return shouldBeCalled ? shouldBeCalledFunc : shouldNotBeCalledFunc;
}

const generateDeleteMock = shouldBeCalled => {
  const shouldBeCalledFunc = () => {
    done();
  }
  const shouldNotBeCalledFunc = () => {
    throw new Error('theis ban method should not be called');
  }
  return shouldBeCalled ? shouldBeCalledFunc : shouldNotBeCalledFunc;
}

test("３回同じ発言をした人はBANされる", done => {
  const msgMock = {
    member: { 
      id: "14142",
      ban: generateBanMock(false),
      delete: generateDeleteMock(false)
    },
    content: "arashidesuo",
    mentions: {
      everyone: false,
      roles: {
        size: 0
      }
    }
  }
  var arashine = new Arashine();
  arashine.onMessage(msgMock);
  arashine.onMessage(msgMock);
  var lastMsgMock = { ... msgMock }
  lastMsgMock.member.ban = generateBanMock(true);
  arashine.onMessage(lastMsgMock);
  done()
});

test("everyoneにメンションしてる人は消される", done => {
  const msgMock = {
    member: { 
      id: "14142",
      ban: generateBanMock(false),
      delete: generateDeleteMock(true)
    },
    content: "arashidesuo",
    mentions: {
      everyone: true,
      roles: {
        size: 0
      }
    }
  }
  var arashine = new Arashine();
  arashine.onMessage(msgMock);
  done()
});

test("rolesにメンションしてる人は消される", done => {
  const msgMock = {
    member: { 
      id: "14142",
      ban: generateBanMock(false),
      delete: generateDeleteMock(true)
    },
    content: "arashidesuo",
    mentions: {
      everyone: false,
      roles: {
        size: 3
      }
    }
  }
  var arashine = new Arashine();
  arashine.onMessage(msgMock);
  done()
});

test("2回の発言ではBANされず、3回目に繰り返す発言を変更したら、5回目じゃないとBANされない", done => {
  const msgMock = {
    member: { 
      id: "14142",
      ban: generateBanMock(false),
      delete: generateDeleteMock(false)
    },
    content: "arashidesuo",
    mentions: {
      everyone: false,
      roles: {
        size: 0
      }
    }
  }
  var arashine = new Arashine();
  arashine.onMessage(msgMock);
  arashine.onMessage(msgMock);
  var changeMsgMock = { ... msgMock }
  changeMsgMock.content = "kaetayo-akkya-";
  arashine.onMessage(changeMsgMock);
  arashine.onMessage(changeMsgMock);
  arashine.onMessage(changeMsgMock);
  var willBanMsgMock = { ... changeMsgMock }
  willBanMsgMock.member.ban = generateBanMock(true);
  arashine.onMessage(willBanMsgMock);
  done()
})