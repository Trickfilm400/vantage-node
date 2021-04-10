import { IPackage } from '../interfaces/IPackage';

/**
 *
 * @param {Buffer} buffer - Buffer from Telnet connection (Weatherstation vantage pro 2)
 * @return {{inhum: number, outtemp: number, outhum: number, dayrain: number, rainrate: number, intemp: number, barometer: number, windspeed: number, winddir: number}} - Mostly used values of data packet
 */
export interface IPackageParserReturnValue {
  error: boolean;
  data: IPackage | null;
}
export default function (buffer: any): IPackageParserReturnValue {
  //check if buffer is given
  if (!buffer)
    return {
      error: true,
      data: null,
    };
  /**
   * Checks if the buffer is a loop and also the first one
   * @return {Boolean}
   */
  let isFirstLoop =
    buffer.length === 100 && buffer.toString('utf8', 1, 4) === 'LOO';

  /**
   * Checks if the buffer is a loop
   * @return {Boolean}
   */
  let isLoop =
    isFirstLoop ||
    (buffer.length === 99 && buffer.toString('utf8', 0, 3) === 'LOO');
  if (isLoop) {
    let m = isFirstLoop ? 1 : 0;
    let dat: IPackage = {
      barometer: (buffer.readUInt16LE(7 + m) * 25.399999705) / 1000 / 0.75,
      inTemperature: ((buffer.readUInt16LE(9 + m) / 10 - 32) * 5) / 9,
      inHumidity: buffer.readInt8(11 + m),
      outTemperature: ((buffer.readUInt16LE(12 + m) / 10 - 32) * 5) / 9,
      windSpeed: buffer.readInt8(14 + m) * 1.6,
      windDirection: buffer.readUInt16LE(16 + m),
      outHumidity: buffer.readInt8(33 + m),
      dayRain: buffer.readUInt16LE(50 + m) * 0.2,
      rainRate: buffer.readUInt16LE(41 + m) * 0.01 * 25.4,
      //uvindex:		buffer.readUInt16LE(43+m)
      //crc:            buffer.readUInt16LE(97+m)
    };
    function check_valid_packet(dat: IPackage) {
      return (
        dat.barometer >= 0 &&
        !isNaN(dat.barometer) &&
        !isNaN(dat.inTemperature) &&
        !isNaN(dat.inHumidity) &&
        !isNaN(dat.outTemperature) &&
        !isNaN(dat.outHumidity) &&
        !isNaN(dat.windSpeed) &&
        !isNaN(dat.windDirection) &&
        !isNaN(dat.dayRain) &&
        !isNaN(dat.rainRate)
      );
    }

    if (check_valid_packet(dat))
      return {
        data: dat,
        error: false,
      };
    else {
      console.log(dat);
      return {
        error: true,
        data: dat,
      };
    }
  } else {
    return {
      error: true,
      data: null,
    };
  }
}
