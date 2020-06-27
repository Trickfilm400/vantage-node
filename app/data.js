let round = r => (Math.round((r+Number.EPSILON) * 100) / 100);
const core = require('../core/core.js');
const DB = require('../core/db.js');
const IO = require('./socket.js');
const Many = require('extends-classes');
const conf = require('../config.json');
class Data extends Many(DB,IO) {
	constructor() {
		super();
		this.DB_connect();
		this.dataarray = {};
		this.init();
		this.max_elements = 32;
		this.conf_short_arr = true;
		this.conf_write_db = false || conf.db_enabled;
	}
	init () {
		this.dataarray =  {
			barometer: [],
			intemp: [],
			inhum: [],
			outtemp: [],
			outhum: [],
			windspeed: [],
			winddir: [],
			rainrate: [],
			dayrain: []
		};
	}
	/**
	 * @param {Object} data - data Object of data values
	 * @param {Number} data.barometer - hPa
	 * @param {Number} data.intemp - Celsius
	 * @param {Number} data.inhum - relative Percent
	 * @param {Number} data.outtemp - Celsius
	 * @param {Number} data.windspeed - km/h
	 * @param {Number} data.winddir - Degrees, 0° = N
	 * @param {Number} data.outhum - rel. Percent
	 * @param {Number} data.dayrain - rain clicks
	 * @param {Number} data.rainrate - rain clicks
	 */
	add_data(data) {
		this.IO_send(data);
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				this.dataarray[key].push(data[key]);
				if (this.conf_short_arr) {
					if (this.dataarray[key].length > this.max_elements) {
						this.dataarray[key].shift();
					}
				}
			}
		}
	}
	get_one_min() {
		let data = {};
		for (let key in this.dataarray) {
			if(this.dataarray.hasOwnProperty(key)) {
				let arr = this.dataarray[key].slice();
				if (key === "windspeed") {
					data["windspeed_max"] = Math.max(...arr);
				}
				if (key === "dayrain") {
					data[key] = arr[arr.length-1];
					continue;
				}
				data[key] = round(core.sum(arr) / arr.length);
			}
		}
		//console.log(data);
		if (this.conf_write_db) this.DB_insert(data);
	}
	closeDB() {
		this.closeMysql();
	}
}

module.exports = new Data();