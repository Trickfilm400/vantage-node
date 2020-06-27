const mysql = require('mysql');
const conf = require('../config.json');
log = string => console.log(Date() + " => " + string);
class DB {
	constructor() {
		if (conf.db_enabled) this.conn = mysql.createConnection(conf.db);
	}
	DB_connect() {
		if (conf.db_enabled) this.conn.connect();
	}
	DB_insert(json) {
		this.conn.query('INSERT INTO log (`time`, `station_id`, `barometer`, `in_temp`, `in_hum`, `out_temp`, `out_hum`, `wind_speed`, `max_win_speed`, `wind_dir`, `dayrain`, `rainrate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [
			Math.floor(Date.now() / 1000),
			1,
			json.barometer,
			json.intemp,
			json.inhum,
			json.outtemp,
			json.outhum,
			json.windspeed,
			json.windspeed_max,
			json.winddir,
			json.dayrain,
			json.rainrate
		],  function (error) {
			if (error) throw error;
			else log("[INFO] Insertet new MySQL from MysSQL class");
			//console.log(results);
		});
	}
	closeMysql() {
		this.conn.end();
		log("[INFO] Closed Mysql connection.");
	}
}

module.exports = DB;