import * as prom from 'prom-client';
import { DataReceiver } from '../lib/dataReceiver';
import { DataPackage } from '../interfaces/IPackage';
export class Prometheus extends DataReceiver<DataPackage> {
  private metrics: Record<string, prom.Histogram> = {};
  constructor() {
    super();

    const helpMapping: Record<string, string> = {
      barometer: 'Air Pressure',
      dayRain: 'Day Rain accumulated',
      inHumidity: 'Indoor Humidity',
      outHumidity: 'Outdoor Humidity',
      outTemperature: 'Outdoor Temperature',
      inTemperature: 'Indoor Temperature',
      rainRate: 'Current Rain Rate',
      windDirection: 'Wind Direction',
      windSpeed: 'Current Wind Speed',
    };

    for (const key in helpMapping) {
      this.metrics[key] = new prom.Histogram({
        name: key,
        help: helpMapping[key],
      });
    }
  }
  onData(data: DataPackage) {
    let key: keyof DataPackage;
    for (key in data) {
      this.metrics[key].observe(data[key]);
    }
  }
}

export const prometheusRegister = prom.register;
