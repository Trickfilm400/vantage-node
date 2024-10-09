import { DataReceiver } from '../lib/dataReceiver';
import { DataPackage } from '../interfaces/IPackage';
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import config from '../config';

export class Influxdb extends DataReceiver<DataPackage> {
  private writerClient: WriteApi | undefined;
  private lastValues: DataPackage = <DataPackage>{};
  constructor() {
    super();
    if (config.get('influxdb.enabled')) {
      const influxDB = new InfluxDB({
        url: config.get('influxdb.url'),
        token: config.get('influxdb.api_token'),
      });
      this.writerClient = influxDB.getWriteApi(
        config.get('influxdb.organisation'),
        config.get('influxdb.bucket')
      );
    }
  }
  onData(data: DataPackage): void {
    //logger.debug('Influxdb data', data);
    if (!this.writerClient) return;

    let key: keyof DataPackage;
    const points: Point[] = [];
    for (key in data) {
      //skip if value has not changed since the last package to reduce load on the database saving part
      // AND setting is true to skip values
      if (
        config.get('influxdb.skip_same_values') &&
        data[key] === this.lastValues[key]
      )
        continue;
      const point = new Point(key);
      point.floatField('value', data[key]);
      points.push(point);
      this.lastValues[key] = data[key];
    }
    this.writerClient.writePoints(points);
  }
  cleanup() {
    this.writerClient?.close();
  }
}
