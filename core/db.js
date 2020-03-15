const mysql = require('mysql');

class DB {
	constructor() {
		this.conn = mysql.createConnection({
			host: "192.168.2.52"/*bigdb*/,
			user: "weather",
			password: "ooxFP87YMxDtUcR8Ldf5",
			database: "weather"
		});
	}
	DB_connect() {
		this.conn.connect();
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
			else console.log("[INFO] Insertet new MySQL from MysSQL class");
			//console.log(results);
		});
	}
}

module.exports = DB;