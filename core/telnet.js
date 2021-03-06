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
		this.end_telnet_conenction_manually = false;
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
		this.c.on('data', d => {
			//d => buffer
			//log(parse(d));
			this.firstpackage++;
			if(this.firstpackage > 1 && this.connected === true) Data.add_data(parse(d));
		});
		//connection closing at end of program
		this.c.on('close', () => {
			log("[INFO] received close event");
			if (this.end_telnet_conenction_manually === true) {
				this.connected = false;
				log('[INFO] telnet connection closed successfully');
			} else {
				//reconnect telnet connection
				this.c.connect(this.params).then(() => {
					log("[WARN] " + new Date() + " - Reconnecting Telnet cause of connection closing");
					//sending trigger string
					self.c.send("LOOP -1").then(_ => {
						log("[DATA] Data after closed connection");
					}).catch(_ => {
						log("[ERROR] - on close-reconnect: " + _);
						self.firstpackage = -2;
					});
					self.connected = true;
					self.firstpackage = -1;
				}).catch(e => {
					log("Error connection after closed connection!" + e);
				});
			}
		});
		//receiving errors
		this.c.on('error', function (e) {
			//this.connected = false;
			self.firstpackage = -1;
			self.connected = false;
			log("[TELNET-ERROR] " + e)
			self.c.connect(self.params).then(() => {
				log("[WARN] " + new Date() + " - Reconnecting Telnet cause of connection error");
				//sending trigger string
				self.c.send("LOOP -1").then(_ => {
					log("[DATA] Data after connection error");
				}).catch(_ => {
					log("[ERROR] - on error while reconnecting: " + _);
					self.firstpackage = -2;
				});
				self.connected = true;
				self.firstpackage = -1;
			}).catch(e => {
				log("Error connection after Timeout!" + e);
			})
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
		this.end_telnet_conenction_manually = true;
		this.c.end().then(_ => {
			log("[INFO] telnet Connection closed");
			cb();
		});
	}
}

let t = new weather_station(config["vantage-url"]);
t.connect();


module.exports = t;
