import ytdl from "discord-ytdl-core";

const _getYtdlConnectionDispatcher = function(connection, url) {
  const stream = ytdl(url, {
    filter: "audioonly",
    opusEncoded: true,
    encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
  });
  const dispatcher = connection.play(stream, {
    type: "opus"
  });
  return dispatcher;
};
export { _getYtdlConnectionDispatcher as getYtdlConnectionDispatcher };
