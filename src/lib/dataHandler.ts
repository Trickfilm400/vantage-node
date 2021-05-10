import {
  DataArrayPackage,
  DataPackage,
  IPackage,
} from '../interfaces/IPackage';
import Database from './database';
import sum from '../core/sum';
import SocketIO from './socket';
import Telnet from './telnet';
import packageParser from './packageParser';
import config from '../config';
import { error, log, warn } from '../core/log';

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
  private lastDataReceived = 0;
  private mysql = new Database();
  private telnet = new Telnet();
  private socket: SocketIO;
  private readonly maxArrayElements = 60;
  private round = (r: number) => Math.round((r + Number.EPSILON) * 100) / 100;

  constructor() {
    this.mysql.connect().then(() => {
      log('<MYSQL> Checking MySQL Schema...');
      this.mysql
        .checkTableExistent()
        .then(() => {
          log('<MYSQL> Schema should be created');
        })
        .catch((e) => {
          error('<MYSQL> There is an error while checking the MySQL Schema...');
          error(e);
        });
    });
    this.telnet.dataEvent.on('data', (data) => this.parseData(data, this));

    let intervalSeconds = config.get('saveinterval') * 1000;

    setInterval(this.get_one_min, intervalSeconds, this);

    this.socket = new SocketIO(this);
  }

  private parseData(data: any, self: this) {
    const d = packageParser(data);
    if (d.error || !d.data) {
      error('<HANDLER> Could not parse LOOP-Telnet Package correctly...');
    } else {
      self.addData(d.data);
    }
  }

  public addData(data: IPackage) {
    //send data via socket.io, if enabled
    this.socket.sendData(data);
    //save newest values
    let key: keyof IPackage;
    for (key in data) {
      if (data.hasOwnProperty(key)) {
        this.dataArray[key].push(data[key]);
        if (this.dataArray[key].length > this.maxArrayElements) {
          this.dataArray[key].shift();
        }
      }
    }
    this.lastDataReceived = Date.now();
  }
  public async get_one_min(self: this) {
    if (this.lastDataReceived + 15000 < Date.now()) {
      return warn(
        '<HANDLER> Did not received new data for about ' +
          (Date.now() - this.lastDataReceived) +
          ' ms\nSkipping DB Save...\nTelnet Connection is ' +
          (this.telnet.connected ? 'connected' : 'Disconnected')
      );
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
    await self.mysql.insert(data);
  }

  public getLastDataset() {
    let data = <DataPackage>{};
    let key: keyof DataArrayPackage;
    for (key in this.dataArray) {
      if (this.dataArray.hasOwnProperty(key)) {
        let arr = this.dataArray[key].slice();
        if (key === 'windSpeed') {
          data['windSpeedMax'] = Math.max(...arr);
        }
        if (key === 'dayRain') {
          data[key] = arr[arr.length - 1];
          continue;
        }
        data[key] = this.dataArray[key][this.dataArray[key].length - 1] ?? -1;
        //data[key] = this.round(sum(arr) / arr.length);
      }
    }
    console.log(data);
    return data;
  }

  close(): Promise<true> {
    return new Promise((resolve) => {
      this.mysql
        .closeMySQL()
        .then(() => this.telnet.end())
        .then(() => resolve(true));
    });
  }
}
