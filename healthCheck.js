const http = require('http');
const config = require(__dirname + '/dist/config/index.js');
const options = {
  hostname: '127.0.0.1',
  port: config.default.get('socket.port'),
  path: '/healthcheck',
  method: 'GET',
};

const req = http.request(options, (res) => {
  // console.log(`statusCode: ${res.statusCode}`);

  res.on('data', (d) => {
    d = JSON.parse(d.toString());
    console.log(d);
    if (Date.now() - d.value < 30 * 1000) process.exit(0);
    else process.exit(1);
  });
});

req.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

req.end();
