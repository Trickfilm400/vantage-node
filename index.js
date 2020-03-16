console.log(process.uptime() + " Starting...");
//dependencies
const ws = require('./core/telnet.js');
const Data = require('./app/data.js');
const conf = require('./config.json');
setInterval(_ => {
	Data.get_one_min();
}, conf.database_save_interval * 1000);
//const socket = require('./app/socket.js');
process.on("SIGINT", _ => {
	ws.end(_ => {
		process.exit(0);
	});
});
