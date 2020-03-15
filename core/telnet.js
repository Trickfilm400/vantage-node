let Telnet = require('telnet-client');
const parse = require('./core.js').parse;
const Data = require('../app/data.js');
class weather_station {
	constructor(host, port=22222) {
		this.c = new Telnet();
		//this.connected = null;
		this.firstpackage = -1;
		this.params = {
			host: host,
			port: port,
			negotiationMandatory: false,
			timeout: 2500
		};
		let self = this;

		//reconnect on timeout
		this.c.on('timeout', function() {
			self.connected = false;
			//try to connect again
			self.c.connect(self.params).then(_ => {
				console.log("[WARN] " + new Date() + " - Reconnecting Telnet cause of connection timeout");
				//sending trigger string
				self.c.send("LOOP -1").then(_ => {
					console.log("[DATA] Data after timeout");
				}).catch(_ => {
					console.log("[ERROR] - on timeout: " + _);
					self.firstpackage = -2;
				});
				self.connected = true;
				self.firstpackage = -1;
			}).catch(e => {
				console.log("Error connection after Timeout!" + e);
			});
			//console.log('[ERR] Telnet Connection timeout');
		});
		//receive data
		this.c.on('data', function(d) {
			//d => buffer
			//console.log(parse(d));
			self.firstpackage++;
			if(self.firstpackage > 1 && self.connected === true) Data.add_data(parse(d));
		});
		//connection closing at end of program
		this.c.on('close', function() {
			this.connected = false;
			console.log('[INFO] telnet connection closed successfully');
		});
		//receiving errors
		this.c.on('error', function (e) {
			//this.connected = false;
			self.firstpackage = -1;
			console.log("[TELNET-ERROR] " + e)
		});
		//on connection establishments
		this.c.on('connect', function () {
			self.firstpackage = -1;
			console.log("[INFO] Telnet connection connected");
			//connection.end()
		});
	}
	connect() {
		let self = this;
		this.c.connect(this.params).then(_ => {
			self.firstpackage = -1;
			self.c.send("LOOP -1").then(_ => {
				console.log("[DATA] Got Data connected function");
			}).catch(_ => {
				console.log("[ERROR] on connect: " + _);
				self.firstpackage = -2;
			});
			self.connected = true;
		});
	}
	end(cb) {
		console.log("[INFO] Attempting to close telnet connection...");
		this.c.end().then(_ => {
			console.log("[INFO] telnet Connection closed");
			cb();
		});
	}
}

let t = new weather_station("192.168.178.25");
t.connect();


module.exports = t;