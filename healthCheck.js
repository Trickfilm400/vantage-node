const config = require(__dirname + '/dist/config/index.js');
const options = {
  hostname: '127.0.0.1',
  port: config.default.get('socket.port'),
  path: '/healthcheck',
  method: 'GET',
};

fetch(`http://${options.hostname}:${options.port}${options.path}`).then(response => response.json()).then(data => {
  console.log(data);
  if (Date.now() - data.value < 30 * 1000) process.exitCode = 0;
  else process.exitCode = 1;
}).catch(error => {
  console.log(error)
  process.exitCode = 1;
})