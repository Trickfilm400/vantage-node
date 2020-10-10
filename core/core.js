/**
 *
 * @param {Array} input - Array to sum up
 * @return {boolean|number} - Sum of array
 */
function sum(input){

	if (toString.call(input) !== "[object Array]")
		return false;

	let total =  0;
	for(let i=0;i<input.length;i++)
	{
		if(isNaN(input[i])){
			continue;
		}
		total += Number(input[i]);
	}
	return total;
}

/**
 *
 * @param {Buffer} buffer - Buffer from Telnet connection (Weatherstation vantage pro 2)
 * @return {{inhum: number, outtemp: number, outhum: number, dayrain: number, rainrate: number, intemp: number, barometer: number, windspeed: number, winddir: number}} - Mostly used values of data packet
 */
function parser (buffer) {
	/**
	 * Checks if the buffer is a loop and also the first one
	 * @return {Boolean}
	 */
	let isFirstLoop = buffer.length === 100 && buffer.toString('utf8', 1, 4) === 'LOO';

	/**
	 * Checks if the buffer is a loop
	 * @return {Boolean}
	 */
	let isLoop = isFirstLoop || buffer.length === 99 && buffer.toString('utf8', 0, 3) === 'LOO';
	if (isLoop) {
		let m = isFirstLoop ? 1 : 0;
		let dat = {
			barometer:  (((buffer.readUInt16LE(7+m) *25.399999705)/1000)/0.75),
			intemp:     (((buffer.readUInt16LE(9+m) / 10) - 32) * 5/9 ),
			inhum:      buffer.readInt8(11+m),
			outtemp:    (((buffer.readUInt16LE(12+m) / 10) -32 ) * 5/9),
			windspeed:  (buffer.readInt8(14+m) * 1.6),
			winddir:    buffer.readUInt16LE(16+m),
			outhum:     buffer.readInt8(33+m),
			dayrain:    buffer.readUInt16LE(50+m)*0.2,
			rainrate:   (buffer.readUInt16LE(41+m)*0.01)*25.4
			//uvindex:		buffer.readUInt16LE(43+m)
			//crc:            buffer.readUInt16LE(97+m)
		};
		function check_valid_packet(dat) {
			return dat.barometer >= 0 && !isNaN(dat.barometer) &&
				!isNaN(dat.intemp) &&
				!isNaN(dat.inhum) &&
				!isNaN(dat.outtemp) &&
				!isNaN(dat.outhum) &&
				!isNaN(dat.windspeed) &&
				!isNaN(dat.winddir) &&
				!isNaN(dat.dayrain) &&
				!isNaN(dat.rainrate);
		}

		if (check_valid_packet(dat)) return dat;
		else {
			console.log(dat);
		}

	}
}



//export
module.exports.sum = sum;
module.exports.parse = parser;
