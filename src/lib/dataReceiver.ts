import DataEmitter from './dataEmitter';
import { DataArrayPackage, DataPackage } from '../interfaces/IPackage';
import DataHandler from './dataHandler';

export abstract class DataReceiver<T> {
  protected constructor(registeredDataChannel: string | null = 'default') {
    //if null - do not register event listener - disable callback function
    if (registeredDataChannel === null) return;
    DataEmitter.on(registeredDataChannel, (t) => this.onData(t));
  }

  abstract onData(data: T): void;

  //method will be called on programm exit
  cleanup() {}

  /**
   * - last data (single values)
   * - with windSpeedMax and latest dayRain
   * @protected
   */
  protected getLastDataset() {
    let data = <DataPackage>{};
    let key: keyof DataArrayPackage;
    for (key in DataHandler.data) {
      if (DataHandler.data.hasOwnProperty(key)) {
        //todo what the heck is this?
        let arr = DataHandler.data[key].slice();
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
}
