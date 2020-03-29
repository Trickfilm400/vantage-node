console.log(process.uptime() + " Starting...");
//dependencies
const ws = require('./core/telnet.js');
console.log(process.uptime() + " Loaded telnet.js class file");
const Data = require('./app/data.js');
console.log(process.uptime() + " Loaded data.js class file");
const conf = require('./config.json');
console.log(process.uptime() + " Loaded config file");
setInterval(_ => {
	Data.get_one_min();
}, conf.database_save_interval * 1000);
//const socket = require('./app/socket.js');
process.on("SIGINT", _ => {
	console.log("\n");
	ws.end(_ => {
		process.exit(0);
	});
});
