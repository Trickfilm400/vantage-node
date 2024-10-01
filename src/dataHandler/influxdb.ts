import { DataReceiver } from '../lib/dataReceiver';
import { DataPackage } from '../interfaces/IPackage';
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import config from '../config';
import { logger } from '../core/logger';

export class Influxdb extends DataReceiver<DataPackage> {
  private writerClient: WriteApi | undefined;
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
    logger.debug('Influxdb data', data);
    if (!this.writerClient) return;

    let key: keyof DataPackage;
    const points: Point[] = [];
    for (key in data) {
      const point = new Point(key);
      point.floatField('value', data[key]);
      points.push(point);
    }
    this.writerClient.writePoints(points);
  }
  cleanup() {
    this.writerClient?.close();
  }
}
