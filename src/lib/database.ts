import * as mysql from 'mysql';
import config from '../config';
import { Connection } from 'mysql';
import * as fs from 'fs';
import { DataPackage } from '../interfaces/IPackage';
import { error, log } from '../core/log';
import * as path from 'path';

class Database {
  private readonly mysql: Connection | null = null;
  private readonly enabled: boolean = false;
  constructor() {
    if (config.get('mysql.enabled') === true) {
      log('<MySQL> Creating MySQL Connection');
      this.mysql = mysql.createConnection({
        host: config.get('mysql.ip'),
        port: parseInt(config.get('mysql.port')),
        database: config.get('mysql.database'),
        user: config.get('mysql.username'),
        password: config.get('mysql.password'),
      });

      this.enabled = true;
    }
  }
  async checkTableExistent() {
    return new Promise<any>((resolve, reject) => {
      const schema = fs
        .readFileSync(
          path.join(__dirname, '..', '..', 'static', 'databaseSchema.sql')
        )
        .toString();
      if (this.enabled && this.mysql)
        this.mysql.query(schema, (err) => {
          if (err) {
            error('<MySQL> Could not check for database, disabling MYSQL...');
            error(err);
            reject(err);
          } else {
            log('<MySQL> Checked Mysql Table Schema... OK');
            resolve(true);
          }
        });
    });
  }
  async connect() {
    return new Promise((resolve, reject) => {
      if (this.enabled && this.mysql) {
        log('<MySQL> Connecting to MYSQL...');
        this.mysql.connect((e) => {
          if (e) {
            error('<MySQL> Error while connection to mysql...');
            error(e);
            reject(e);
          } else {
            log('<MySQL> Connected to MYSQL... OK');
            resolve(true);
          }
        });
      }
    });
  }
  async insert(data: DataPackage) {
    return new Promise((resolve, reject) => {
      if (this.enabled && this.mysql) {
        this.mysql.query(
          'INSERT INTO log (`time`, `station_id`, `barometer`, `in_temp`, `in_hum`, `out_temp`,' +
            ' `out_hum`, `wind_speed`, `max_win_speed`, `wind_dir`, `dayrain`, `rainrate`) VALUES (?, ?, ?, ?, ?, ?,' +
            ' ?, ?, ?, ?, ?, ?);',
          [
            Math.floor(Date.now() / 1000),
            1,
            data.barometer,
            data.inTemperature,
            data.inHumidity,
            data.outTemperature,
            data.outHumidity,
            data.windSpeed,
            data.windSpeedMax,
            data.windDirection,
            data.dayRain,
            data.rainRate,
          ],
          (err) => {
            if (err) {
              error(err);
              reject(err);
            } else {
              log('<MySQL> Inserted new Data into MySQL');
              resolve(true);
            }
          }
        );
      }
    });
  }
  async closeMySQL() {
    if (this.enabled) {
      log('<MySQL> Closing Mysql Connection');
      return new Promise((resolve, reject) => {
        if (this.enabled && this.mysql) {
          this.mysql.end(() => {
            log('<MySQL> Closed Mysql Connection... OK');
            resolve(true);
          });
        } else reject('<MySQL> There is no MySQL connection to end...');
      });
    }
  }
}
export default Database;
