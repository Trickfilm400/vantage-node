console.log(process.uptime() + " Starting...");
//dependencies
const ws = require('./core/telnet.js');
const Data = require('./app/data.js');
setInterval(_ => {
	Data.get_one_min();
}, 60 * 1000);
//const socket = require('./app/socket.js');
process.on("SIGINT", _ => {
	ws.end(_ => {
		process.exit(0);
	});
});
