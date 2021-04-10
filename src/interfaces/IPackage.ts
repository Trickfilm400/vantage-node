export interface IPackage {
  barometer: number;
  inTemperature: number;
  inHumidity: number;
  outTemperature: number;
  outHumidity: number;
  windSpeed: number;
  windDirection: number;
  dayRain: number;
  rainRate: number;
}

export interface DataPackage extends IPackage {
  windSpeedMax: number;
}

export interface DataArrayPackage {
  barometer: number[];
  inTemperature: number[];
  inHumidity: number[];
  outTemperature: number[];
  outHumidity: number[];
  windSpeed: number[];
  windDirection: number[];
  dayRain: number[];
  rainRate: number[];
}
