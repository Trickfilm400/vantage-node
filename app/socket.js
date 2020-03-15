class IO {
	constructor() {
		this.server = require('socket.io')();
		this.server.on("connection", _ => {
			console.log("[SOCKET] New Socket Connection.");
		});
		this.server.listen(3010);
	}
	IO_send (packet) {
		this.server.sockets.emit('data', packet);
	}
}

module.exports = IO;