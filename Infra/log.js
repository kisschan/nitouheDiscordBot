import https from 'https';
export const log = function(title, text, msg) {
  const req = https.request(process.env.LOG_WEBHOOK || process.env.ERROR_WEBHOOK, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  });
  req.on('error', err => {
    if (msg)
      msg.channel.send('WEBHOOKのPOSTが失敗しました。LOG_WEBHOOKが設定されてないかも');
    console.error([title, text]);
  });
  req.write(JSON.stringify({username: title, content: text}));
  req.end();
};
