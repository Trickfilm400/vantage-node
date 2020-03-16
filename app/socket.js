const conf = require('../config.json');
class IO {
	constructor() {
		this.server = require('socket.io')();
		this.server.on("connection", _ => {
			console.log("[SOCKET] New Socket Connection.");
		});
		this.server.listen(parseInt(conf.socket_server_port) || 3010);
	}
	IO_send (packet) {
		this.server.sockets.emit('data', packet);
	}
}

module.exports = IO;