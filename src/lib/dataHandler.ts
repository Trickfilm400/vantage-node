import {
  DataArrayPackage,
  DataPackage,
  IPackage,
} from '../interfaces/IPackage';
import sum from '../core/sum';
import Telnet from './telnet';
import packageParser from './packageParser';
import config from '../config';
import dataEmitter from './dataEmitter';
import { logger } from '../core/logger';

export default class DataHandler {
  private dataArray: DataArrayPackage = {
    barometer: [],
    dayRain: [],
    inHumidity: [],
    outHumidity: [],
    outTemperature: [],
    inTemperature: [],
    rainRate: [],
    windDirection: [],
    windSpeed: [],
  };
  static data: DataArrayPackage;
  private lastDataReceived = 0;
  private telnet = new Telnet();
  private readonly maxArrayElements = 60;
  private round = (r: number) => Math.round((r + Number.EPSILON) * 100) / 100;

  constructor() {
    this.telnet.on('data', (data) => this.parseData(data, this));

    let intervalSeconds = config.get('saveinterval') * 1000;

    setInterval(this.get_one_min, intervalSeconds, this);
  }

  private parseData(data: any, self: this) {
    const d = packageParser(data);
    if (d.error || !d.data) {
      logger.error(
        '(HANDLER) Could not parse LOOP-Telnet Package correctly...'
      );
    } else {
      self.addData(d.data);
    }
  }

  public addData(data: IPackage) {
    let roundedValues = <IPackage>{};
    //save newest values
    let key: keyof IPackage;
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        roundedValues[key] = this.round(data[key]);
        this.dataArray[key].push(roundedValues[key]);
        if (this.dataArray[key].length > this.maxArrayElements) {
          this.dataArray[key].shift();
        }
      }
    }
    DataHandler.data = this.dataArray;
    this.lastDataReceived = Date.now();
    //send to socket io etc
    dataEmitter.sendData(roundedValues);
  }

  public async get_one_min(self: this) {
    //todo check if it is working
    if (this.lastDataReceived + 15000 < Date.now()) {
      logger.warn(
        '(HANDLER) Did not received new data for about ' +
          (Date.now() - this.lastDataReceived) +
          ' ms\nSkipping DB Save...\nTelnet Connection is ' +
          (this.telnet.connected ? 'connected' : 'Disconnected')
      );
      return;
    }
    let data = <DataPackage>{};
    let key: keyof DataArrayPackage;
    for (key in self.dataArray) {
      if (self.dataArray.hasOwnProperty(key)) {
        let arr = self.dataArray[key].slice();
        if (key === 'windSpeed') {
          data['windSpeedMax'] = Math.max(...arr);
        }
        if (key === 'dayRain') {
          data[key] = arr[arr.length - 1];
          continue;
        }
        data[key] = self.round(sum(arr) / arr.length);
      }
    }
    dataEmitter.sendData(data, 'mysql');
  }

  static getLastDataset() {
    const data = <DataPackage>{};
    let key: keyof DataArrayPackage;
    for (key in DataHandler.data) {
      if (DataHandler.data.hasOwnProperty(key)) {
        //todo what the heck is this?
        const arr = DataHandler.data[key].slice();
        if (key === 'windSpeed') {
          data['windSpeedMax'] = Math.max(...arr);
        }
        if (key === 'dayRain') {
          data[key] = arr[arr.length - 1];
          continue;
        }
        data[key] =
          DataHandler.data[key][DataHandler.data[key].length - 1] ?? -1;
        //data[key] = this.round(sum(arr) / arr.length);
      }
    }
    console.log(data);
    return data;
  }

  close(): Promise<true> {
    return this.telnet.end();
  }
}
