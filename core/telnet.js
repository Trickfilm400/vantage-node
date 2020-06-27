let Telnet = require('telnet-client');
const parse = require('./core.js').parse;
const Data = require('../app/data.js');
const config = require('../config.json');
log = string => console.log(Date() + " => " + string);
class weather_station {
	/**
	 * @param {String} host - IP Address
	 * @param {Number || String} port - TCP port for Telnet
	 */
	constructor(host, port=config["vantage-port"] || 22222) {
		this.c = new Telnet();
		//this.connected = null;
		this.firstpackage = -1;
		this.params = {
			host: host,
			port: parseInt(port),
			negotiationMandatory: false,
			timeout: 2500
		};
		let self = this;

		//reconnect on timeout
		this.c.on('timeout', function() {
			self.connected = false;
			//try to connect again
			self.c.connect(self.params).then(_ => {
				log("[WARN] " + new Date() + " - Reconnecting Telnet cause of connection timeout");
				//sending trigger string
				self.c.send("LOOP -1").then(_ => {
					log("[DATA] Data after timeout");
				}).catch(_ => {
					log("[ERROR] - on timeout: " + _);
					self.firstpackage = -2;
				});
				self.connected = true;
				self.firstpackage = -1;
			}).catch(e => {
				log("Error connection after Timeout!" + e);
			});
			//log('[ERR] Telnet Connection timeout');
		});
		//receive data
		this.c.on('data', function(d) {
			//d => buffer
			//log(parse(d));
			self.firstpackage++;
			if(self.firstpackage > 1 && self.connected === true) Data.add_data(parse(d));
		});
		//connection closing at end of program
		this.c.on('close', function() {
			this.connected = false;
			log('[INFO] telnet connection closed successfully');
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
			log("[INFO] Telnet connection connected");
			//connection.end()
		});
	}
	connect() {
		let self = this;
		this.c.connect(this.params).then(_ => {
			self.firstpackage = -1;
			self.c.send("LOOP -1").then(_ => {
				log("[DATA] Got Data connected function");
			}).catch(_ => {
				log("[ERROR] on connect: " + _);
				self.firstpackage = -2;
			});
			self.connected = true;
		});
	}
	end(cb) {
		log("[INFO] Attempting to close telnet connection...");
		log("[INFO] Attempting to close database connection...");
		Data.closeDB();
		this.c.end().then(_ => {
			log("[INFO] telnet Connection closed");
			cb();
		});
	}
}

let t = new weather_station(config["vantage-url"]);
t.connect();


module.exports = t;