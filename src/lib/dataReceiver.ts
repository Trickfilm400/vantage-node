import DataEmitter from './dataEmitter';
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
    return DataHandler.getLastDataset();
  }
}
