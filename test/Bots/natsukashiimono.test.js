import Natsukashiimono from '../../Bots/natsukashiimono.js';

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
  let natsukashiimono = new Natsukashiimono(null, repositorySuccessMock);
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
  natsukashiimono = new Natsukashiimono(null, repositoryErrorMock);
  natsukashiimono.onMessage(errMsgMock);
});

test('点数の集計', done => {
    const baseRepositoryMock = {
    findScoresByDiscordId: (id, callback) => { //err, result
      expect(id).toBe("12345");
      done();
    }
  }
  const repositorySuccessMock = { ...baseRepositoryMock };
  repositorySuccessMock.findScoresByDiscordId = (id, callback) => {
    baseRepositoryMock.findScoresByDiscordId(id, callback);
    callback(null, [{
      discordId: "12345",
      score: 100
    },
    {
      discordId: "12345",
      score: 20
    },
    {
      discordId: "12345",
      score: 3
    }]);
  };
  const repositorySuccessButEmptyMock = { ...baseRepositoryMock };
  repositorySuccessButEmptyMock.findScoresByDiscordId = (id, callback) => {
    baseRepositoryMock.findScoresByDiscordId(id, callback);
    callback(null, []);
  };
  const repositoryErrorMock = { ...baseRepositoryMock };
  repositoryErrorMock.findScoresByDiscordId = (id, callback) => {
    baseRepositoryMock.findScoresByDiscordId(id, callback);
    callback({test: "Error"});
  };
  const msgMock = {
    content: "スコア",
    member: { id: "12345" },
    reply: content => {
      expect(content).toBe('スコアは123です。')
      done();
    },
    react: content => {
      expect(content).toBe('⚠')
      done();
    }
  };
  const errMsgMock = {
    content: "スコア",
    member: { id: "12345" },
  };
  let natsukashiimono = new Natsukashiimono(null, repositorySuccessMock);
  natsukashiimono.onMessage(msgMock);
  natsukashiimono = new Natsukashiimono(null, repositorySuccessButEmptyMock);
  natsukashiimono.onMessage(msgMock);
  natsukashiimono = new Natsukashiimono(null, repositoryErrorMock);
  natsukashiimono.onMessage(errMsgMock);
})