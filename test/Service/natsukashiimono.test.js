import { Natsukashiimono } from '../../Service/natsukashiimono.js';

test('点数の付与', done => {
  const baseRepositoryMock = {
    addNitouheScore: function (id, score, callback) { //err
      expect(id).toBe("12345");
      expect(score).toBe(5);
      done();
    }
  }
  const repositorySuccessMock = { ...baseRepositoryMock };
  repositorySuccessMock.addNitouheScore = (id, score, callback) => {
    baseRepositoryMock.addNitouheScore(id, score);
    callback(null);
  };
  const repositoryErrorMock = { ...baseRepositoryMock };
  repositoryErrorMock.addNitouheScore = (id, score, callback) => {
    baseRepositoryMock.addNitouheScore(id, score);
    callback({test: "Error"});
  };
  const msgMock = {
    content: "<@!12345> はい 5点",
    react: content => {
      expect(content).toBe('✅')
      done();
    }
  }
  let natsukashiimono = new Natsukashiimono(repositorySuccessMock);
  natsukashiimono.onMessage(msgMock);
  msgMock.content = "<@!12345>はい5てん";
  natsukashiimono.onMessage(msgMock);
  msgMock.content = "<@!12345>はい5点";
  natsukashiimono.onMessage(msgMock);
  msgMock .content = "<@!12345>　はい　5点"
  natsukashiimono.onMessage(msgMock);

  // 異常系
  const errMsgMock = {
    content: "<@!12345> はい 5点",
    react: content => {
      expect(content).toBe('⚠')
      done();
    }
  }
  natsukashiimono = new Natsukashiimono(repositoryErrorMock);
  natsukashiimono.onMessage(errMsgMock);
});
